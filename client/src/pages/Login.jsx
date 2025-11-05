import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(form.email, form.password);
    if (res.success) {
      navigate('/');
    } else {
      alert(res.message);
    }
    setLoading(false);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: 'linear-gradient(135deg, #007bff 0%, #6f42c1 100%)',
        color: 'white',
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: '400px',
          borderRadius: '15px',
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#333',
        }}
      >
        <h3 className="text-center fw-bold mb-3" style={{ color: '#007bff' }}>
          Welcome Back 👋
        </h3>
        <p className="text-center text-muted mb-4">
          Login to continue your FeedSync journey 🚀
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-2"
            disabled={loading}
            style={{ borderRadius: '10px' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center mt-3 mb-0">
            New here?{' '}
            <Link
              to="/signup"
              className="fw-semibold text-decoration-none"
              style={{ color: '#6f42c1' }}
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
