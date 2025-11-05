import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const FeedbackDetails = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/feedback/${id}`);
        setFeedback(res.data);
      } catch (err) {
        console.error("Error fetching feedback details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Loading feedback details...</p>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="container text-center py-5">
        <i className="bi bi-exclamation-triangle text-warning fs-1"></i>
        <h4 className="mt-3">Feedback not found</h4>
        <button
          className="btn btn-outline-primary mt-3"
          onClick={() => navigate("/feedbackdata")}
        >
          ← Back to Feedback List
        </button>
      </div>
    );
  }

  return (
    <div
      className="container py-5"
      style={{
        background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div className="card border-0 shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary fw-bold mb-0">
            <i className="bi bi-chat-left-text me-2"></i>Feedback Details
          </h2>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/feedbackdata")}
          >
            ← Back
          </button>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <p>
              <strong className="text-dark">Name:</strong>{" "}
              <span className="text-muted">{feedback.name}</span>
            </p>
            <p>
              <strong className="text-dark">Email:</strong>{" "}
              <span className="text-muted">{feedback.email}</span>
            </p>
            <p>
              <strong className="text-dark">Rating:</strong>{" "}
              <span className="badge bg-warning text-dark">
                {feedback.rating || "N/A"} <i className="bi bi-star-fill"></i>
              </span>
            </p>
          </div>

          <div className="col-md-6">
            <p>
              <strong className="text-dark">Message:</strong>
              <br />
              <span className="text-muted">{feedback.message}</span>
            </p>
            <p>
              <strong className="text-dark">Submitted On:</strong>{" "}
              <span className="text-muted">
                {new Date(feedback.createdAt).toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        {feedback.image && (
          <div className="mt-4 text-center">
            <h5 className="fw-semibold mb-3 text-primary">Uploaded Image</h5>
            <img
              src={`http://localhost:5000/images/${feedback.image}`}
              alt="Feedback"
              className="img-fluid rounded shadow-sm border"
              style={{ maxWidth: "400px", height: "auto" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x250?text=Image+Not+Found";
              }}
            />
          </div>
        )}

        {feedback.steps && feedback.steps.length > 0 && (
          <div className="mt-5">
            <h4 className="text-secondary fw-bold mb-3">
              <i className="bi bi-list-check me-2"></i>Step-wise Comments
            </h4>
            {feedback.steps.map((step, index) => (
              <div
                key={index}
                className="p-3 mb-3 bg-light rounded shadow-sm border"
              >
                <p className="mb-1">
                  <strong>Step {index + 1}:</strong> {step.comment || "N/A"}
                </p>
                {step.image && (
                  <img
                    src={`http://localhost:5000/images/${step.image}`}
                    alt={`Step ${index + 1}`}
                    className="rounded mt-2 shadow-sm border"
                    style={{
                      maxWidth: "300px",
                      height: "auto",
                      display: "block",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackDetails;
