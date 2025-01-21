import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload } from 'react-icons/fi';
import { AiOutlineClose, AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';

export default function CreateProfileForm() {
  const [formData, setFormData] = useState({
    bio: '',
    full_name: '',
    phone: '',
    location: '',
    skills: [],
    experience: { years: 0, roles: [] },
    education: { degree: '', university: '' }
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      experience: { ...prev.experience, [name]: value }
    }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      education: { ...prev.education, [name]: value }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'skills') {
        value.forEach(skill => submitData.append('skills', skill));
      } else if (typeof value === 'object') {
        submitData.append(key, JSON.stringify(value));
      } else {
        submitData.append(key, value);
      }
    });

    if (profilePicture) {
      submitData.append('profile_picture', profilePicture);
    }

    try {
    const response = await axios.post(
      'http://localhost:5000/seeker/profile/create',
      submitData,
      {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true,
        credentials: 'include'
      }
    );

      if (response.status === 201) {
        setStatus({
          type: 'success',
          message: response.data.message || 'Profile created successfully!'
        });
        // Redirect to profile view or dashboard
      } else {
        throw new Error(response.data.error || 'Failed to create profile');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || error.message || 'Failed to create profile'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto p-14">
        <h2 className="text-2xl text-center font-bold mb-6">Create Your Profile</h2>

        {status.message && (
          <div className={`mb-4 p-4 rounded-md flex items-center gap-2 ${
            status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {status.type === 'error' ?
              <AiOutlineWarning className="h-5 w-5" /> :
              <AiOutlineCheckCircle className="h-5 w-5" />}
            <p>{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 shadow-xl p-8 rounded-md border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-3 rounded-md shadow">
            {/* Profile Picture Upload */}
            <div className="col-span-full">
              <div className="flex items-center space-x-4">
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="Profile preview" className="w-24 h-24 rounded-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePicture(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <AiOutlineClose className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-full cursor-pointer hover:bg-gray-50">
                    <FiUpload className="w-8 h-8 text-gray-400" />
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                  </label>
                )}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                  <p className="text-sm text-gray-500">JPG or PNG. Max 5MB</p>
                </div>
              </div>
            </div>

            {/* Rest of the form fields remain the same */}
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="mt-1 block h-8 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 h-8 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 block h-8 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block h-20 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
              <input
                type="text"
                value={formData.skills.join(', ')}
                onChange={handleSkillsChange}
                className="mt-1 block h-8 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input
                type="number"
                name="years"
                value={formData.experience.years}
                onChange={handleExperienceChange}
                className="mt-1 block h-8 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Roles (comma-separated)</label>
              <input
                type="text"
                name="roles"
                value={formData.experience.roles.join(', ')}
                onChange={(e) => handleExperienceChange({
                  target: {
                    name: 'roles',
                    value: e.target.value.split(',').map(role => role.trim())
                  }
                })}
                className="mt-1 block h-8 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.education.degree}
                onChange={handleEducationChange}
                className="mt-1 block h-8 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">University</label>
              <input
                type="text"
                name="university"
                value={formData.education.university}
                onChange={handleEducationChange}
                className="mt-1 block h-8 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors duration-200`}
            >
              {loading ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}