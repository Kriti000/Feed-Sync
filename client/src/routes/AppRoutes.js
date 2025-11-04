import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/home';
import About from '../pages/about';
import Contact from '../pages/contact';
import Feedback from '../pages/feedback';
import FeedbackData from '../pages/FeedbackData';
import FeedbackDetails from '../pages/FeedbackDetails';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Layout from '../components/Layout';

const isAuthenticated = () => !!localStorage.getItem('token');

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Protected Routes */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="feedbackdata" element={<FeedbackData />} />
      <Route path="feedback/:id" element={<FeedbackDetails />} />
    </Route>

    {/* Auth Routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
  </Routes>
);

export default AppRoutes;
