import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">FeedSync</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/feedback">Feedback</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/feedbackdata">Feedback Data</Link></li>
            </ul>
            <div className="d-flex align-items-center">
              {user && <span className="text-white me-3">{user.name}</span>}
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Page Content */}
      <main className="container mt-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3 mt-auto">
        <small>© 2025 FeedSync | All Rights Reserved</small>
      </footer>
    </>
  );
};

export default Layout;
