import mongoose from 'mongoose';

const courseProgressSchema = new mongoose.Schema({
    userId: {
        type: String, // Clerk user ID (like user_XXXX)
        required: true,
        ref: 'User',
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course',
    },
    completed: {
        type: Boolean,
        default: false,
    },
    lectureCompleted: {
        type: [String], // Array of lecture IDs (usually uniqid strings)
        default: [],
    },
}, { timestamps: true });

export const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);
