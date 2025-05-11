import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../../components/educator/SideBar';
import Navbar from '../../components/educator/Navbar';
import Footer from '../../components/educator/Footer';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';

const Educator = () => {
    const { userRole, userData } = useContext(AppContext);

    if (!userData) return <Loading />;

    if (userRole !== 'educator') {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold text-lg">
                Unauthorized access. Educator role required.
            </div>
        );
    }

    return (
        <div className="text-default min-h-screen bg-white">
            <Navbar />
            <div className="flex">
                <SideBar />
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Educator;
