import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please provide your username or email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(username.trim(), password);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (uname, pass) => {
    setUsername(uname);
    setPassword(pass);
  };

  return (
    <div className="container py-5">
      <div className="max-w-450 mx-auto" style={{ maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-bookbazar-light text-bookbazar mx-auto d-flex align-items-center justify-content-center mb-2"
            style={{ width: '56px', height: '56px', fontSize: '1.75rem' }}
          >
            <i className="bi bi-book-half"></i>
          </div>
          <h4 className="fw-bold text-dark">Welcome to BookBazar</h4>
          <p className="text-muted small">Log in to buy or sell used books across Pakistan</p>
        </div>

        <div className="card border shadow-sm rounded-4 p-4 bg-white mb-3">
          {error && (
            <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-circle-fill"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">Username or Email</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. zainab_pu or student@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-bookbazar w-100 py-2 fw-bold" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
              Log In to Account
            </button>
          </form>

          {/* Quick Demo Credentials for Fast Evaluation */}
          <div className="mt-4 pt-3 border-top">
            <span className="small text-muted fw-bold d-block mb-2">1-Click Demo Accounts:</span>
            <div className="d-flex flex-column gap-1">
              <button
                type="button"
                className="btn btn-sm btn-outline-danger text-start py-1"
                onClick={() => handleQuickLogin('admin', 'admin123')}
              >
                <i className="bi bi-shield-lock me-1"></i> <strong>Admin:</strong> admin / admin123
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-success text-start py-1"
                onClick={() => handleQuickLogin('zainab_pu', 'password123')}
              >
                <i className="bi bi-shop me-1"></i> <strong>Seller:</strong> zainab_pu (PU Lahore)
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary text-start py-1"
                onClick={() => handleQuickLogin('bilal_buyer', 'password123')}
              >
                <i className="bi bi-bag-check me-1"></i> <strong>Buyer:</strong> bilal_buyer (PGC Rawalpindi)
              </button>
            </div>
          </div>
        </div>

        <div className="text-center small text-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-bookbazar fw-bold text-decoration-none">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
