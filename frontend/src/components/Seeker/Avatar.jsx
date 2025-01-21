import React, { useState, useEffect } from 'react';
import { FaBuilding, FaChevronDown, FaChevronUp, FaCogs, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useGetCurrentRole } from "../../utils/roleUtils";
import axios from 'axios';

const Avatar = () => {
  const currentRole = useGetCurrentRole();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        if (currentRole === 'seeker') {
          const response = await axios.get(
            `http://localhost:5000/seeker/profile/${userId}?fields=profile_picture_path`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          setProfilePicture(response.data.profile_picture_path);
        } else if (currentRole === 'publisher') {
          const response = await axios.get(
            `http://localhost:5000/publisher/company-culture/${userId}?fields=publisher_logo`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          setProfilePicture(response.data.publisher_logo);
        }
      } catch (error) {
        console.error('Failed to fetch profile picture:', error);
      }
    };

    if (userId) {
      fetchProfilePicture();
    }
  }, [userId, currentRole]);

  // Toggle the dropdown menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative flex flex-col items-center gap-2">
      {/* Avatar and Dropdown Icon */}
      <div
        className="flex items-center gap-2 w-20 h-8 bg-blue-600 rounded-full shadow-[inset_0_8px_10px_rgba(0,0,0,0.15)] cursor-pointer"
        onClick={toggleMenu}
      >
        <div className="flex items-center px-1 w-12 h-12 rounded-full bg-white shadow">
          <img
            className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-blue-600"
            src={profilePicture ? `http://localhost:5000/${profilePicture}` : 'default_image_path.jpg'}
            alt="Profile"
          />
        </div>
        {menuOpen ? <FaChevronUp className="text-white"/> : <FaChevronDown className="text-gray-200"/>}
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-14 right-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="text-gray-700">
            {currentRole === 'seeker' && (
              <div className="flex px-4 items-center gap-0.5 hover:bg-gray-100 cursor-pointer">
                <FaUser />
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    // Navigate to the profile view
                    window.location.href = `/seeker/profile/${userId}`;
                  }}
                >
                  My Profile
                </li>
              </div>
            )}

            {currentRole === 'publisher' && (
              <div className="flex px-4 items-center gap-0.5 hover:bg-gray-100 cursor-pointer">
                <FaBuilding />
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    // Navigate to the company culture view
                    window.location.href = `/publisher/company-culture`;
                  }}
                >
                  About Company
                </li>
              </div>
            )}

            <div className="flex px-4 items-center gap-0.5 hover:bg-gray-100 cursor-pointer">
              <FaCogs />
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => alert('Navigating to Settings...')}
              >
                Settings
              </li>
            </div>
            <div className="flex px-4 items-center gap-0.5 hover:bg-gray-100 cursor-pointer">
              <FaSignOutAlt />
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  // Perform the logout action here
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
              >
                Logout
              </li>
            </div>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Avatar;
