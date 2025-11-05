import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #007bff 0%, #6f42c1 100%)",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold display-5 mb-3">
            Welcome to <span style={{ color: "#ffd700" }}>FeedSync</span> — Smart Feedback, Smarter Growth
          </h1>
          <p className="lead">
            FeedSync is an intelligent feedback management platform designed to simplify how
            organizations collect, manage, and analyze user opinions.
          </p>
        </div>

        <div className="row text-dark">
          <div className="col-md-6">
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-body">
                <h4 className="fw-bold mb-3">Why Choose FeedSync?</h4>
                <ul className="list-unstyled">
                  <li>💬 Real-Time Feedback: Capture and view feedback instantly.</li>
                  <li>🔐 Secure & Reliable: Built with JWT authentication and encrypted storage.</li>
                  <li>🧠 Data-Driven Insights: Transform feedback into actionable insights.</li>
                  <li>🌐 User-Friendly Interface: Works on all devices.</li>
                  <li>⚙️ Customizable: Integrate easily into your system.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-body">
                <h4 className="fw-bold mb-3">Our Vision & Mission</h4>
                <p>
                  <strong>Mission:</strong> Empower organizations with meaningful insights by
                  simplifying the feedback process through innovation.
                </p>
                <p>
                  <strong>Vision:</strong> Build a connected digital ecosystem where every opinion
                  drives measurable improvement.
                </p>
              </div>
            </div>

            <div className="card shadow-lg border-0">
              <div className="card-body">
                <h4 className="fw-bold mb-3">Key Features</h4>
                <ul className="list-unstyled">
                  <li>✔️ User authentication & profile management</li>
                  <li>✔️ Dynamic feedback forms with image uploads</li>
                  <li>✔️ Search, filter & export options</li>
                  <li>✔️ Admin dashboard & analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-5 text-light">
          <p className="mb-0">
            🌟 Join the next generation of smarter feedback management with{" "}
            <strong>FeedSync</strong>.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
