import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/home';
import About from '../pages/about';
import Contact from '../pages/contact';
import Feedback from '../pages/feedback';
import FeedbackData from '../pages/FeedbackData';
import FeedbackDetails from '../pages/FeedbackDetails';
import Login from '../pages/Login';
import Signup from '../pages/SignUp';
import { useAuth } from '../auth/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="feedbackdata" element={<FeedbackData />} />
        <Route path="feedback/:id" element={<FeedbackDetails />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppRoutes;
