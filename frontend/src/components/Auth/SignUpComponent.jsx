import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const SignUpComponent = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignUp = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/google-login');
      // Redirect to Google auth URL
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    setDropdownOpen(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/auth/register', {
        username,
        email,
        password,
        role,
      });

      // Handle the response
      const { message } = response.data;
      console.log(message);

      // Navigate to the login page after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Sign up error:', error);
      // Handle the error, show an error message, etc.
      // You can display an alert or update the UI to show the error message
      alert('Sign up failed. Please try again.');
    }
  };

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full">
              <span className="text-white text-2xl font-bold">MJ</span>
            </div>
          </div>

          {/* Welcome text */}
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
            Welcome!
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Connect with professionals, share resumes, and explore job opportunities!
          </p>

          {/* Form */}
          <form onSubmit={handleSignUp}>
            {/* Username input */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Dropdown for Role */}
            <div className="relative mb-4" ref={dropdownRef}>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Select Role
              </label>
              <div
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer"
                  onClick={toggleDropdown}
              >
                {role || 'Select your role'}
              </div>
              <div
                  className={`absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md transition-all duration-300 ${
                      isDropdownOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
              >
                <ul>
                  <li
                      className="px-4 py-2 hover:bg-purple-300 cursor-pointer"
                      onClick={() => selectRole('Publisher')}
                  >
                    Publisher
                  </li>
                  <li
                      className="px-4 py-2 hover:bg-purple-300 cursor-pointer"
                      onClick={() => selectRole('Seeker')}
                  >
                    Seeker
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <a href="#" className="text-sm text-purple-600 hover:underline hover:text-purple-700 ml-4">
                Forgot password?
              </a>
            </div>

            <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
          </form>

          {/* Or login section */}
          <div className="my-6 text-center relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative text-sm bg-white px-2 text-gray-500">Or, Sign up with</div>
          </div>

          <button
              onClick={handleGoogleSignUp}
              className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md shadow-sm flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/16px-Google_%22G%22_logo.svg.png?20230822192911"
                alt="Google Logo"
                className="w-5 h-5 mr-2"
            />
            Sign up with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Have an account?{' '}
              <a href="#" className="text-purple-600 hover:underline hover:text-purple-700">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpComponent;
