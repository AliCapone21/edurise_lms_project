import express from 'express';
import Contact from '../models/contactModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        await Contact.create({ name, email, message });
        res.status(200).json({ success: true, message: 'Message received successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

export default router;
