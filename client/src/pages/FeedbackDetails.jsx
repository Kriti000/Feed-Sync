import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FetchData.css';

const FeedbackDetails = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/feedback/${id}`);
        setFeedback(res.data);
      } catch (err) {
        console.error('Error fetching feedback detail:', err);
      }
    };
    fetchFeedback();
  }, [id]);

  return (
    <div className="feedback-details-container" style={{ padding: '2rem', backgroundColor: '#f0f4fb' }}>
      <h2 style={{ marginBottom: '1rem' }}>Feedback Details</h2>

      <div className="feedback-details-card" style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        maxWidth: '700px',
        margin: 'auto',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)'
      }}>
        <p><strong>Name:</strong> {feedback.name}</p>
        <p><strong>Email:</strong> {feedback.email}</p>
        <p><strong>Rating:</strong> {feedback.rating}</p>
        <p><strong>Message:</strong> {feedback.message}</p>
        <p><strong>IP Address:</strong> {feedback.ipAddress}</p>

        {feedback.image && (
          <div style={{ marginTop: '1rem' }}>
            <img
              src={`http://localhost:5000/${feedback.image}`}
              alt="Feedback"
              style={{
                maxWidth: '100%',
                height: 'auto',
                border: '1px solid #ccc',
                borderRadius: '8px',
                marginTop: '1rem',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        )}

        {feedback.steps && feedback.steps.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h4>Step-wise Comments</h4>
            {feedback.steps.map((step, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#f9f9f9',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  boxShadow: '0 0 5px rgba(0, 0, 0, 0.05)'
                }}
              >
                <p><strong>Step {index + 1}:</strong> {step.comment}</p>
                {step.image && (
                  <img
                    src={`http://localhost:5000/${step.image}`}
                    alt={`Step ${index + 1}`}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      marginTop: '0.5rem',
                      border: '1px solid #ccc',
                      borderRadius: '5px'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <button
          className="back-button"
          onClick={() => navigate('/feedbackdata')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Back to Feedback List
        </button>
      </div>
    </div>
  );
};

export default FeedbackDetails;
