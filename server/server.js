import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import connectCloudinary from './configs/cloudinary.js';

// Routes
import userRouter from './routes/userRoutes.js';
import educatorRouter from './routes/educatorRoutes.js';
import courseRouter from './routes/courseRoute.js';
import aiRouter from './routes/aiRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Webhooks
import { clerkMiddleware } from '@clerk/express';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';

const app = express();

// Connect to DB and Cloudinary
await connectDB();
await connectCloudinary();

// Webhook Routes (⚠️ BEFORE express.json)
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// General Middleware
app.use(cors());
app.use(clerkMiddleware()); // Clerk auth middleware
app.use(express.json()); // Global body parser (after raw routes)

// Health Check
app.get('/', (req, res) => res.send('🚀 API Working'));

// Main API Routes
app.use('/api/user', userRouter);
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/ai', aiRouter);
app.use('/api/contact', contactRoutes);

// Fallback route
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

export default app;
