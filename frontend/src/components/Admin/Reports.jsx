import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReportData } from '../../store/slices/reportsSlice';

const Reports = () => {
  const dispatch = useDispatch();
  const { userStats, jobStats, platformAnalytics, loading, error } = useSelector(state => state.reports);

  useEffect(() => {
    dispatch(fetchReportData('userStats'));
    dispatch(fetchReportData('jobStats'));
    dispatch(fetchReportData('platformAnalytics'));
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reports Dashboard</h2>
        <div className="flex space-x-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
          {userStats && Object.entries(userStats).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2">
              <span className="text-gray-600">{key}</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Job Statistics</h3>
          {jobStats && Object.entries(jobStats).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2">
              <span className="text-gray-600">{key}</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Platform Analytics</h3>
          {platformAnalytics && Object.entries(platformAnalytics).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2">
              <span className="text-gray-600">{key}</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;