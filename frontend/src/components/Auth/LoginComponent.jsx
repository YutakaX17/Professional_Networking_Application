import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const LoginComponent = () => {
  const [role, setRole] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/google-login');
      // Redirect to Google auth URL
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error('Google login error:', error);
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

const handleLogin = async (e) => {
  e.preventDefault();

  try {
      const response = await axios.post('http://localhost:5000/auth/login', {
          email,
          password,
      });

      // Handle the response
      const { token, role, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id); // Store user ID

      if (role === 'Seeker') {
          navigate('/seeker/create-profile');
      } else if (role === 'Publisher') {
          navigate('/publisher/dashboard');
      }
  } catch (error) {
      console.error('Login error:', error);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full">
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
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <a
                href="#"
                className="text-sm text-blue-600 hover:underline hover:text-blue-700 ml-4"
                onClick={(e) => {
                  e.preventDefault();
                  // Make a request to the backend endpoint for sending the password reset email
                  axios.post('http://localhost:5000/auth/forgot-password', { email })
                    .then((response) => {
                      // Handle the response, show a success message, etc.
                      console.log(response.data.message);
                    })
                    .catch((error) => {
                      // Handle the error, show an error message, etc.
                      console.error('Forgot password error:', error);
                    });
                }}
              >
                Forgot password?
              </a>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </form>
          {/* Or login section */}
          <div className="my-6 text-center relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative text-sm bg-white px-2 text-gray-500">Or, login with</div>
          </div>

          <button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md shadow-sm flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/16px-Google_%22G%22_logo.svg.png?20230822192911"
                alt="Google Logo"
                className="w-5 h-5 mr-2"
            />
            Login with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Have an account?{' '}
              <a href="signup" className="text-blue-600 hover:underline hover:text-blue-700">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginComponent;
