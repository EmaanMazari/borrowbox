import React, { useState } from 'react';
import { paymentService } from '../../services/paymentService';

const ContactUnlockModal = ({ show, onClose, listing, onUnlockSubmitted }) => {
  const [step, setStep] = useState(1); // 1: Choose method & Initiate, 2: Transfer details & Submit TID, 3: Success awaiting verification
  const [paymentMethod, setPaymentMethod] = useState('jazzcash');
  const [unlockData, setUnlockData] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [senderMobile, setSenderMobile] = useState('');
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!show || !listing) return null;

  const handleInitiate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await paymentService.initiateUnlock(listing.id, paymentMethod);
      setUnlockData(data);
      if (data.status === 'VERIFIED') {
        // Already verified
        onUnlockSubmitted(data.unlock_request);
        onClose();
      } else {
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to initiate unlock request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!transactionId.trim() || !senderMobile.trim()) {
      setError('Please provide both your Transaction ID (TID) and the sender mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('transaction_id', transactionId.trim());
    formData.append('sender_mobile', senderMobile.trim());
    if (paymentProofFile) {
      formData.append('payment_proof', paymentProofFile);
    }

    try {
      const res = await paymentService.submitPaymentProof(unlockData.unlock_request_id, formData);
      setStep(3);
      if (onUnlockSubmitted) {
        onUnlockSubmitted(res.unlock_request);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit payment details. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header bg-light border-bottom">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock-fill text-bookbazar"></i> Unlock Seller Contact
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading}></button>
          </div>

          <div className="modal-body p-4">
            {/* Book Mini Summary */}
            <div className="p-3 bg-light rounded-3 mb-3 border">
              <div className="small text-muted text-uppercase fw-bold">Selected Listing</div>
              <div className="fw-bold text-dark text-truncate">{listing.title}</div>
              <div className="d-flex justify-content-between align-items-center mt-1 small">
                <span className="text-secondary">Seller: {listing.seller?.display_name || 'Student Seller'}</span>
                <span className="fw-bold text-bookbazar">Book Price: Rs. {Number(listing.price).toLocaleString()}</span>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-circle-fill"></i>
                <div>{error}</div>
              </div>
            )}

            {/* STEP 1: Fee explanation & Payment Method */}
            {step === 1 && (
              <div>
                <div className="border rounded-3 p-3 bg-bookbazar-light mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-dark">Platform Contact-Access Fee:</span>
                    <span className="h5 fw-bold text-bookbazar mb-0">Rs. 100</span>
                  </div>
                  <hr className="my-2" />
                  <ul className="small text-secondary mb-0 ps-3">
                    <li>The platform does <strong>not</strong> stock books or take commission on the book price.</li>
                    <li>You negotiate, inspect and pay the book price (Rs. {Number(listing.price).toLocaleString()}) directly to the seller.</li>
                    <li>Unlocks verified direct WhatsApp, Phone Number & Campus Meetup Location.</li>
                  </ul>
                </div>

                <label className="form-label fw-bold small text-dark">Select Payment Method:</label>
                <div className="d-flex flex-column gap-2 mb-4">
                  <label className={`card p-3 border cursor-pointer ${paymentMethod === 'jazzcash' ? 'border-primary bg-light' : ''}`} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="payment_method"
                          value="jazzcash"
                          checked={paymentMethod === 'jazzcash'}
                          onChange={() => setPaymentMethod('jazzcash')}
                          className="form-check-input"
                        />
                        <span className="fw-bold text-dark">JazzCash Mobile Account / Voucher</span>
                      </div>
                      <span className="badge bg-danger">Popular</span>
                    </div>
                  </label>

                  <label className={`card p-3 border cursor-pointer ${paymentMethod === 'easypaisa' ? 'border-primary bg-light' : ''}`} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="payment_method"
                          value="easypaisa"
                          checked={paymentMethod === 'easypaisa'}
                          onChange={() => setPaymentMethod('easypaisa')}
                          className="form-check-input"
                        />
                        <span className="fw-bold text-dark">Easypaisa Mobile Account / QR</span>
                      </div>
                      <span className="badge bg-success">Instant</span>
                    </div>
                  </label>

                  <label className={`card p-3 border cursor-pointer ${paymentMethod === 'raast' ? 'border-primary bg-light' : ''}`} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="payment_method"
                          value="raast"
                          checked={paymentMethod === 'raast'}
                          onChange={() => setPaymentMethod('raast')}
                          className="form-check-input"
                        />
                        <span className="fw-bold text-dark">Raast Instant Banking</span>
                      </div>
                      <span className="badge bg-secondary">State Bank</span>
                    </div>
                  </label>
                </div>

                <button
                  type="button"
                  className="btn btn-bookbazar w-100 py-2 fw-bold"
                  onClick={handleInitiate}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="bi bi-arrow-right-circle me-1"></i>
                  )}
                  Proceed to Payment (Rs. 100)
                </button>
              </div>
            )}

            {/* STEP 2: Platform account details & Submit Proof */}
            {step === 2 && unlockData && (
              <form onSubmit={handleSubmitProof}>
                <div className="alert alert-info py-2 small mb-3">
                  <strong>Instructions:</strong> Please transfer <strong>Rs. 100</strong> to the official BookBazar account below, then enter your Transaction ID (TID) to queue verification.
                </div>

                {/* Account Details Box */}
                <div className="bg-light border rounded-3 p-3 mb-3">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Payment Channel:</span>
                    <span className="fw-bold text-dark text-uppercase">{unlockData.payment_method}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Official Mobile Account:</span>
                    <span className="fw-bold text-dark">
                      {unlockData.platform_accounts[unlockData.payment_method]?.account_number || '0300-1234567'}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Account Title:</span>
                    <span className="fw-bold text-dark">
                      {unlockData.platform_accounts[unlockData.payment_method]?.account_title || 'BookBazar Official'}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Exact Amount:</span>
                    <span className="fw-bold text-bookbazar">Rs. 100.00</span>
                  </div>
                </div>

                {/* Transaction ID Input */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark">
                    Transaction ID (TID / TRX ID) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 092837461234 (From JazzCash/Easypaisa SMS)"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                  />
                  <div className="form-text" style={{ fontSize: '0.75rem' }}>
                    Found in the confirmation SMS or receipt from your mobile wallet.
                  </div>
                </div>

                {/* Sender Mobile Input */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark">
                    Sender Mobile Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="e.g. 03001234567"
                    value={senderMobile}
                    onChange={(e) => setSenderMobile(e.target.value)}
                    required
                  />
                </div>

                {/* Optional Screenshot */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark">
                    Transfer Screenshot (Optional)
                  </label>
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    accept="image/*"
                    onChange={(e) => setPaymentProofFile(e.target.files[0])}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-50"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-bookbazar w-50 fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      'Submit Verification'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Submitted & Pending Verification */}
            {step === 3 && (
              <div className="text-center py-3">
                <div className="text-success mb-3" style={{ fontSize: '3.5rem' }}>
                  <i className="bi bi-clock-history text-warning"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">Payment Submitted for Verification</h5>
                <p className="text-muted small mb-3">
                  Your Rs. 100 transaction ID <code>{transactionId}</code> has been received. In accordance with platform security rules, the seller's contact details will be automatically unlocked as soon as verified by our verification queue.
                </p>
                <div className="alert alert-secondary small py-2 text-start">
                  <i className="bi bi-info-circle me-1"></i> You can track this in <strong>My Unlocked Contacts</strong> or return to this book page at any time.
                </div>
                <button
                  type="button"
                  className="btn btn-bookbazar w-100 fw-bold mt-2"
                  onClick={onClose}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUnlockModal;
