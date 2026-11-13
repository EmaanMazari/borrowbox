import React, { useState } from 'react';
import { adminService } from '../../services/adminService';

const ReportListingModal = ({ show, onClose, listing }) => {
  const [reason, setReason] = useState('misleading_price');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!show || !listing) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.trim()) {
      setError('Please provide a brief explanation for reporting this listing.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await adminService.submitReport(listing.id, reason, details.trim());
      setSuccess(true);
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <i className="bi bi-flag-fill text-danger"></i> Report Listing
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading}></button>
          </div>

          <div className="modal-body p-4">
            {success ? (
              <div className="text-center py-3">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                <h5 className="fw-bold mt-2">Report Submitted</h5>
                <p className="text-muted small">
                  Thank you for keeping BookBazar safe for students. Our moderation team will review this listing shortly.
                </p>
                <button type="button" className="btn btn-bookbazar btn-sm px-4" onClick={onClose}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="small text-muted mb-3">
                  Reporting: <strong>{listing.title}</strong>
                </p>

                {error && (
                  <div className="alert alert-danger py-2 small">{error}</div>
                )}

                <div className="mb-3">
                  <label className="form-label small fw-bold">Reason for Report</label>
                  <select
                    className="form-select form-select-sm"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="misleading_price">Misleading or fraudulent price</option>
                    <option value="wrong_syllabus">Incorrect curriculum board / edition</option>
                    <option value="sold_already">Book is already sold or unavailable</option>
                    <option value="fake_listing">Suspicious or duplicate listing</option>
                    <option value="inappropriate">Inappropriate images or text</option>
                    <option value="unresponsive">Invalid seller contact details</option>
                    <option value="other">Other issue</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Details</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows="3"
                    placeholder="Describe what is incorrect or suspicious about this listing..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light btn-sm" onClick={onClose} disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger btn-sm px-3" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportListingModal;
