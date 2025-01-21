import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompanyCultureCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    values: [],
    benefits: {},
    work_environment: '',
    culture_score: null,
  });
  const [photos, setPhotos] = useState([]);
  const [logo, setLogo] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleValuesChange = (e) => {
    const values = e.target.value.split(',').map((value) => value.trim());
    setFormData({ ...formData, values });
  };

  const handlePhotosChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const formDataToSend = new FormData();
    formDataToSend.append('company_name', formData.company_name);
    formDataToSend.append('values', JSON.stringify(formData.values));
    formDataToSend.append('benefits', JSON.stringify(formData.benefits));
    formDataToSend.append('work_environment', formData.work_environment);
    formDataToSend.append('culture_score', formData.culture_score);
    formDataToSend.append('publisher_id', userId);

    photos.forEach((photo) => {
      formDataToSend.append('photos', photo);
    });

    if (logo) {
      formDataToSend.append('logo', logo);
    }

    try {
      await axios.post('http://localhost:5000/publisher/company-culture', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage('Company culture created successfully!');
      setTimeout(() => {
        navigate('/publisher/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating company culture:', error);
      setErrorMessage('Failed to create company culture. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto shadow-xl p-6 px-12 rounded-md">
      <h2 className="text-2xl text-blue-600 font-bold mb-4">Create Company Culture</h2>
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="company_name" className="block font-medium">
            Company Name
          </label>
          <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
          />
        </div>
        <div>
          <label htmlFor="values" className="block font-medium">
            Values (comma-separated)
          </label>
          <input
              type="text"
              id="values"
              name="values"
              value={formData.values.join(', ')}
              onChange={handleValuesChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Benefits</label>
          <div className="mt-2 space-y-2">
            {['Health insurance', 'Working hours', 'Employee stock purchase plan', 'Paid Time Off', 'Childcare assistance', 'Commuter benefits'].map((benefit) => (
                <div key={benefit} className="flex items-center">
                  <input
                      type="checkbox"
                      id={benefit}
                      name={benefit}
                      checked={formData.benefits[benefit] || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        benefits: {...formData.benefits, [benefit]: e.target.checked}
                      })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={benefit} className="ml-2 block text-sm text-gray-900">
                    {benefit}
                  </label>
                </div>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="work_environment" className="block font-medium">
            Work Environment
          </label>
          <textarea
              id="work_environment"
              name="work_environment"
              value={formData.work_environment}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div>
          <label htmlFor="culture_score" className="block font-medium">
            Culture Score
          </label>
          <input
              type="number"
              id="culture_score"
              name="culture_score"
              value={formData.culture_score}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.1"
              min="0"
              max="5"
          />
        </div>
        <div>
          <label htmlFor="photos" className="block font-medium">
            Company Culture Photos
          </label>
          <input
              type="file"
              id="photos"
              name="photos"
              multiple
              onChange={handlePhotosChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*"
          />
        </div>
        <div>
          <label htmlFor="logo" className="block font-medium">
            Publisher Logo
          </label>
          <input
              type="file"
              id="logo"
              name="logo"
              onChange={handleLogoChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*"
          />
        </div>
        <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Company Culture
        </button>
      </form>
    </div>
  );
};

export default CompanyCultureCreate;
