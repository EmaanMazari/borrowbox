import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2 shadow-sm">
      <div className="container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-dark text-decoration-none">
          <div
            className="rounded-3 bg-bookbazar-light text-bookbazar d-flex align-items-center justify-content-center"
            style={{ width: '38px', height: '38px', fontSize: '1.25rem' }}
          >
            <i className="bi bi-book-half"></i>
          </div>
          <div className="d-flex flex-column lh-1">
            <span className="fs-5 tracking-tight">
              Book<span className="text-bookbazar">Bazar</span>
            </span>
            <span className="text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.04em' }}>
              PAKISTAN STUDENT MARKETPLACE
            </span>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="d-none d-md-flex mx-auto" style={{ maxWidth: '380px', width: '100%' }}>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="search"
              className="form-control bg-light border-start-0 ps-0"
              placeholder="Search by title, subject, author, board..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="submit">
              Search
            </button>
          </div>
        </form>

        {/* Right Navigation */}
        <div className="d-flex align-items-center gap-2">
          <Link to="/browse" className="btn btn-sm btn-link text-secondary text-decoration-none d-none d-sm-inline-block">
            Browse All Books
          </Link>

          {/* Sell a Book CTA button */}
          <Link to="/sell" className="btn btn-sm btn-bookbazar d-flex align-items-center gap-1 shadow-sm px-3">
            <i className="bi bi-plus-circle"></i>
            <span>Sell a Book</span>
          </Link>

          {/* Auth Controls */}
          {isAuthenticated ? (
            <div className="dropdown">
              <button
                className="btn btn-sm btn-light border dropdown-toggle d-flex align-items-center gap-2"
                type="button"
                data-bs-toggle="dropdown"
                id="userDropdown"
              >
                <div
                  className="rounded-circle bg-bookbazar-light text-bookbazar d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: '26px', height: '26px', fontSize: '0.8rem' }}
                >
                  {(user?.display_name || user?.username || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="small d-none d-lg-inline fw-semibold text-truncate" style={{ maxWidth: '110px' }}>
                  {user?.display_name || user?.username}
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                <li className="px-3 py-2 border-bottom bg-light">
                  <div className="fw-bold small text-dark">{user?.display_name || user?.username}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>{user?.email}</div>
                  <div className="badge bg-secondary mt-1" style={{ fontSize: '0.65rem' }}>
                    Dual Role: Buyer & Seller
                  </div>
                </li>
                <li>
                  <Link to="/seller-dashboard" className="dropdown-item py-2 small d-flex align-items-center gap-2">
                    <i className="bi bi-shop text-bookbazar"></i> Seller Dashboard (My Listings)
                  </Link>
                </li>
                <li>
                  <Link to="/buyer-dashboard" className="dropdown-item py-2 small d-flex align-items-center gap-2">
                    <i className="bi bi-unlock text-primary"></i> My Unlocked Contacts (Buyer)
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="dropdown-item py-2 small d-flex align-items-center gap-2">
                    <i className="bi bi-person text-secondary"></i> Profile Settings
                  </Link>
                </li>
                {isAdmin && (
                  <>
                    <li><hr className="dropdown-divider my-1" /></li>
                    <li>
                      <Link to="/admin-dashboard" className="dropdown-item py-2 small d-flex align-items-center gap-2 text-danger fw-bold">
                        <i className="bi bi-speedometer2"></i> Admin Control Panel
                      </Link>
                    </li>
                  </>
                )}
                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <button onClick={logout} className="dropdown-item py-2 small d-flex align-items-center gap-2 text-danger">
                    <i className="bi bi-box-arrow-right"></i> Log Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-sm btn-outline-secondary">
                Log In
              </Link>
              <Link to="/register" className="btn btn-sm btn-outline-bookbazar d-none d-sm-inline-block">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
