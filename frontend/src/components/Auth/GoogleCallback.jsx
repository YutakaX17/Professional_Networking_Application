import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          const response = await axios.post('http://localhost:5000/auth/google-callback', { code });
          localStorage.setItem('token', response.data.user.access_token);
          localStorage.setItem('userId', response.data.user.id); // Store user ID
          navigate('/seeker/create-profile');
        } catch (error) {
          console.error('Google callback error:', error);
          navigate('/login');
        }
      }
    };

    handleCallback();
  }, [navigate]);

  return <div>Processing Google login...</div>;
};

export default GoogleCallback;