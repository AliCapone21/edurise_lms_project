import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true }, // ✅ Clerk ID
    name: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl: { type: String, required: true },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    role: {
        type: String,
        enum: ['student', 'educator_pending', 'educator', 'admin'],
        default: 'student'
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
