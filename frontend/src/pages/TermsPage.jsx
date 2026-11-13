import React from 'react';
import AdSensePlaceholder from '../components/common/AdSensePlaceholder';

const TermsPage = () => {
  return (
    <div className="container py-4">
      <AdSensePlaceholder slotId="terms-top-banner" format="leaderboard" className="mb-3" />

      <div className="max-w-800 mx-auto" style={{ maxWidth: '820px' }}>
        <div className="text-center py-4 mb-3">
          <span className="badge bg-secondary mb-2">Platform Agreement</span>
          <h2 className="display-6 fw-bold text-dark mb-1">Terms & Conditions</h2>
          <p className="text-muted small">Effective Date: October 2026 &bull; BookBazar Pakistan</p>
        </div>

        <div className="card border shadow-sm rounded-4 p-4 p-md-5 bg-white small text-secondary">
          <div className="alert alert-warning py-3 mb-4">
            <h6 className="fw-bold text-dark mb-1">
              <i className="bi bi-info-circle-fill me-1"></i> Core Marketplace Disclaimer:
            </h6>
            <div className="small">
              BookBazar is strictly an independent communications platform connecting peer buyers and sellers. <strong>BookBazar does not own, stock, inspect, warehouse, or deliver any books.</strong>
            </div>
          </div>

          <h5 className="fw-bold text-dark mb-3">1. Direct Transactions Between Students</h5>
          <p>
            All agreements regarding book condition, final price, payment method for the book (cash on delivery or bank transfer), and physical delivery are strictly between the individual buyer and seller.
          </p>

          <h5 className="fw-bold text-dark mt-4 mb-3">2. Platform Contact-Access Fee (Rs. 100)</h5>
          <ul>
            <li>The platform charges a nominal, non-refundable platform contact-access fee of <strong>Rs. 100 PKR</strong> to unlock verified seller contact details.</li>
            <li>This fee covers platform verification, infrastructure, and anti-spam moderation. It is entirely separate from the book price.</li>
            <li>No fake payment success is permitted; transactions must be genuine and verifiable via 10-12 digit JazzCash, Easypaisa, or Raast reference numbers.</li>
          </ul>

          <h5 className="fw-bold text-dark mt-4 mb-3">3. Seller Responsibilities</h5>
          <ul>
            <li>Sellers must accurately describe book edition, curriculum board, highlights, and physical condition.</li>
            <li>Sellers must promptly update listing status to "Paused" or "Sold" once a transaction is completed.</li>
            <li>Listing pirated copies, inappropriate literature, stolen property, or fraudulent items is strictly prohibited and results in immediate ban.</li>
          </ul>

          <h5 className="fw-bold text-dark mt-4 mb-3">4. Student Meetup Safety</h5>
          <p>
            Users are strongly advised to conduct in-person handovers only in public campus areas (university gates, student union buildings, campus libraries, cafes) during daytime hours. Inspect the textbook thoroughly before paying the seller.
          </p>

          <h5 className="fw-bold text-dark mt-4 mb-3">5. Termination & Account Suspension</h5>
          <p>
            BookBazar reserves the right to terminate or deactivate accounts that submit fraudulent transaction IDs, harass students, or list false information.
          </p>
        </div>
      </div>

      <AdSensePlaceholder slotId="terms-bottom-banner" format="banner" className="mt-4" />
    </div>
  );
};

export default TermsPage;
