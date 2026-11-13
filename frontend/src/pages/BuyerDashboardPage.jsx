import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

const BuyerDashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [unlocks, setUnlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUnlocks = async () => {
    setLoading(true);
    try {
      const data = await paymentService.getMyUnlocks();
      setUnlocks(data.results || data);
    } catch (err) {
      console.error('Failed to load unlock requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/buyer-dashboard');
      return;
    }
    fetchUnlocks();
  }, [isAuthenticated]);

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <span className="badge bg-primary bg-opacity-10 text-primary mb-1">Buyer Contacts Center</span>
          <h3 className="fw-bold text-dark mb-1">My Unlocked Seller Contacts</h3>
          <p className="text-muted small mb-0">
            Access verified phone, WhatsApp, and campus meetup details for books you unlocked
          </p>
        </div>

        <Link to="/browse" className="btn btn-outline-bookbazar btn-sm rounded-pill">
          Browse More Books &rarr;
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-bookbazar" role="status"></div>
          <p className="text-muted mt-2 small">Loading your contact unlocks...</p>
        </div>
      ) : unlocks.length > 0 ? (
        <div className="row g-3">
          {unlocks.map((req) => {
            const isVerified = req.status === 'VERIFIED';
            const isSubmitted = req.status === 'SUBMITTED';
            const listing = req.listing || {};
            const contact = req.unlocked_contact_info;

            return (
              <div key={req.id} className="col-lg-6">
                <div className={`card h-100 border shadow-sm rounded-4 overflow-hidden bg-white ${isVerified ? 'border-success' : ''}`}>
                  <div className="card-header bg-light d-flex justify-content-between align-items-center py-2 px-3 border-bottom">
                    <span className="small text-muted">
                      Unlock Request #{req.id} &bull; Fee: Rs. {req.amount}
                    </span>
                    {isVerified && (
                      <span className="badge bg-success">
                        <i className="bi bi-patch-check-fill me-1"></i> Verified & Unlocked
                      </span>
                    )}
                    {isSubmitted && (
                      <span className="badge bg-warning text-dark">
                        <i className="bi bi-clock-history me-1"></i> Verification in Progress
                      </span>
                    )}
                    {req.status === 'INITIATED' && (
                      <span className="badge bg-secondary">Awaiting Payment</span>
                    )}
                    {req.status === 'REJECTED' && (
                      <span className="badge bg-danger">Verification Rejected</span>
                    )}
                  </div>

                  <div className="card-body p-3">
                    {/* Book Summary */}
                    <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                      <div
                        className="rounded border bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: '54px', height: '68px' }}
                      >
                        <i className="bi bi-book text-secondary fs-4"></i>
                      </div>
                      <div className="overflow-hidden">
                        <h6 className="fw-bold mb-0 text-truncate">
                          <Link to={`/books/${listing.id}`} className="text-dark text-decoration-none hover-primary">
                            {listing.title}
                          </Link>
                        </h6>
                        <div className="small text-muted text-truncate">by {listing.author}</div>
                        <div className="small text-bookbazar fw-bold">Book Price: Rs. {Number(listing.price).toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Contact details when VERIFIED */}
                    {isVerified && contact ? (
                      <div className="bg-light p-3 rounded-3 border">
                        <div className="fw-bold text-dark small mb-2 d-flex align-items-center gap-1">
                          <i className="bi bi-person-check-fill text-success"></i>
                          Seller: {contact.seller_name} ({contact.institute || contact.city})
                        </div>

                        <div className="row g-2 small mb-3">
                          <div className="col-sm-6">
                            <span className="text-muted d-block">Phone:</span>
                            <a href={`tel:${contact.phone_number}`} className="fw-bold text-dark text-decoration-none">
                              <i className="bi bi-telephone me-1 text-primary"></i>
                              {contact.phone_number}
                            </a>
                          </div>

                          <div className="col-sm-6">
                            <span className="text-muted d-block">Email:</span>
                            <span className="fw-semibold text-dark text-truncate d-block">{contact.email}</span>
                          </div>

                          <div className="col-12">
                            <span className="text-muted d-block">Campus / Meetup Area:</span>
                            <span className="fw-semibold text-dark">{contact.meetup_area || 'Public Campus Area'}</span>
                          </div>
                        </div>

                        {contact.whatsapp_link && (
                          <a
                            href={contact.whatsapp_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-success w-100 d-flex align-items-center justify-content-center gap-2 fw-bold"
                          >
                            <i className="bi bi-whatsapp"></i> Chat with Seller on WhatsApp
                          </a>
                        )}
                      </div>
                    ) : isSubmitted ? (
                      <div className="alert alert-warning py-2 small mb-0">
                        <div className="fw-bold text-dark mb-1">
                          <i className="bi bi-hourglass-split me-1"></i> Transaction Submitted
                        </div>
                        <div className="text-secondary">
                          Transaction ID: <code>{req.transaction_id}</code> via {req.payment_method?.toUpperCase()}
                        </div>
                        <div className="mt-1" style={{ fontSize: '0.75rem' }}>
                          Our verification queue is checking your payment reference. Once verified, this card will display the seller's direct contact details.
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-secondary py-2 small mb-0">
                        <div>Please complete your Rs. 100 transfer to view seller details.</div>
                        <Link to={`/books/${listing.id}`} className="btn btn-sm btn-bookbazar mt-2">
                          View Book & Submit Payment
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-5 bg-white border rounded-4 shadow-sm p-4">
          <i className="bi bi-unlock text-muted" style={{ fontSize: '3rem' }}></i>
          <h5 className="fw-bold mt-2">No Contact Unlocks Yet</h5>
          <p className="text-muted small">
            When you request contact access to buy a used book from a student, their verified phone & WhatsApp will appear here.
          </p>
          <Link to="/browse" className="btn btn-bookbazar btn-sm">
            Browse Textbooks
          </Link>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboardPage;
