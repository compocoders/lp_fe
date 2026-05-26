import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/authpage/LoginPage';
import RegisterPage from './pages/authpage/RegisterPage';
import CreateProfile from './pages/profilePage/CreateProfile';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/createProfile' element={<CreateProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
