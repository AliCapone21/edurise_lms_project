import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const StudentsEnrolled = () => {
  const { backendUrl, getToken, userRole } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/enrolled-students`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message || 'Failed to load enrolled students');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while fetching students');
    }
  };

  useEffect(() => {
    if (userRole === 'educator') {
      fetchEnrolledStudents();
    }
  }, [userRole]);

  return userRole === 'educator' && enrolledStudents ? (
      <div className="min-h-screen w-full md:p-8 p-4">
        <h2 className="text-lg font-semibold mb-4">Students Enrolled</h2>

        {enrolledStudents.length === 0 ? (
            <p className="text-gray-500">No students have enrolled yet.</p>
        ) : (
            <div className="overflow-x-auto bg-white border border-gray-300 rounded-md">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100 border-b text-left">
                <tr>
                  <th className="px-4 py-3 hidden sm:table-cell text-center">#</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Course Title</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Date</th>
                </tr>
                </thead>
                <tbody>
                {enrolledStudents.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50 transition">
                      <td className="px-4 py-3 hidden sm:table-cell text-center">{index + 1}</td>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img
                            src={item.student.imageUrl}
                            alt="Student"
                            className="w-9 h-9 rounded-full object-cover border"
                        />
                        <span className="truncate">{item.student.name}</span>
                      </td>
                      <td className="px-4 py-3">{item.courseTitle}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {new Date(item.purchaseDate).toLocaleDateString()}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  ) : (
      <Loading />
  );
};

export default StudentsEnrolled;
