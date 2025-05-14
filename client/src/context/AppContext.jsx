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
    const { user, clerk } = useUser();

    const [showLogin, setShowLogin] = useState(false);
    const [userRole, setUserRole] = useState("student");
    const [allCourses, setAllCourses] = useState([]);
    const [userData, setUserData] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    // ✅ Fetch All Courses
    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/course/all`);
            if (data.success) {
                setAllCourses(data.courses);
            } else {
                toast.error(data.message || "Failed to fetch courses");
            }
        } catch (error) {
            toast.error("Error loading courses");
            console.error("Courses Fetch Error:", error);
        }
    };

    // ✅ Fetch User Data
    const fetchUserData = async () => {
        try {
            await clerk?.user?.reload?.(); // Safe reload if clerk user exists

            const token = await getToken();
            const { data } = await axios.get(`${backendUrl}/api/user/data`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setUserData(data.user);
                const clerkRole = user?.publicMetadata?.role;
                const dbRole = data.user.role;
                setUserRole(clerkRole || dbRole || "student");
            } else {
                toast.error(data.message || "Failed to load user data");
            }
        } catch (error) {
            toast.error("Error loading user data");
            console.error("User Data Fetch Error:", error);
        }
    };

    // ✅ Fetch Enrolled Courses
    const fetchUserEnrolledCourses = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(`${backendUrl}/api/user/enrolled-courses`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success && Array.isArray(data.enrolledCourses)) {
                setEnrolledCourses([...data.enrolledCourses].reverse());
            } else {
                toast.info("No enrolled courses found");
                setEnrolledCourses([]);
            }
        } catch (error) {
            toast.error("Error loading enrolled courses");
            console.error("Enrolled Courses Fetch Error:", error);
        }
    };

    // 🔢 Utility Calculations
    const calculateChapterTime = (chapter) => {
        const totalMinutes = chapter.chapterContent.reduce(
            (sum, lecture) => sum + (lecture.lectureDuration || 0),
            0
        );
        return humanizeDuration(totalMinutes * 60000, { units: ["h", "m"] });
    };

    const calculateCourseDuration = (course) => {
        const totalMinutes = course.courseContent.reduce((sum, chapter) => {
            return sum + chapter.chapterContent.reduce((s, lec) => s + lec.lectureDuration, 0);
        }, 0);
        return humanizeDuration(totalMinutes * 60000, { units: ["h", "m"] });
    };

    const calculateRating = (course) => {
        if (!course.courseRatings.length) return 0;
        const total = course.courseRatings.reduce((sum, r) => sum + r.rating, 0);
        return Math.floor(total / course.courseRatings.length);
    };

    const calculateNoOfLectures = (course) => {
        return course.courseContent.reduce(
            (count, chapter) =>
                count + (Array.isArray(chapter.chapterContent) ? chapter.chapterContent.length : 0),
            0
        );
    };

    // ⏳ Load Initial Data
    useEffect(() => {
        fetchAllCourses();
    }, []);

    useEffect(() => {
        const loadUserAndCourses = async () => {
            if (user) {
                await fetchUserData(); // Ensure user is created in DB first
                await fetchUserEnrolledCourses();
            }
        };
        loadUserAndCourses();
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
