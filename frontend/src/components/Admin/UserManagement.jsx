import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, setSelectedUser, updateUserRole } from '../../store/slices/adminSlice';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, selectedUser, loading, error } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUserSelect = (user) => {
    dispatch(setSelectedUser(user));
  };

  const handleRoleUpdate = (userId, newRole) => {
    dispatch(updateUserRole({ userId, role: newRole }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add New User
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User List Panel */}
        <div className="lg:col-span-1 bg-gray-50 rounded-lg p-4">
          <div className="mb-4">
            <input
              type="search"
              placeholder="Search users..."
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="space-y-2">
            {users.map(user => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedUser?.id === user.id ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-100'
                }`}
              >
                <h4 className="font-semibold">{user.username}</h4>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Details Panel */}
        {selectedUser && (
          <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">User Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="mt-1">{selectedUser.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1">{selectedUser.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Role Management</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => handleRoleUpdate(selectedUser.id, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Publisher">Publisher</option>
                    <option value="Seeker">Seeker</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;