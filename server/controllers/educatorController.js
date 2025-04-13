// server/controllers/educatorController.js

import { v2 as cloudinary } from 'cloudinary';
import Course from '../models/Course.js';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express';
// import fs from 'fs' // Optional for cleanup

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        });

        res.json({ success: true, message: 'You can publish a course now' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Add New Course (with optional video uploads)
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.files?.image?.[0];
        const videoFiles = req.files || {};
        const educatorId = req.auth.userId;

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' });
        }

        const parsedCourseData = JSON.parse(courseData);
        parsedCourseData.educator = educatorId;

        // Upload thumbnail first
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        parsedCourseData.courseThumbnail = imageUpload.secure_url;

        // Upload all video lectures
        for (let chapterIndex = 0; chapterIndex < parsedCourseData.courseContent.length; chapterIndex++) {
            const chapter = parsedCourseData.courseContent[chapterIndex];

            for (let lectureIndex = 0; lectureIndex < chapter.chapterContent.length; lectureIndex++) {
                const fieldName = `video-${chapterIndex}-${lectureIndex}`;
                const fileEntry = videoFiles[fieldName]?.[0];

                if (fileEntry) {
                    console.log(`Uploading: ${fieldName} -> ${fileEntry.originalname}`);

                    const uploadedVideo = await cloudinary.uploader.upload(fileEntry.path, {
                        resource_type: 'video',
                        public_id: `lecture-${Date.now()}-${chapterIndex}-${lectureIndex}`,
                    });

                    chapter.chapterContent[lectureIndex].lectureUrl = uploadedVideo.secure_url;

                    // Optionally delete local temp video after upload (uncomment if needed)
                    // fs.unlinkSync(fileEntry.path);
                }
            }
        }

        // Create course with video + thumbnail URLs
        const newCourse = await Course.create(parsedCourseData);
        res.json({ success: true, message: 'Course Added' });

    } catch (error) {
        console.error('❌ Course creation failed:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Educator Dashboard Data
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const totalCourses = courses.length;
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed',
        });

        const totalEarnings = purchases.reduce((sum, p) => sum + p.amount, 0);

        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find(
                { _id: { $in: course.enrolledStudents } },
                'name imageUrl'
            );
            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student,
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses,
            },
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Enrolled Students
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed',
        })
            .populate('userId', 'name imageUrl')
            .populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt,
        }));

        res.json({
            success: true,
            enrolledStudents,
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
