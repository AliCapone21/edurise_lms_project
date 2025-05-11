import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const isCoursesListPage = location.pathname.includes('/course-list');

  const { backendUrl, navigate, getToken, userData, userRole, setUserRole } = useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (userRole === 'educator') {
        navigate('/educator');
        return;
      }

      if (userRole === 'educator_pending') {
        toast.info('Your request is under review.');
        return;
      }

      const token = await getToken();

      const { data } = await axios.get(backendUrl + '/api/educator/update-role', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message);
        setUserRole('educator_pending');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
      <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCoursesListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
        <img onClick={() => navigate('/')} src={assets.logo} alt="Logo" className="w-28 lg:w-32 cursor-pointer" />

        {/* Desktop view */}
        <div className="md:flex hidden items-center gap-5 text-gray-500">
          {user && (
              <>
                {/* Hide educator button if admin */}
                {userRole !== 'admin' && (
                    <button onClick={becomeEducator}>
                      {userRole === 'educator' ? 'Educator Dashboard' : 'Become Educator'}
                    </button>
                )}
                | <Link to="/my-enrollments">My Courses</Link>
                {userRole === 'admin' && (
                    <>
                      | <Link to="/admin" className="text-red-600 font-semibold">Admin Panel</Link>
                    </>
                )}
              </>
          )}

          {user ? (
              <UserButton />
          ) : (
              <button onClick={() => openSignIn()} className="bg-blue-600 text-white px-5 py-2 rounded-full">
                Create Account
              </button>
          )}
        </div>

        {/* Mobile view */}
        <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
          <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
            {user && userRole !== 'admin' && (
                <button onClick={becomeEducator}>
                  {userRole === 'educator' ? 'Educator Dashboard' : 'Become Educator'}
                </button>
            )}
            | {user && <Link to="/my-enrollments">My Courses</Link>}
            {user && userRole === 'admin' && <> | <Link to="/admin">Admin</Link> </>}
          </div>
          {user ? (
              <UserButton />
          ) : (
              <button onClick={() => openSignIn()}>
                <img src={assets.user_icon} alt="User Icon" />
              </button>
          )}
        </div>
      </div>
  );
};

export default Navbar;
