import React from 'react';
import { Link } from 'react-router-dom';
import AdSensePlaceholder from '../components/common/AdSensePlaceholder';

const AboutPage = () => {
  return (
    <div className="container py-4">
      <AdSensePlaceholder slotId="about-top-banner" format="leaderboard" className="mb-3" />

      <div className="max-w-800 mx-auto" style={{ maxWidth: '820px' }}>
        {/* Hero */}
        <div className="text-center py-4 mb-4">
          <span className="badge bg-bookbazar-light text-bookbazar mb-2 px-3 py-1 rounded-pill">
            Our Student Mission
          </span>
          <h2 className="display-6 fw-bold text-dark mb-2">Making Education Affordable in Pakistan</h2>
          <p className="lead text-secondary">
            BookBazar connects students who need textbooks with seniors who have finished their exams.
          </p>
        </div>

        <div className="card border shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
          <h4 className="fw-bold text-dark mb-3">Why BookBazar?</h4>
          <p className="text-secondary leading-relaxed">
            In Pakistan, every academic year brings heavy financial stress for students and parents. Whether buying new textbooks for Matric, FSc Part 1 & 2, Cambridge O/A Levels, entry test series (KIPS/STEP/Stars), or heavy university reference manuals (like Stewart Calculus or Guyton Physiology), new copies cost thousands of rupees.
          </p>
          <p className="text-secondary leading-relaxed">
            Meanwhile, millions of perfectly usable textbooks sit untouched in student cupboards once board examinations finish. BookBazar was created to solve this challenge through a pure peer-to-peer student marketplace.
          </p>

          <hr className="my-4" />

          <h4 className="fw-bold text-dark mb-3">Our Transparent Business Model</h4>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="p-3 rounded-3 bg-light border h-100">
                <div className="fw-bold text-dark mb-1">
                  <i className="bi bi-tag-fill text-bookbazar me-1"></i> Zero Book Commission
                </div>
                <p className="text-muted small mb-0">
                  BookBazar does not own, warehouse or deliver books. 100% of the book price agreed between buyer and seller goes directly to the student seller.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 rounded-3 bg-light border h-100">
                <div className="fw-bold text-dark mb-1">
                  <i className="bi bi-shield-lock-fill text-primary me-1"></i> Rs. 100 Contact-Access Fee
                </div>
                <p className="text-muted small mb-0">
                  To keep the platform spam-free and protect student privacy (especially female students), verified contact details are unlocked for a nominal Rs. 100 fee.
                </p>
              </div>
            </div>
          </div>

          <h4 className="fw-bold text-dark mb-3">Coverage Across Pakistan</h4>
          <p className="text-secondary small mb-4">
            We support all major national boards including Punjab Boards (BISE Lahore, Rawalpindi, Faisalabad, Multan), Federal Board (FBISE Islamabad), Sindh Boards (Karachi, Hyderabad), KPK Boards (Peshawar, Abbottabad), Cambridge International (CIE), and HEC universities across the nation.
          </p>

          <div className="text-center pt-3 border-top">
            <Link to="/browse" className="btn btn-bookbazar px-4 py-2 fw-bold me-2">
              Browse Available Books
            </Link>
            <Link to="/sell" className="btn btn-outline-secondary px-4 py-2">
              Sell Your Used Books
            </Link>
          </div>
        </div>
      </div>

      <AdSensePlaceholder slotId="about-bottom-banner" format="banner" className="mt-4" />
    </div>
  );
};

export default AboutPage;
