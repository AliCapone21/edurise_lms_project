import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const MyCourses = () => {
  const { backendUrl, userRole, currency, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCourses(data.courses);
      } else {
        toast.error(data.message || 'Failed to fetch courses');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  useEffect(() => {
    if (userRole === 'educator') {
      fetchEducatorCourses();
    }
  }, [userRole]);

  return userRole === 'educator' && courses ? (
      <div className="min-h-screen w-full md:p-8 p-4 pt-8">
        <h2 className="pb-4 text-lg font-semibold">My Courses</h2>
        {courses.length === 0 ? (
            <p className="text-gray-500">You haven't published any courses yet.</p>
        ) : (
            <div className="overflow-x-auto bg-white border border-gray-300 rounded-md">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100 border-b text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">All Courses</th>
                  <th className="px-4 py-3 font-semibold">Earnings</th>
                  <th className="px-4 py-3 font-semibold">Students</th>
                  <th className="px-4 py-3 font-semibold">Published On</th>
                </tr>
                </thead>
                <tbody>
                {courses.map((course) => {
                  const priceAfterDiscount = course.coursePrice - (course.discount * course.coursePrice) / 100;
                  const earnings = course.enrolledStudents?.length * priceAfterDiscount;

                  return (
                      <tr key={course._id} className="border-t hover:bg-gray-50 transition">
                        <td className="px-4 py-3 flex items-center gap-3">
                          <img
                              src={course.courseThumbnail}
                              alt="Course Thumbnail"
                              className="w-16 h-10 object-cover rounded"
                          />
                          <span className="truncate">{course.courseTitle}</span>
                        </td>
                        <td className="px-4 py-3">{currency} {Math.floor(earnings)}</td>
                        <td className="px-4 py-3">{course.enrolledStudents?.length || 0}</td>
                        <td className="px-4 py-3">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
        )}
      </div>
  ) : (
      <Loading />
  );
};

export default MyCourses;
