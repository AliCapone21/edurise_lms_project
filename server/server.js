import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import courseRouter from './routes/courseRoute.js';
import aiRouter from './routes/aiRoutes.js';
import contactRoutes from './routes/contactRoutes.js';


const app = express();

// Connect to database
await connectDB();
await connectCloudinary();

// Middlewares
app.use(cors());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send('API Working'));
app.post('/clerk', express.json(), clerkWebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);
app.use('/api/educator', express.json(), educatorRouter);
app.use('/api/course', express.json(), courseRouter);
app.use('/api/user', express.json(), userRouter);
app.use('/api/ai', express.json(), aiRouter);
app.use('/api/contact', express.json(), contactRoutes);


export default app; // <- Export for Jest use
