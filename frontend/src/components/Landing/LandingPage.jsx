import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-white font-bold text-xl">Professional Networking Application</div>
          <div className="space-x-4">
            <Link to="/login" className="text-white hover:text-blue-200">Login</Link>
            <Link to="/signup" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Find Your Dream Job in Malawi</h1>
          <p className="text-xl mb-12">Connect with top employers and opportunities across Malawi</p>

          <div className="flex justify-center space-x-6">
            <Link to="/seeker/jobs"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50">
              Search Jobs
            </Link>
            <Link to="/publisher/dashboard"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
              Post a Job
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Job Seekers</h3>
            <p className="text-gray-600 mb-4">Build your profile, upload your resume, and get matched with the perfect job.</p>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Employers</h3>
            <p className="text-gray-600 mb-4">Post jobs, manage applications, and find the best talent for your company.</p>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Career Resources</h3>
            <p className="text-gray-600 mb-4">Access career advice, industry insights, and professional development tools.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
