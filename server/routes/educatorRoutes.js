import express from 'express';
import {
    addCourse,
    educatorDashboardData,
    getEducatorCourses,
    getEnrolledStudentsData,
    updateRoleToEducator
} from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator, protectAdmin } from '../middlewares/authMiddleware.js';
import User from '../models/User.js'; // ✅ Added User model import
import { clerkClient } from '@clerk/express'; // ✅ Added Clerk client import

const educatorRouter = express.Router();

// Get all educator role requests (pending)
educatorRouter.get('/requests', protectAdmin, async (req, res) => {
    try {
        const pendingUsers = await User.find({ role: 'educator_pending' });
        res.json({ success: true, users: pendingUsers });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Approve or Reject educator request
educatorRouter.post('/approve/:userId', protectAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { action } = req.body; // 'approve' or 'reject'

        if (!['approve', 'reject'].includes(action)) {
            return res.json({ success: false, message: 'Invalid action' });
        }

        const newRole = action === 'approve' ? 'educator' : 'student';

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: { role: newRole }
        });

        await User.findByIdAndUpdate(userId, { role: newRole });

        res.json({ success: true, message: `User has been ${action}d` });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Add Educator Role
educatorRouter.get('/update-role', updateRoleToEducator);

// Add Courses (supports image + video uploads)
educatorRouter.post(
    '/add-course',
    upload.fields([
        { name: 'image', maxCount: 1 },
        ...generateVideoFieldNames(20) // Allow up to 20 chapters × 20 lectures
    ]),
    protectEducator,
    addCourse
);

// Get Educator Courses
educatorRouter.get('/courses', protectEducator, getEducatorCourses);

// Get Educator Dashboard Data
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData);

// Get Educator Students Data
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData);

export default educatorRouter;

// Helper to generate dynamic field names for videos like video-0-0, video-0-1, etc.
function generateVideoFieldNames(max) {
    const fields = [];
    for (let i = 0; i < max; i++) {
        for (let j = 0; j < max; j++) {
            fields.push({ name: `video-${i}-${j}`, maxCount: 1 });
        }
    }
    return fields;
}
