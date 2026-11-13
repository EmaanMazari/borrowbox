import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Col 1: Brand & Mission */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="rounded-3 bg-bookbazar-light text-bookbazar d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', fontSize: '1.2rem' }}
              >
                <i className="bi bi-book-half"></i>
              </div>
              <span className="fs-5 fw-bold text-white">
                Book<span className="text-success">Bazar</span>
              </span>
            </div>
            <p className="text-secondary small mb-3">
              Pakistan's dedicated peer-to-peer textbook marketplace for students. Buy and sell used books for Matric, Intermediate (FSc/FA/ICS), O/A Levels, MDCAT, and Universities at affordable prices.
            </p>
            <div className="small text-secondary">
              <span className="badge bg-secondary me-2">Peer-to-Peer</span>
              <span className="badge bg-secondary me-2">Rs. 0 Listing Fee</span>
              <span className="badge bg-secondary">All Pakistan</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold text-white mb-3">Marketplace</h6>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/browse" className="text-secondary text-decoration-none hover-white">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-secondary text-decoration-none hover-white">
                  Sell a Book
                </Link>
              </li>
              <li>
                <Link to="/seller-dashboard" className="text-secondary text-decoration-none hover-white">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link to="/buyer-dashboard" className="text-secondary text-decoration-none hover-white">
                  My Unlocked Contacts
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Education Categories in Pakistan */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="fw-bold text-white mb-3">Boards & Classes</h6>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/browse?class_grade=fsc_1" className="text-secondary text-decoration-none">
                  FSc & ICS Part 1 (11th)
                </Link>
              </li>
              <li>
                <Link to="/browse?class_grade=fsc_2" className="text-secondary text-decoration-none">
                  FSc & ICS Part 2 (12th)
                </Link>
              </li>
              <li>
                <Link to="/browse?class_grade=class_9" className="text-secondary text-decoration-none">
                  Matric Class 9 & 10
                </Link>
              </li>
              <li>
                <Link to="/browse?class_grade=o_levels" className="text-secondary text-decoration-none">
                  Cambridge O / A Levels
                </Link>
              </li>
              <li>
                <Link to="/browse?class_grade=entry_test" className="text-secondary text-decoration-none">
                  MDCAT & ECAT Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Policies & Support */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white mb-3">Information & Safety</h6>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-3">
              <li>
                <Link to="/about" className="text-secondary text-decoration-none">
                  About Us & Mission
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary text-decoration-none">
                  Contact & Helpline
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-secondary text-decoration-none">
                  Privacy Policy (Contact Protection)
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-secondary text-decoration-none">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
            <div className="p-2 rounded bg-secondary bg-opacity-25 small text-secondary border border-secondary border-opacity-50">
              <i className="bi bi-shield-check text-success me-1"></i>
              <strong>Rs. 100 Contact Fee:</strong> The platform does not stock books. You deal on book price directly with the seller.
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary gap-2">
          <div>
            &copy; {new Date().getFullYear()} BookBazar Pakistan. Built for Pakistani students.
          </div>
          <div className="d-flex gap-3">
            <Link to="/privacy-policy" className="text-secondary text-decoration-none">Privacy</Link>
            <Link to="/terms-conditions" className="text-secondary text-decoration-none">Terms</Link>
            <Link to="/contact" className="text-secondary text-decoration-none">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
