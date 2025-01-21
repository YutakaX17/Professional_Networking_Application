import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const Header = () => {
  const [jobDropdown, setJobDropdown] = useState(false);
  const [featuresDropdown, setFeaturesDropdown] = useState(false);

  // Handle dropdown toggle
  const toggleDropdown = (setter) => {
    setter((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">MJ</span>
          </div>
          <span className="text-xl font-bold text-gray-800">Malawi Jobs</span>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-6 relative">
          {/* Job Vacancy Dropdown */}
          <div className="relative">
            <button
              className="flex items-center text-gray-800 hover:text-purple-600 transition duration-300"
              onClick={() => toggleDropdown(setJobDropdown)}
            >
              Job Vacancy
              <FaChevronDown className="ml-1" />
            </button>
            {jobDropdown && (
              <div
                className="absolute top-8 left-0 w-48 bg-white border rounded-md shadow-lg z-10 transform origin-top scale-y-0 animate-dropdown"
                onMouseLeave={() => setJobDropdown(false)}
              >
                <ul className="flex flex-col">
                  {[
                    "ICT",
                    "Agriculture",
                    "Administration",
                    "Health",
                    "Education",
                    "Social Welfare",
                  ].map((field, index, array) => (
                    <li key={field} className="hover:bg-purple-100">
                      <a
                        href={`#${field.toLowerCase()}`}
                        className="block px-4 py-2 text-gray-700 hover:text-purple-600"
                      >
                        {field}
                      </a>
                      {index !== array.length - 1 && (
                        <hr className="border-gray-200" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Features Dropdown */}
          <div className="relative">
            <button
              className="flex items-center text-gray-800 hover:text-purple-600 transition duration-300"
              onClick={() => toggleDropdown(setFeaturesDropdown)}
            >
              Features
              <FaChevronDown className="ml-1" />
            </button>
            {featuresDropdown && (
              <div
                className="absolute top-8 left-0 w-64 bg-white border rounded-md shadow-lg z-10 transform origin-top scale-y-0 animate-dropdown"
                onMouseLeave={() => setFeaturesDropdown(false)}
              >
                <ul className="flex flex-col">
                  {[
                    "Networking",
                    "Communication",
                    "Resume Sharing",
                    "Event Planning and Management",
                    "Privacy and Security",
                  ].map((feature, index, array) => (
                    <li key={feature} className="hover:bg-purple-100">
                      <a
                        href={`#${feature
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="block px-4 py-2 text-gray-700 hover:text-purple-600"
                      >
                        {feature}
                      </a>
                      {index !== array.length - 1 && (
                        <hr className="border-gray-200" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <a
            href="#pricing"
            className="text-gray-800 hover:text-purple-600 transition duration-300"
          >
            Pricing
          </a>
          <a
            href="#about-us"
            className="text-gray-800 hover:text-purple-600 transition duration-300"
          >
            About Us
          </a>
        </nav>

        {/* Login and Sign Up Buttons */}
        <div className="flex items-center space-x-2">
          <a
            href="login"
            className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition duration-300 flex items-center space-x-1"
          >
            <span>Login</span>
            <FaChevronRight />
          </a>
          <a
            href="signup"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 flex items-center space-x-1"
          >
            <span>Sign Up</span>
            <FaChevronRight />
          </a>
        </div>
      </div>

      {/* Mobile Menu */}

    </header>
  );
};

export default Header;
