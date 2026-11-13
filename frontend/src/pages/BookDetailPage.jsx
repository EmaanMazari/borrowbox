import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import ContactUnlockModal from '../components/common/ContactUnlockModal';
import ReportListingModal from '../components/common/ReportListingModal';
import AdSensePlaceholder from '../components/common/AdSensePlaceholder';

const BookDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const fetchBookDetails = async () => {
    setLoading(true);
    try {
      const data = await bookService.getBookDetail(id);
      setBook(data);
    } catch (err) {
      setError('Book listing not found or has been removed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id, isAuthenticated]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-bookbazar" role="status"></div>
        <p className="text-muted mt-2 small">Loading textbook details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger p-4 rounded-4 shadow-sm max-w-500 mx-auto">
          <i className="bi bi-exclamation-octagon-fill fs-2 mb-2 d-block"></i>
          <h5>Book Not Found</h5>
          <p className="small text-muted">{error || 'This listing does not exist.'}</p>
          <Link to="/browse" className="btn btn-bookbazar btn-sm">
            Browse Other Books
          </Link>
        </div>
      </div>
    );
  }

  const seller = book.seller || {};
  const isOwner = user && user.id === seller.id;
  const isUnlocked = book.is_contact_unlocked;
  const unlockedContact = book.unlocked_contact_info;

  const coverUrl = book.cover_image
    ? (book.cover_image.startsWith('http') ? book.cover_image : `http://127.0.0.1:8000${book.cover_image}`)
    : null;

  return (
    <div className="container py-4">
      {/* 1. TOP ADSENSE PLACEHOLDER */}
      <AdSensePlaceholder
        slotId="bookdetail-top-leaderboard"
        format="leaderboard"
        className="mb-3"
      />

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link to="/" className="text-secondary text-decoration-none">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/browse" className="text-secondary text-decoration-none">Books</Link>
          </li>
          <li className="breadcrumb-item active text-truncate" aria-current="page" style={{ maxWidth: '250px' }}>
            {book.title}
          </li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Left Column: Images & Overview */}
        <div className="col-lg-5">
          <div className="card border shadow-sm rounded-4 overflow-hidden bg-white p-3 mb-3 text-center">
            <div
              className="bg-light rounded-3 d-flex align-items-center justify-content-center overflow-hidden position-relative"
              style={{ minHeight: '380px' }}
            >
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="img-fluid rounded object-fit-contain"
                  style={{ maxHeight: '420px' }}
                />
              ) : (
                <div className="text-muted p-5">
                  <i className="bi bi-book text-secondary" style={{ fontSize: '4.5rem' }}></i>
                  <div className="mt-2 fw-semibold">{book.subject} Textbook</div>
                  <div className="small text-secondary">No cover photo provided</div>
                </div>
              )}
            </div>
          </div>

          {/* Safety Warning for Pakistani Students */}
          <div className="card border-0 bg-light p-3 rounded-3 small">
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-shield-exclamation text-warning fs-5"></i>
              <div>
                <strong className="text-dark">Student Safety Guidelines:</strong>
                <ul className="mb-0 ps-3 mt-1 text-secondary">
                  <li>Meet the seller in well-lit public campus areas (e.g. university cafeteria, library).</li>
                  <li>Inspect page binding, edition and notes before handing over cash.</li>
                  <li>Never send advance full book payment before verifying the book in person.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Book Specifications, Pricing & Contact */}
        <div className="col-lg-7">
          <div className="card border shadow-sm rounded-4 p-4 bg-white mb-4">
            {/* Top Badges */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
              <div className="d-flex gap-2">
                <span className="badge bg-bookbazar-light text-bookbazar px-3 py-1 rounded-pill">
                  {book.class_grade_display || book.class_grade}
                </span>
                <span className="badge bg-light text-secondary border px-3 py-1 rounded-pill">
                  {book.board_display || book.board}
                </span>
              </div>
              <span className="small text-muted">
                <i className="bi bi-eye me-1"></i> {book.views_count} views
              </span>
            </div>

            <h3 className="fw-bold text-dark mb-1">{book.title}</h3>
            <p className="text-muted mb-3">
              Author: <strong className="text-dark">{book.author || 'Not specified'}</strong>
              {book.edition && <span> &bull; Edition: <strong>{book.edition}</strong></span>}
            </p>

            {/* Pricing Section */}
            <div className="p-3 bg-light rounded-3 border mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <span className="small text-muted text-uppercase d-block fw-bold">Asking Price</span>
                <span className="h2 fw-extrabold text-bookbazar mb-0">
                  Rs. {Number(book.price).toLocaleString()}
                </span>
              </div>

              {book.original_price && Number(book.original_price) > Number(book.price) && (
                <div className="text-end">
                  <span className="small text-muted text-uppercase d-block">Original Retail Price</span>
                  <span className="text-decoration-line-through text-secondary fw-semibold">
                    Rs. {Number(book.original_price).toLocaleString()}
                  </span>
                  <span className="badge bg-danger ms-2">
                    Save {book.discount_percentage}%
                  </span>
                </div>
              )}
            </div>

            {/* Book Metadata Grid */}
            <h6 className="fw-bold text-dark mb-2">Book Specifications</h6>
            <div className="row g-2 mb-4 small">
              <div className="col-sm-6">
                <div className="p-2 border rounded bg-light">
                  <span className="text-muted d-block">Subject</span>
                  <strong className="text-dark">{book.subject || 'Not specified'}</strong>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-2 border rounded bg-light">
                  <span className="text-muted d-block">Condition</span>
                  <strong className="text-dark text-capitalize">{book.condition_display || book.condition}</strong>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-2 border rounded bg-light">
                  <span className="text-muted d-block">ISBN / Barcode</span>
                  <strong className="text-dark">{book.isbn || 'N/A'}</strong>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-2 border rounded bg-light">
                  <span className="text-muted d-block">City / Campus Area</span>
                  <strong className="text-dark text-capitalize">
                    {book.city} {book.area_location ? `(${book.area_location})` : ''}
                  </strong>
                </div>
              </div>
            </div>

            {/* Book Description */}
            <h6 className="fw-bold text-dark mb-2">Seller's Notes & Description</h6>
            <div className="p-3 rounded border bg-light text-secondary small mb-4 whitespace-pre-line">
              {book.description || 'No additional notes provided by seller.'}
            </div>

            {/* SELLER & CONTACT UNLOCK SECTION */}
            <div className="card border-2 border-bookbazar rounded-4 overflow-hidden mb-3">
              <div className="card-header bg-bookbazar-light py-3 border-bottom">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle bg-bookbazar text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '36px', height: '36px' }}
                    >
                      {(seller.display_name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">{seller.display_name || 'Student Seller'}</h6>
                      <div className="small text-muted">
                        {seller.institute || 'Student in Pakistan'} &bull; {book.city ? book.city.toUpperCase() : ''}
                      </div>
                    </div>
                  </div>
                  <span className="badge bg-white text-bookbazar border">
                    {seller.active_listings_count || 1} Active Book(s)
                  </span>
                </div>
              </div>

              <div className="card-body p-4">
                {/* CASE 1: Contact is UNLOCKED */}
                {isUnlocked ? (
                  <div className="bg-light p-3 rounded-3 border border-success">
                    <div className="d-flex align-items-center gap-2 text-success fw-bold mb-3">
                      <i className="bi bi-patch-check-fill fs-5"></i>
                      <span>Verified Seller Contact Unlocked</span>
                    </div>

                    <div className="row g-3 small">
                      <div className="col-sm-6">
                        <span className="text-muted d-block">Direct Phone Number:</span>
                        <a
                          href={`tel:${unlockedContact?.phone_number}`}
                          className="fs-6 fw-bold text-dark text-decoration-none d-flex align-items-center gap-1"
                        >
                          <i className="bi bi-telephone-fill text-primary"></i>
                          {unlockedContact?.phone_number || 'Not provided'}
                        </a>
                      </div>

                      <div className="col-sm-6">
                        <span className="text-muted d-block">WhatsApp Chat:</span>
                        {unlockedContact?.whatsapp_link ? (
                          <a
                            href={unlockedContact.whatsapp_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-success d-inline-flex align-items-center gap-1 fw-bold"
                          >
                            <i className="bi bi-whatsapp"></i> Chat on WhatsApp
                          </a>
                        ) : (
                          <span className="text-muted">Same as phone number</span>
                        )}
                      </div>

                      <div className="col-sm-6">
                        <span className="text-muted d-block">Email Address:</span>
                        <span className="fw-semibold text-dark">{unlockedContact?.email}</span>
                      </div>

                      <div className="col-sm-6">
                        <span className="text-muted d-block">Meetup Campus / Area:</span>
                        <span className="fw-semibold text-dark">{unlockedContact?.meetup_area || book.area_location || book.city}</span>
                      </div>
                    </div>

                    <div className="alert alert-success mt-3 py-2 small mb-0">
                      <i className="bi bi-info-circle me-1"></i> You can now contact this student directly to agree on a campus meetup or delivery. Zero middleman fees on the book price!
                    </div>
                  </div>
                ) : isOwner ? (
                  /* CASE 2: Seller viewing own listing */
                  <div className="alert alert-info py-2 small mb-0">
                    <i className="bi bi-info-circle me-1"></i> <strong>You are the seller of this listing.</strong> Your contact details are safely protected and will only be shown to students who pay the platform access fee.
                  </div>
                ) : (
                  /* CASE 3: Contact is LOCKED */
                  <div>
                    <div className="text-center py-3">
                      <div className="rounded-circle bg-light text-secondary mx-auto d-flex align-items-center justify-content-center mb-2" style={{ width: '54px', height: '54px' }}>
                        <i className="bi bi-lock-fill fs-3 text-warning"></i>
                      </div>
                      <h5 className="fw-bold text-dark mb-1">Seller Contact Details Are Locked</h5>
                      <p className="text-muted small max-w-500 mx-auto mb-3">
                        To protect Pakistani students from spam calls and fake buyers, verified contact details (Phone, WhatsApp, and Exact Campus Location) are unlocked for a nominal platform fee of <strong>Rs. 100</strong>.
                      </p>

                      {/* Check if user currently has submitted a payment awaiting verification */}
                      {book.user_unlock_status === 'SUBMITTED' ? (
                        <div className="alert alert-warning py-2 small mb-0 d-inline-block text-start">
                          <i className="bi bi-clock-history me-1"></i>
                          <strong>Payment Submitted & Under Verification:</strong> Your transaction ID is currently queued for verification. As soon as approved, this box will unlock automatically.
                        </div>
                      ) : (
                        <div className="d-flex flex-column align-items-center gap-2">
                          {isAuthenticated ? (
                            <button
                              type="button"
                              className="btn btn-bookbazar px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2"
                              onClick={() => setShowUnlockModal(true)}
                            >
                              <i className="bi bi-unlock-fill"></i> Unlock Seller Contact (Rs. 100)
                            </button>
                          ) : (
                            <Link
                              to={`/login?redirect=/books/${book.id}`}
                              className="btn btn-bookbazar px-4 py-2 fw-bold shadow-sm"
                            >
                              Log in to Unlock Contact (Rs. 100)
                            </Link>
                          )}
                          <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                            Supported via JazzCash, Easypaisa & Raast Instant Transfer
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Report listing button */}
            <div className="d-flex justify-content-between align-items-center pt-2">
              <button
                type="button"
                className="btn btn-link btn-sm text-secondary text-decoration-none p-0 d-flex align-items-center gap-1"
                onClick={() => setShowReportModal(true)}
              >
                <i className="bi bi-flag"></i> Report Suspicious Listing
              </button>
              <Link to="/browse" className="btn btn-link btn-sm text-bookbazar text-decoration-none p-0">
                &larr; Back to Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BOTTOM ADSENSE PLACEHOLDER */}
      <AdSensePlaceholder
        slotId="bookdetail-bottom-banner"
        format="banner"
        className="mt-4"
      />

      {/* Modals */}
      <ContactUnlockModal
        show={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        listing={book}
        onUnlockSubmitted={(unlockObj) => {
          fetchBookDetails();
        }}
      />

      <ReportListingModal
        show={showReportModal}
        onClose={() => setShowReportModal(false)}
        listing={book}
      />
    </div>
  );
};

export default BookDetailPage;
