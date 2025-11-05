import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const About = () => {
  return (
    <div className="container py-5" style={{ color: "#333" }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">About FeedSync</h1>
        <p className="lead text-muted">
          Revolutionizing feedback management through technology and simplicity.
        </p>
      </div>

      <div className="row align-items-center">
        <div className="col-md-6 mb-4">
          <img
            src="/images/about-banner.jpg"
            alt="About FeedSync"
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-6">
          <h4 className="fw-bold">Our Story</h4>
          <p>
            FeedSync was developed with a vision to transform how feedback is collected and
            analyzed. What began as a simple rating portal is now a full-scale web application
            offering secure authentication, multimedia feedback, and real-time analytics.
          </p>

          <h4 className="fw-bold mt-4">Our Mission</h4>
          <p>
            To empower individuals and organizations with meaningful insights by simplifying the
            feedback process through innovative technology.
          </p>

          <h4 className="fw-bold mt-4">Our Vision</h4>
          <p>
            To create a connected environment where every opinion matters and contributes to
            continuous improvement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
