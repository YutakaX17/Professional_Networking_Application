import { useLocation } from 'react-router-dom';

export const useGetCurrentRole = () => {
  const location = useLocation();
  if (location.pathname.includes('/admin')) return 'admin';
  if (location.pathname.includes('/publisher')) return 'publisher';
  if (location.pathname.includes('/seeker')) return 'seeker';
  return 'seeker'; // default role
};
