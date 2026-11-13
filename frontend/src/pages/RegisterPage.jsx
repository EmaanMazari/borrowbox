import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [city, setCity] = useState('lahore');
  const [institute, setInstitute] = useState('');
  const [addressArea, setAddressArea] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        password_confirm: passwordConfirm,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phoneNumber.trim(),
        whatsapp_number: whatsappNumber.trim() || phoneNumber.trim(),
        city,
        institute: institute.trim(),
        address_area: addressArea.trim(),
      });
      navigate('/');
    } catch (err) {
      const errData = err.response?.data;
      if (typeof errData === 'object') {
        const firstKey = Object.keys(errData)[0];
        setError(`${firstKey}: ${errData[firstKey]}`);
      } else {
        setError('Registration failed. Please check inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="max-w-600 mx-auto" style={{ maxWidth: '640px' }}>
        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-bookbazar-light text-bookbazar mx-auto d-flex align-items-center justify-content-center mb-2"
            style={{ width: '56px', height: '56px', fontSize: '1.75rem' }}
          >
            <i className="bi bi-person-plus-fill"></i>
          </div>
          <h4 className="fw-bold text-dark">Join BookBazar Pakistan</h4>
          <p className="text-muted small">
            One unified account lets you both <strong>sell</strong> your old books and <strong>buy</strong> from fellow students.
          </p>
        </div>

        <div className="card border shadow-sm rounded-4 p-4 bg-white mb-3">
          {error && (
            <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-circle-fill"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Username <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. ali_nust"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Email Address <span className="text-danger">*</span></label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. student@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ali"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ahmed"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Phone Number (Pakistani Mobile) <span className="text-danger">*</span></label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="e.g. 03001234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <div className="form-text small" style={{ fontSize: '0.7rem' }}>
                  Kept strictly private until verified contact unlock.
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">WhatsApp Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="e.g. 03001234567 (Optional)"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">City <span className="text-danger">*</span></label>
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
                  <option value="gujranwala">Gujranwala</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="other">Other City</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">College / University / School</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Punjab University, NUST, FAST"
                  value={institute}
                  onChange={(e) => setInstitute(e.target.value)}
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-bold">Campus Area / Sector</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. New Campus, H-12, Gulberg, Johar Town"
                  value={addressArea}
                  onChange={(e) => setAddressArea(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Password <span className="text-danger">*</span></label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Confirm Password <span className="text-danger">*</span></label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Repeat your password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-bookbazar w-100 py-2 fw-bold mt-4" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
              Create Unified Account
            </button>
          </form>
        </div>

        <div className="text-center small text-muted">
          Already registered?{' '}
          <Link to="/login" className="text-bookbazar fw-bold text-decoration-none">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
