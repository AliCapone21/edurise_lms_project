import express from 'express';
import {
    addCourse,
    educatorDashboardData,
    getEducatorCourses,
    getEnrolledStudentsData,
    updateRoleToEducator
} from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router();

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
