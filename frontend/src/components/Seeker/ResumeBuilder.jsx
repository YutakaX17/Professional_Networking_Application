import React from 'react';

const ResumeBuilder = () => {
  return (
    <div className="bg-white w-fit rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Resume Builder</h2>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded-lg px-4 py-2"
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Experience</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add Experience
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Education</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add Education
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Skills</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add Skills
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
