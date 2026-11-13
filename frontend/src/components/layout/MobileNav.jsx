import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MobileNav = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="d-md-none fixed-bottom bg-white border-top shadow-lg py-2 px-3 z-3">
      <div className="d-flex justify-content-around align-items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `d-flex flex-column align-items-center text-decoration-none small ${
              isActive ? 'text-bookbazar fw-bold' : 'text-secondary'
            }`
          }
        >
          <i className="bi bi-house-door fs-5"></i>
          <span style={{ fontSize: '0.65rem' }}>Home</span>
        </NavLink>

        <NavLink
          to="/browse"
          className={({ isActive }) =>
            `d-flex flex-column align-items-center text-decoration-none small ${
              isActive ? 'text-bookbazar fw-bold' : 'text-secondary'
            }`
          }
        >
          <i className="bi bi-search fs-5"></i>
          <span style={{ fontSize: '0.65rem' }}>Search</span>
        </NavLink>

        {/* Highlighted Sell Button */}
        <NavLink
          to="/sell"
          className="d-flex flex-column align-items-center text-decoration-none text-white position-relative"
          style={{ marginTop: '-15px' }}
        >
          <div
            className="rounded-circle bg-bookbazar d-flex align-items-center justify-content-center shadow"
            style={{ width: '48px', height: '48px' }}
          >
            <i className="bi bi-plus-lg fs-4 text-white"></i>
          </div>
          <span className="text-dark fw-bold mt-1" style={{ fontSize: '0.65rem' }}>
            Sell
          </span>
        </NavLink>

        <NavLink
          to={isAuthenticated ? '/buyer-dashboard' : '/login'}
          className={({ isActive }) =>
            `d-flex flex-column align-items-center text-decoration-none small ${
              isActive ? 'text-bookbazar fw-bold' : 'text-secondary'
            }`
          }
        >
          <i className="bi bi-unlock fs-5"></i>
          <span style={{ fontSize: '0.65rem' }}>Unlocks</span>
        </NavLink>

        <NavLink
          to={isAuthenticated ? '/profile' : '/login'}
          className={({ isActive }) =>
            `d-flex flex-column align-items-center text-decoration-none small ${
              isActive ? 'text-bookbazar fw-bold' : 'text-secondary'
            }`
          }
        >
          <i className="bi bi-person fs-5"></i>
          <span style={{ fontSize: '0.65rem' }}>{isAuthenticated ? 'Profile' : 'Login'}</span>
        </NavLink>
      </div>
    </div>
  );
};

export default MobileNav;
