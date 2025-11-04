import React from 'react';
import FeedbackForm from '../components/FeedbackForm';

const Feedback = () => {
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary">Share Your Feedback 💬</h2>
      <FeedbackForm />
    </div>
  );
};

export default Feedback;
