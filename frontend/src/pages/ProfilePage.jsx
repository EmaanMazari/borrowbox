import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [city, setCity] = useState('lahore');
  const [institute, setInstitute] = useState('');
  const [addressArea, setAddressArea] = useState('');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile');
      return;
    }
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setPhoneNumber(user.phone_number || '');
      setWhatsappNumber(user.whatsapp_number || '');
      setCity(user.city || 'lahore');
      setInstitute(user.institute || '');
      setAddressArea(user.address_area || '');
      setBio(user.bio || '');
    }
  }, [user, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phoneNumber.trim(),
        whatsapp_number: whatsappNumber.trim(),
        city,
        institute: institute.trim(),
        address_area: addressArea.trim(),
        bio: bio.trim(),
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="max-w-700 mx-auto" style={{ maxWidth: '720px' }}>
        <div className="mb-4">
          <span className="badge bg-secondary mb-1">Account & Privacy</span>
          <h3 className="fw-bold text-dark mb-1">Profile & Contact Settings</h3>
          <p className="text-muted small mb-0">
            Keep your phone and campus area up to date so buyers can reach you once verified.
          </p>
        </div>

        {/* User stats card */}
        <div className="card p-3 border shadow-sm rounded-4 bg-white mb-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-bookbazar text-white d-flex align-items-center justify-content-center fw-bold fs-3"
              style={{ width: '64px', height: '64px' }}
            >
              {(user?.display_name || user?.username || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-dark">{user?.display_name || user?.username}</h5>
              <div className="small text-muted">{user?.email}</div>
              <div className="d-flex gap-2 mt-2">
                <span className="badge bg-bookbazar-light text-bookbazar">
                  {user?.active_listings_count ?? 0} Active Books
                </span>
                <span className="badge bg-light text-secondary border">
                  {user?.sold_listings_count ?? 0} Sold
                </span>
                {user?.is_verified_seller && (
                  <span className="badge bg-success">Verified Student</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {success && (
          <div className="alert alert-success py-2 small d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill"></i>
            <div>{success}</div>
          </div>
        )}
        {error && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-circle-fill"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card border shadow-sm rounded-4 p-4 bg-white">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold">First Name</label>
              <input
                type="text"
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Last Name</label>
              <input
                type="text"
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                className="form-control"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <div className="form-text small" style={{ fontSize: '0.75rem' }}>
                Protected by contact-unlock gate.
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">WhatsApp Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Same as phone if blank"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">City</label>
              <select
                className="form-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="lahore">Lahore</option>
                <option value="karachi">Karachi</option>
                <option value="islamabad">Islamabad</option>
                <option value="rawalpindi">Rawalpindi</option>
                <option value="faisalabad">Faisalabad</option>
                <option value="multan">Multan</option>
                <option value="peshawar">Peshawar</option>
                <option value="quetta">Quetta</option>
                <option value="sialkot">Sialkot</option>
                <option value="other">Other City</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">College / University</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. NUST, Punjab University, FAST"
                value={institute}
                onChange={(e) => setInstitute(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold">Campus Area / Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. New Campus Gate 1, Gulberg III, DHA Phase 5"
                value={addressArea}
                onChange={(e) => setAddressArea(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold">Bio / About Seller</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Share your major, university semester, or book condition standards..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>
          </div>

          <button type="submit" className="btn btn-bookbazar px-4 py-2 fw-bold mt-4" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
            Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
