import React, { useContext } from 'react';
import { Routes, Route, useMatch } from 'react-router-dom';
import Navbar from './components/student/Navbar';
import Home from './pages/student/Home';
import CourseDetails from './pages/student/CourseDetails';
import CoursesList from './pages/student/CoursesList';
import Dashboard from './pages/educator/Dashboard';
import AddCourse from './pages/educator/AddCourse';
import MyCourses from './pages/educator/MyCourses';
import StudentsEnrolled from './pages/educator/StudentsEnrolled';
import Educator from './pages/educator/Educator';
import 'quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Player from './pages/student/Player';
import MyEnrollments from './pages/student/MyEnrollments';
import Loading from './components/student/Loading';
import ContactUs from './pages/student/ContactUs';
import AdminPanel from './pages/admin/AdminPanel';
import ProtectedAdminRoute from './components/routes/ProtectedAdminRoute';

const App = () => {
  const isEducatorRoute = useMatch('/educator/*');

  return (
      <div className="text-default min-h-screen bg-white">
        <ToastContainer />
        {!isEducatorRoute && <Navbar />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/course-list" element={<CoursesList />} />
          <Route path="/course-list/:input" element={<CoursesList />} />
          <Route path="/my-enrollments" element={<MyEnrollments />} />
          <Route path="/player/:courseId" element={<Player />} />
          <Route path="/loading/:path" element={<Loading />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* ✅ Admin Route (Protected) */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminPanel />
            </ProtectedAdminRoute>
          } />

          {/* Educator Routes */}
          <Route path="/educator" element={<Educator />}>
            <Route path="/educator" element={<Dashboard />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="student-enrolled" element={<StudentsEnrolled />} />
          </Route>
        </Routes>
      </div>
  );
};

export default App;
