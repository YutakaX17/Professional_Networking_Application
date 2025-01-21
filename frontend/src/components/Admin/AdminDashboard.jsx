import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats, fetchRecentActivity } from '../../store/slices/dashboardSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentActivity, loading, error } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentActivity());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-green-800 font-semibold">Active Jobs</h3>
          <p className="text-2xl font-bold text-green-600">{stats.activeJobs}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-purple-800 font-semibold">Applications</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.applications}</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <h3 className="text-orange-800 font-semibold">New Users</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.newUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-lg">
                <div className="ml-3">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add New User
            </button>
            <button className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;