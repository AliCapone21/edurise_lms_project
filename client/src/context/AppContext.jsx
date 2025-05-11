import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user, clerk } = useUser(); // 🆕 added clerk

    const [showLogin, setShowLogin] = useState(false);
    const [userRole, setUserRole] = useState("student");
    const [allCourses, setAllCourses] = useState([]);
    const [userData, setUserData] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    // ✅ Fetch All Courses
    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/course/all');
            if (data.success) {
                setAllCourses(data.courses);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // ✅ Fetch User Data + Force Clerk metadata refresh
    const fetchUserData = async () => {
        try {
            await clerk?.user?.reload(); // 🆕 force refresh from Clerk

            const token = await getToken();
            const { data } = await axios.get(backendUrl + '/api/user/data', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setUserData(data.user);

                const clerkRole = user.publicMetadata?.role;
                const dbRole = data.user.role;
                setUserRole(clerkRole || dbRole || "student");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // ✅ Fetch Enrolled Courses
    const fetchUserEnrolledCourses = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // 🔢 Utilities
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.forEach(lecture => time += lecture.lectureDuration);
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    };

    const calculateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.forEach(chapter =>
            chapter.chapterContent.forEach(lecture =>
                time += lecture.lectureDuration
            )
        );
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    };

    const calculateRating = (course) => {
        if (!course.courseRatings.length) return 0;
        const total = course.courseRatings.reduce((sum, r) => sum + r.rating, 0);
        return Math.floor(total / course.courseRatings.length);
    };

    const calculateNoOfLectures = (course) => {
        return course.courseContent.reduce((count, chapter) => {
            return count + (Array.isArray(chapter.chapterContent) ? chapter.chapterContent.length : 0);
        }, 0);
    };

    // ⏳ Initial Loads
    useEffect(() => {
        fetchAllCourses();
    }, []);

    useEffect(() => {
        if (user) {
            fetchUserData();
            fetchUserEnrolledCourses();
        }
    }, [user]);

    const value = {
        showLogin, setShowLogin,
        backendUrl, currency, navigate,
        userData, setUserData, getToken,
        allCourses, fetchAllCourses,
        enrolledCourses, fetchUserEnrolledCourses,
        calculateChapterTime, calculateCourseDuration,
        calculateRating, calculateNoOfLectures,
        userRole, setUserRole
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
