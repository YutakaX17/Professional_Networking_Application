import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SeekerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Get from your auth context or localStorage

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/seeker/dashboard');
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!dashboardData) return null;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="space-y-6 w-fit">
        <h2 className="text-2xl font-bold">Welcome to Your Dashboard</h2>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {dashboardData.recentApplications.map((app) => (
              <div key={app.id} className="border-b pb-4">
                <h4 className="font-medium">{app.jobTitle}</h4>
                <p className="text-gray-600">{app.company}</p>
                <p className="text-sm text-gray-500">Status: {app.status}</p>
                <p className="text-sm text-gray-500">Applied: {app.appliedDate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Jobs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Saved Jobs</h3>
          <div className="space-y-4">
            {dashboardData.savedJobs.map((job) => (
              <div key={job.id} className="border-b pb-4">
                <h4 className="font-medium">{job.title}</h4>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
                <p className="text-sm text-gray-500">{job.salary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Alerts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Job Alerts</h3>
          <div className="space-y-4">
            {dashboardData.jobAlerts.map((alert) => (
              <div key={alert.id} className="border-b pb-4">
                <h4 className="font-medium">{alert.query}</h4>
                <p className="text-sm text-gray-500">
                  {alert.frequency} alerts for {alert.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
