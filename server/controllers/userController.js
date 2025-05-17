import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import stripe from "stripe";
import { clerkClient } from "@clerk/clerk-sdk-node";
import mongoose from 'mongoose'; // ← Add this at the top if not already

// ✅ Get User Data (and create if first login)
export const getUserData = async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;

        // Check if user exists in MongoDB
        let user = await User.findById(clerkUserId);

        if (!user) {
            const clerkUser = await clerkClient.users.getUser(clerkUserId);

            user = await User.create({
                _id: clerkUserId,
                name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
                email: clerkUser.emailAddresses[0]?.emailAddress || "",
                imageUrl: clerkUser.imageUrl,
                role: "student",
                enrolledCourses: [],
            });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error("User Fetch/Create Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Purchase Course
export const purchaseCourse = async (req, res) => {

    try {

        const { courseId } = req.body
        const { origin } = req.headers


        const userId = req.auth.userId

        const courseData = await Course.findById(courseId)
        const userData = await User.findById(userId)

        if (!userData || !courseData) {
            return res.json({ success: false, message: 'Data Not Found' })
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData)

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        // Creating line items to for Stripe
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })

        res.json({ success: true, session_url: session.url });


    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// ✅ Get User's Enrolled Courses
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId;
        console.log("📦 Incoming Clerk User ID:", userId);

        const user = await User.findById(userId);

        if (!user) {
            console.log("❌ No user found in MongoDB for ID:", userId);
            return res.status(404).json({ success: false, message: "User not found in database" });
        }

        // 🧹 Filter out undefined/invalid course IDs (handle both ObjectIds and strings)
        const cleanedIds = (user.enrolledCourses || []).filter(id => {
            if (!id) return false;
            try {
                return mongoose.Types.ObjectId.isValid(id.toString());
            } catch {
                return false;
            }
        });

        // ✅ Optional: permanently remove broken references (one-time cleanup)
        if (cleanedIds.length !== user.enrolledCourses.length) {
            user.enrolledCourses = cleanedIds;
            await user.save();
            console.log("🧹 Cleaned up user's enrolledCourses");
        }

        // 🧠 Now populate enrolled courses safely
        await user.populate('enrolledCourses');

        console.log("👀 Final Enrolled Courses:", user.enrolledCourses);
        res.json({ success: true, enrolledCourses: user.enrolledCourses });

    } catch (error) {
        console.error("🔥 Error in enrolledCourses:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// ✅ Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId, lectureId } = req.body;

        if (!userId || !courseId || !lectureId) {
            return res.status(400).json({ success: false, message: "Missing data" });
        }

        let progress = await CourseProgress.findOne({ userId, courseId });

        if (!progress) {
            progress = await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            });
        } else {
            if (!progress.lectureCompleted.includes(lectureId)) {
                progress.lectureCompleted.push(lectureId);
                await progress.save();
            }
        }

        res.json({ success: true, progress });
    } catch (error) {
        console.error("Progress Save Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get User Course Progress
export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId } = req.body;

        const progressData = await CourseProgress.findOne({ userId, courseId });

        res.json({ success: true, progressData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ✅ Add User Rating to Course
export const addUserRating = async (req, res) => {
    const userId = req.auth.userId;
    const { courseId, rating } = req.body;

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: "Invalid Details" });
    }

    try {
        const course = await Course.findById(courseId);
        const user = await User.findById(userId);

        if (!course) {
            return res.json({ success: false, message: "Course not found." });
        }

        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: "User has not purchased this course." });
        }

        const existingIndex = course.courseRatings.findIndex((r) => r.userId === userId);

        if (existingIndex > -1) {
            course.courseRatings[existingIndex].rating = rating;
        } else {
            course.courseRatings.push({ userId, rating });
        }

        await course.save();

        return res.json({ success: true, message: "Rating added" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
