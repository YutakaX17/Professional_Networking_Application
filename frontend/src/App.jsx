import React, {useState} from 'react';
import { Provider } from 'react-redux';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
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
import ApplicationReview from "./components/Publisher/ApplicationReview";

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
import {Box} from "@mui/material";

const AppContent = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isExcludedRoute = () => {
    const excludedRoutes = ['/', '/login', '/signup', '/auth/google-callback', '/reset-password'];
    return excludedRoutes.includes(location.pathname);
  };

  return (

      <Box sx={{display: 'flex'}}>
          {!isExcludedRoute() && (
              <>
                  <Navbar onMenuClick={handleDrawerToggle}/>
                  <Sidebar open={mobileOpen} onClose={handleDrawerToggle}/>
              </>
          ) }
          {!isExcludedRoute() ? (
          <Box component="main" sx={{ flexGrow: 5, p: 3 }}>
          <div className="flex flex-col min-h-screen">
              <div className="flex-grow p-14">
                  <Routes>
                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminDashboard/>}/>
                      <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
                      <Route path="/admin/users" element={<UserManagement/>}/>
                      <Route path="/admin/reports" element={<Reports/>}/>

                      {/* Publisher Routes */}
                      <Route path="/publisher" element={<PublisherDashboard/>}/>
                      <Route path="/publisher/dashboard" element={<PublisherDashboard/>}/>
                      <Route path="/publisher/jobs" element={<JobPostings/>}/>
                      <Route path="/publisher/analytics" element={<Analytics/>}/>
                      <Route path="/publisher/company-culture/create" element={<CompanyCultureCreate/>}/>
                      <Route path="/publisher/company-culture" element={<CompanyCultureView/>}/>
                      <Route path="/publisher/jobs/create" element={<CreateNewJobPost/>}/>
                      <Route path="/publisher/applications/review" element={<ApplicationReview />} />

                      {/* Seeker Routes */}
                      <Route path="/seeker" element={<SeekerDashboard/>}/>
                      <Route path="/seeker/dashboard" element={<SeekerDashboard/>}/>
                      <Route path="/seeker/resume" element={<ResumeBuilder/>}/>
                      <Route path="/seeker/jobs" element={<JobSearch/>}/>
                      <Route path="/seeker/create-profile" element={<CreateProfileForm/>}/>
                      <Route path="/seeker/edit-profile/:userId" element={<EditProfileForm/>}/>
                      <Route path="/seeker/profile/:userId" element={<ProfileView/>}/>
                  </Routes>
              </div>
                  <Footer/>
          </div>
        </Box>
        ) : (
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
           <Route path="/login" element={<LoginComponent/>}/>
           <Route path="/signup" element={<SignUpComponent/>}/>
           <Route path="/auth/google-callback" element={<GoogleCallback/>}/>
           <Route path="/reset-password" element={<ResetPassword/>}/>
        </Routes>
      )}
      </Box>
);
};

const App = () => {
    return (
        <Provider store={store}>
            <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;


