import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoutes from './auth/ProtectedRoutes';
import Layout from './components/Layout';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import FeedbackForm from './components/FeedbackForm';
import FeedbackData from './pages/FeedbackData';
import FeedbackDetails from './pages/FeedbackDetails';
import Login from './pages/Login';
import Signup from './pages/SignUp';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Layout />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="feedback" element={<FeedbackForm />} />
          <Route path="feedbackdata" element={<FeedbackData />} />
          <Route path="feedback/:id" element={<FeedbackDetails />} />
        </Route>

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;