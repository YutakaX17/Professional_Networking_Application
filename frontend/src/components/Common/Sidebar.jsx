import React from 'react';
import { Link } from 'react-router-dom';
import { useGetCurrentRole } from "../../utils/roleUtils";
import { Work } from '@mui/icons-material';
import BusinessIcon from '@mui/icons-material/Business';

const Sidebar = () => {
  const currentRole = useGetCurrentRole();

  return (
    <aside className="bg-blue-600 w-64 p-4 flex flex-col">
      <ul className="space-y-2">
        <li>
          <Link to="/dashboard" className="text-gray-100 hover:text-white">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/settings" className="text-gray-100 hover:text-white">
            Settings
          </Link>
        </li>
        {currentRole === 'publisher' && (
          <>
            <li>
              <Link to="/publisher/company-culture/create" className="text-gray-100 hover:text-white">
                <BusinessIcon className="mr-2" />
                Create Culture
              </Link>
            </li>
            <li>
              <Link to="/publisher/jobs/create" className="flex items-center text-gray-100 hover:text-white">
                <Work className="mr-2" />
                Job Post
              </Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
