import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Avatar from "../Seeker/Avatar";
import axios from 'axios';

const Navbar = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // You can later integrate this with your auth system to determine the role
  // Determine role from current URL path
  const getCurrentRole = () => {
    if (location.pathname.includes('/admin')) return 'admin';
    if (location.pathname.includes('/publisher')) return 'publisher';
    if (location.pathname.includes('/seeker')) return 'seeker';
    return 'seeker'; // default role
  };

  const getJobsLink = () => {
    const role = getCurrentRole();
    switch(role) {
      case 'seeker':
        return '/seeker/jobs';
      case 'publisher':
        return '/publisher/jobs';
      case 'admin':
        return '/admin/reports';
      default:
        return '/seeker/jobs';
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const getDashboardLink = () => {
    const role = getCurrentRole();
    return `/${role}/dashboard`;
  };

  const [profilePicture, setProfilePicture] = useState(null);
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/seeker/profile/${userId}?fields=profile_picture_path`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        setProfilePicture(response.data.profile_picture_path);
      } catch (error) {
        console.error('Failed to fetch profile picture:', error);
      }
    };

    if (userId) {
      fetchProfilePicture();
    }
  }, [userId]);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to={getDashboardLink()} className="text-xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">
              ProNetApp
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to={getDashboardLink()}
              className={`transition duration-300 ease-in-out ${
                isActiveRoute(getDashboardLink())
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to={getJobsLink()}
              className={`transition duration-300 ease-in-out ${
                location.pathname.includes('/jobs') || location.pathname.includes('/reports')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {getCurrentRole() === 'admin' ? 'Reports' : 'Jobs'}
            </Link>
            <Avatar profilePicture={profilePicture} userId={userId} />
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:hidden transition-all duration-300 ease-in-out`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to={getDashboardLink()}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActiveRoute(getDashboardLink())
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to={getJobsLink()}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname.includes('/jobs') || location.pathname.includes('/reports')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {getCurrentRole() === 'admin' ? 'Reports' : 'Jobs'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;