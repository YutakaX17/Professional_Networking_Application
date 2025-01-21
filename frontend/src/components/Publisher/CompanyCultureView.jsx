import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyCultureView = () => {
  const [companyCulture, setCompanyCulture] = useState(null);
  const publisherId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCompanyCulture = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/publisher/company-culture/${publisherId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCompanyCulture(response.data);
      } catch (error) {
        console.error('Failed to fetch company culture:', error);
      }
    };

    if (publisherId) {
      fetchCompanyCulture();
    }
  }, [publisherId]);

  if (!companyCulture) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-6 mb-6">
          <img
              src={`http://localhost:5000/${companyCulture.publisher_logo}`}
              alt="Company branding"
              className="w-32 h-32 rounded-full object-cover"
          />
          <h2 className="text-2xl font-bold mb-4">{companyCulture.company_name}</h2>
        </div>
        <div className="h-px bg-gray-300 my-4"/>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Values</h3>
          <ul className="list-disc list-inside">
            {companyCulture.values.map((value, index) => {
              const cleanedValue = value.replace(/["\[\]]/g, ' ');
              return <li key={index}>{cleanedValue}</li>;
            })}
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Benefits</h3>
          <ul className="list-disc list-inside">
            {companyCulture.benefits && Object.entries(companyCulture.benefits).map(([benefit, description], index) => (
                <li key={index}>
                  <strong>{benefit}:</strong> {description}
                </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Work Environment</h3>
          <p>{companyCulture.work_environment}</p>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Culture Score</h3>
          <p>{companyCulture.culture_score}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Company Photos</h3>
          <div className="grid grid-cols-3 gap-4">
            {companyCulture.photos.map((photo, index) => (
                <img
                    key={index}
                    src={`http://localhost:5000/${photo}`}
                    alt={`Company Photo ${index + 1}`}
                    className="w-full h-auto rounded-md object-cover"
                />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyCultureView;
