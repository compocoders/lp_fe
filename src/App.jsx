import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/authpage/LoginPage';
import RegisterPage from './pages/authpage/RegisterPage';
import VerifyEmailPage from './pages/authpage/VerifyEmailPage';
import ForgotPasswordPage from './pages/authpage/ForgotPasswordPage';
import ResetPasswordPage from './pages/authpage/ResetPasswordPage';
import CreateProfile from './pages/profilePage/CreateProfile';
import Mainpage from './pages/dashboard/Mainpage';
import DashboardHome from './pages/dashboard/DashboardHome';
import ClassroomDetail from './pages/dashboard/ClassroomDetail';
import AiStudioPage from './pages/dashboard/AiStudioPage';
import ActivityRenderer from './pages/dashboard/ActivityRenderer';
import ActivityGradebook from './pages/dashboard/ActivityGradebook';
import JoinClassroomPage from './pages/dashboard/JoinClassroomPage';
import Settings from './pages/dashboard/Settings';
import ProtectedRoute from './components/common/ProtectedRoute';
import GlobalErrorPage from './pages/error/GlobalErrorPage';
import useErrorStore from './store/error.store';

function App() {
  const hasError = useErrorStore(state => state.hasError);

  return (
    <>
      {hasError && <GlobalErrorPage />}
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path='/verify-email' element={<VerifyEmailPage />} />
          <Route path='/createProfile' element={<CreateProfile />} />
          
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          
            <Route path="/dashboard" element={<Mainpage/>}>
              <Route index element={<DashboardHome />} />
              <Route path="classroom/:code" element={<ClassroomDetail />} />
              <Route path="classroom/:code/studio" element={<AiStudioPage />} />
              <Route path="classroom/:code/studio/:materialId" element={<AiStudioPage />} />
              <Route path="activity/:activityId" element={<ActivityRenderer />} />
              <Route path="activity/:activityId/gradebook" element={<ActivityGradebook />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          <Route path="/join/:token" element={<JoinClassroomPage />} />
        </Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
