import React from 'react';
import AdSensePlaceholder from '../components/common/AdSensePlaceholder';

const PrivacyPolicyPage = () => {
  return (
    <div className="container py-4">
      <AdSensePlaceholder slotId="privacy-top-banner" format="leaderboard" className="mb-3" />

      <div className="max-w-800 mx-auto" style={{ maxWidth: '820px' }}>
        <div className="text-center py-4 mb-3">
          <span className="badge bg-secondary mb-2">Legal & Privacy</span>
          <h2 className="display-6 fw-bold text-dark mb-1">Privacy Policy</h2>
          <p className="text-muted small">Effective Date: October 2026 &bull; BookBazar Pakistan</p>
        </div>

        <div className="card border shadow-sm rounded-4 p-4 p-md-5 bg-white small text-secondary">
          <h5 className="fw-bold text-dark mb-3">1. Student Contact Information Protection</h5>
          <p>
            At BookBazar, protecting the privacy of Pakistani students (including school, college, and university students) is our highest commitment. Unlike public classifieds where phone numbers are exposed to web scrapers and harassers, <strong>seller contact details on BookBazar remain encrypted and locked by default</strong>.
          </p>

          <h5 className="fw-bold text-dark mt-4 mb-3">2. When Is Contact Information Disclosed?</h5>
          <p>
            A seller's direct mobile phone number, WhatsApp link, email, and campus meetup address are ONLY disclosed to a registered buyer when the following conditions are met:
          </p>
          <ul>
            <li>The buyer has initiated a Contact Unlock Request for that specific book listing.</li>
            <li>The buyer has paid the platform contact access fee of Rs. 100 via JazzCash, Easypaisa, or Raast.</li>
            <li>The platform has verified the transaction ID through its verification queue or payment gateway IPN.</li>
          </ul>

          <h5 className="fw-bold text-dark mt-4 mb-3">3. Information We Collect</h5>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, password (securely hashed), Pakistani phone number, WhatsApp number, city, and educational institution.</li>
            <li><strong>Book Listing Information:</strong> Book title, author, class, board, subject, condition, photos, and asking price.</li>
            <li><strong>Payment Verification Records:</strong> Transaction IDs (TID), payment method, and optional transfer screenshots provided for fee verification.</li>
          </ul>

          <h5 className="fw-bold text-dark mt-4 mb-3">4. We Do Not Sell Your Data</h5>
          <p>
            We do not sell, rent, or trade student personal information to third-party telemarketers or advertisers under any circumstances.
          </p>

          <h5 className="fw-bold text-dark mt-4 mb-3">5. Google AdSense & Cookies</h5>
          <p>
            BookBazar may display non-intrusive advertisements served by Google AdSense. Google uses cookies (including the DoubleClick cookie) to serve relevant ads based on prior visits. Users may opt out of personalized advertising by visiting Google Ads Settings.
          </p>

          <h5 className="fw-bold text-dark mt-4 mb-3">6. Contact for Privacy Inquiries</h5>
          <p>
            If you have questions regarding your data privacy or would like to request account deletion, contact us at <a href="mailto:privacy@bookbazar.pk" className="text-bookbazar">privacy@bookbazar.pk</a>.
          </p>
        </div>
      </div>

      <AdSensePlaceholder slotId="privacy-bottom-banner" format="banner" className="mt-4" />
    </div>
  );
};

export default PrivacyPolicyPage;
