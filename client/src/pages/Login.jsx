import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; 
import './AuthPage.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);

      login(res.data.token);

      alert('Login successful! 🎉');

      navigate('/home', { replace: true });
    } catch (err) {
      alert(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="floating-bg"></div>
      <div className="auth-card shadow-lg animate__animated animate__fadeInDown">
        <div className="text-center mb-4">
          <i className="bi bi-person-circle text-primary display-4"></i>
          <h2 className="mt-2 fw-bold text-primary">Welcome Back!</h2>
          <p className="text-muted">Login to continue your journey 🚀</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <i className="bi bi-envelope-fill"></i> Email
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <i className="bi bi-lock-fill"></i> Password
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>

          <p className="text-center mt-3 mb-0">
            New here?{' '}
            <Link to="/signup" className="fw-bold text-decoration-none">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
