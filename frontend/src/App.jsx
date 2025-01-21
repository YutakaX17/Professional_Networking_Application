import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store/store';
import "./index.css";

// Landing Page
import LandingPage from './components/Landing/LandingPage';

// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard';
import UserManagement from './components/Admin/UserManagement';
import Reports from './components/Admin/Reports';

// Publisher Components
import PublisherDashboard from './components/Publisher/PublisherDashboard';
import JobPostings from './components/Publisher/JobPostings';
import Analytics from './components/Publisher/Analytics';
import CompanyCultureCreate from "./components/Publisher/CompanyCultureCreate";
import CompanyCultureView from "./components/Publisher/CompanyCultureView";
import CreateNewJobPost from "./components/Publisher/CreateNewJobPost";

// Seeker Components
import SeekerDashboard from './components/Seeker/SeekerDashboard';
import ResumeBuilder from './components/Seeker/ResumeBuilder';
import JobSearch from './components/Seeker/JobSearch';
import CreateProfileForm from './components/Seeker/CreateProfileForm';
import EditProfileForm from "./components/Seeker/EditProfileForm";

// Common Components

import Footer from './components/Common/Footer';
import Navbar from './components/Common/Navbar';
import Sidebar from './components/Common/Sidebar';

// Auth Components
import LoginComponent from './components/Auth/LoginComponent';
import SignUpComponent from './components/Auth/SignUpComponent';
import GoogleCallback from './components/Auth/GoogleCallback';
import ResetPassword from './components/Auth/ResetPassword';
import ProfileView from "./components/Seeker/ProfileView";

const DashboardLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex flex-grow">
      <Sidebar />
      <main className="flex-grow p-4">
        {children}
      </main>
    </div>
    <Footer />
  </div>
);

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="pt-16">
          <Routes>
            {/* Landing Page Route */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignUpComponent />} />
            <Route path="/auth/google-callback" element={<GoogleCallback />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
            <Route path="/admin/dashboard" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
            <Route path="/admin/users" element={<DashboardLayout><UserManagement /></DashboardLayout>} />
            <Route path="/admin/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />

            {/* Publisher Routes */}
            <Route path="/publisher" element={<DashboardLayout><PublisherDashboard /></DashboardLayout>} />
            <Route path="/publisher/dashboard" element={<DashboardLayout><PublisherDashboard /></DashboardLayout>} />
            <Route path="/publisher/jobs" element={<DashboardLayout><JobPostings /></DashboardLayout>} />
            <Route path="/publisher/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
            <Route path="/publisher/company-culture/create" element={<DashboardLayout><CompanyCultureCreate /></DashboardLayout>} />
            <Route path="/publisher/company-culture" element={<DashboardLayout><CompanyCultureView /></DashboardLayout>} />
            <Route path="/publisher/jobs/create" element={<DashboardLayout><CreateNewJobPost /></DashboardLayout>} />

            {/* Seeker Routes */}
            <Route path="/seeker" element={<DashboardLayout><SeekerDashboard /></DashboardLayout>} />
            <Route path="/seeker/dashboard" element={<DashboardLayout><SeekerDashboard /></DashboardLayout>} />
            <Route path="/seeker/resume" element={<DashboardLayout><ResumeBuilder /></DashboardLayout>} />
            <Route path="/seeker/jobs" element={<DashboardLayout><JobSearch /></DashboardLayout>} />
            <Route
              path="/seeker/create-profile"
              element={<DashboardLayout><CreateProfileForm /></DashboardLayout>}
            />
            <Route
              path="/seeker/edit-profile/:userId"
              element={<DashboardLayout><EditProfileForm /></DashboardLayout>}
            />
            <Route
              path="/seeker/profile/:userId"
              element={<DashboardLayout><ProfileView /></DashboardLayout>}
            />

          </Routes>
        </div>
      </Router>
    </Provider>
  );
};


export default App;


