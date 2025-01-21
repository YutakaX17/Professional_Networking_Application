import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { FiUpload, FiEdit2 } from 'react-icons/fi'
import { AiOutlineClose, AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai'

export default function EditProfileForm() {
    const [formData, setFormData] = useState({
        bio: '',
        full_name: '',
        phone: '',
        location: '',
        skills: [],
        experience: { years: 0, roles: [] },
        education: { degree: '', university: '' }
    })
    const [profilePicture, setProfilePicture] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({ type: '', message: '' })
    const [activeSection, setActiveSection] = useState('basic'); // Track active form section
    const navigate = useNavigate()
    const { userId } = useParams()

    useEffect(() => {
    const fetchProfile = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/seeker/profile/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            // Parse the experience and education if they're strings
            const profileData = {
                ...response.data,
                experience: typeof response.data.experience === 'string'
                    ? JSON.parse(response.data.experience)
                    : response.data.experience,
                education: typeof response.data.education === 'string'
                    ? JSON.parse(response.data.education)
                    : response.data.education
            };

            setFormData(profileData);
            if (response.data.profile_picture_path) {
                setPreviewUrl(`http://localhost:5000/${response.data.profile_picture_path}`);
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Failed to load profile data'
            });
        }
    };

    if (userId) {
        fetchProfile();
    }
  }, [userId]);


    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSkillsChange = (e) => {
        const skills = e.target.value.split(',').map(skill => skill.trim())
        setFormData(prev => ({ ...prev, skills }))
    }

    const handleExperienceChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            experience: { ...prev.experience, [name]: value }
        }))
    }

    const handleEducationChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            education: { ...prev.education, [name]: value }
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setProfilePicture(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const submitData = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'skills') {
                value.forEach(skill => submitData.append('skills', skill))
            } else if (typeof value === 'object') {
                submitData.append(key, JSON.stringify(value))
            } else {
                submitData.append(key, value)
            }
        })

        if (profilePicture) {
            submitData.append('profile_picture', profilePicture)
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/seeker/profile/update/${userId}`,
                submitData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            setStatus({
                type: 'success',
                message: 'Profile updated successfully!'
            })
            setTimeout(() => navigate('/seeker/dashboard'), 1500)
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.error || 'Failed to update profile'
            })
        } finally {
            setLoading(false)
        }
    }

    const renderSection = () => {
        switch(activeSection) {
            case 'basic':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={4}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                )
            case 'skills':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Skills</label>
                            <input
                                type="text"
                                value={formData.skills.join(', ')}
                                onChange={handleSkillsChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Enter skills separated by commas"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.skills.map((skill, index) => (
                                <span key={index} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )
            case 'experience':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                            <input
                                type="number"
                                name="years"
                                value={formData.experience.years}
                                onChange={handleExperienceChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Roles</label>
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
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Enter roles separated by commas"
                            />
                        </div>
                    </div>
                )
            case 'education':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Degree</label>
                            <input
                                type="text"
                                name="degree"
                                value={formData.education.degree}
                                onChange={handleEducationChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">University</label>
                            <input
                                type="text"
                                name="university"
                                value={formData.education.university}
                                onChange={handleEducationChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                            <FiEdit2 className="h-6 w-6 text-indigo-600" />
                        </div>

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

                        <form onSubmit={handleSubmit}>
                            <div className="mb-8">
                                <div className="flex justify-center">
                                    <div className="relative">
                                        {previewUrl ? (
                                            <div className="relative">
                                                <img
                                                    src={previewUrl}
                                                    alt="Profile preview"
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProfilePicture(null)
                                                        setPreviewUrl(null)
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                >
                                                    <AiOutlineClose className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-32 h-32 border-4 border-dashed border-indigo-200 rounded-full cursor-pointer hover:border-indigo-300 transition-colors">
                                                <FiUpload className="w-8 h-8 text-indigo-400" />
                                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-4 mb-8">
                                {['basic', 'skills', 'experience', 'education'].map((section) => (
                                    <button
                                        key={section}
                                        type="button"
                                        onClick={() => setActiveSection(section)}
                                        className={`px-4 py-2 rounded-md ${
                                            activeSection === section
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        } transition-colors capitalize`}
                                    >
                                        {section}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                {renderSection()}
                            </div>

                            <div className="mt-8 flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/seeker/profile/${userId}`)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-4 py-2 rounded-md text-white ${
                                        loading
                                            ? 'bg-indigo-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                    } transition-colors`}
                                >
                                    {loading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}