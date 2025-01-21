import React from 'react';

const Analytics = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold">Total Views</h3>
          <p className="text-2xl font-bold text-blue-600">1,234</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-green-800 font-semibold">Applications</h3>
          <p className="text-2xl font-bold text-green-600">89</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-purple-800 font-semibold">Conversion Rate</h3>
          <p className="text-2xl font-bold text-purple-600">7.2%</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
        {/* Chart placeholder */}
        <div className="h-64 bg-gray-100 rounded-lg"></div>
      </div>
    </div>
  );
};

export default Analytics;
