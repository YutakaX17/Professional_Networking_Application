import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';

export default function ProfileView() {
    const [profile, setProfile] = useState(null);
    const { userId } = useParams();
    const navigate = useNavigate();

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

                setProfile(profileData);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

        if (userId) {
            fetchProfile();
        }
    }, [userId]);

    if (!profile) return <div>Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center space-x-6">
                    {profile.profile_picture_path && (
                        <img
                            src={`http://localhost:5000/${profile.profile_picture_path}`}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                    )}
                    <div>
                        <h2 className="text-2xl font-bold">{profile.full_name}</h2>
                        <p className="text-gray-600">{profile.location}</p>
                    </div>
                </div>
                <div className="h-px bg-gray-300 my-4"/>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Bio</h3>
                    <p className="mt-2 text-gray-600">{profile.bio}</p>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Skills</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {profile.skills && profile.skills.length > 0 ? (
                            profile.skills.map((skill, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p>No skills available</p>
                        )}
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Experience</h3>
                    <div className="mt-2">
                        <p>Years: {profile.experience.years}</p>
                        <p>Roles: {profile.experience.roles.join(', ')}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <div className="mt-2">
                        <p>Degree: {profile.education.degree}</p>
                        <p>University: {profile.education.university}</p>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => navigate(`/seeker/edit-profile/${userId}`)}
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
}
