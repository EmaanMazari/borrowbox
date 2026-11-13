import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('PAYMENTS'); // PAYMENTS, LISTINGS, USERS, REPORTS
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Tab data states
  const [payments, setPayments] = useState([]);
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Filters
  const [paymentFilter, setPaymentFilter] = useState('SUBMITTED'); // SUBMITTED, VERIFIED, REJECTED, ''
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login?redirect=/admin-dashboard');
      return;
    }
    loadStats();
  }, [isAuthenticated, isAdmin]);

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadTabData = async () => {
    setTabLoading(true);
    try {
      if (activeTab === 'PAYMENTS') {
        const data = await adminService.getPayments(paymentFilter);
        setPayments(data.results || data);
      } else if (activeTab === 'LISTINGS') {
        const data = await adminService.getListings();
        setListings(data.results || data);
      } else if (activeTab === 'USERS') {
        const data = await adminService.getUsers(userSearch);
        setUsers(data.results || data);
      } else if (activeTab === 'REPORTS') {
        const data = await adminService.getReports();
        setReports(data.results || data);
      }
    } catch (err) {
      console.error('Failed to load tab data:', err);
    } finally {
      setTabLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadTabData();
    }
  }, [activeTab, paymentFilter]);

  // Action handlers
  const handleVerifyPayment = async (unlockId, action) => {
    const notes = prompt(`Enter notes for ${action} action:`, action === 'VERIFY' ? 'Payment confirmed via statement.' : 'Invalid transaction ID.');
    if (notes === null) return;

    setActionLoadingId(unlockId);
    try {
      await adminService.verifyPayment(unlockId, action, notes);
      loadTabData();
      loadStats();
    } catch (err) {
      alert('Failed to update payment status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleUser = async (userId) => {
    setActionLoadingId(userId);
    try {
      await adminService.toggleUserStatus(userId);
      loadTabData();
    } catch (err) {
      alert('Failed to update user status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdateReport = async (reportId, statusVal) => {
    setActionLoadingId(reportId);
    try {
      await adminService.updateReport(reportId, { status: statusVal });
      loadTabData();
      loadStats();
    } catch (err) {
      alert('Failed to update report.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <span className="badge bg-danger text-white mb-1">Administrative Privileges</span>
          <h3 className="fw-bold text-dark mb-0">Platform Admin Dashboard</h3>
          <p className="text-muted small mb-0">
            Moderate listings, verify Rs. 100 contact unlock payments, manage users and user flags
          </p>
        </div>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { loadStats(); loadTabData(); }}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-sm-6">
          <div className="card p-3 border shadow-sm rounded-3 bg-white">
            <span className="small text-muted fw-semibold">Pending Verifications (TIDs)</span>
            <div className="h3 fw-bold text-warning mb-0">
              {stats?.payments?.pending_verification ?? 0}
            </div>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Rs. 100 Payments queue</span>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="card p-3 border shadow-sm rounded-3 bg-white">
            <span className="small text-muted fw-semibold">Contact Fee Revenue</span>
            <div className="h3 fw-bold text-success mb-0">
              Rs. {Number(stats?.payments?.total_revenue_pkr ?? 0).toLocaleString()}
            </div>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              {stats?.payments?.verified ?? 0} verified unlocks
            </span>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="card p-3 border shadow-sm rounded-3 bg-white">
            <span className="small text-muted fw-semibold">Total Book Listings</span>
            <div className="h3 fw-bold text-bookbazar mb-0">
              {stats?.listings?.total ?? 0}
            </div>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              {stats?.listings?.active ?? 0} active &bull; {stats?.listings?.sold ?? 0} sold
            </span>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="card p-3 border shadow-sm rounded-3 bg-white">
            <span className="small text-muted fw-semibold">Moderation Reports</span>
            <div className="h3 fw-bold text-danger mb-0">
              {stats?.moderation?.pending_reports ?? 0}
            </div>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Pending reviews</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <ul className="nav nav-pills mb-4 bg-white p-2 rounded-3 border shadow-sm">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link small fw-bold ${activeTab === 'PAYMENTS' ? 'active bg-bookbazar' : 'text-dark'}`}
            onClick={() => setActiveTab('PAYMENTS')}
          >
            <i className="bi bi-wallet2 me-1"></i> Payment Verifications (Rs. 100 Fees)
            {stats?.payments?.pending_verification > 0 && (
              <span className="badge bg-danger ms-2">{stats.payments.pending_verification}</span>
            )}
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link small fw-bold ${activeTab === 'LISTINGS' ? 'active bg-bookbazar' : 'text-dark'}`}
            onClick={() => setActiveTab('LISTINGS')}
          >
            <i className="bi bi-book me-1"></i> Book Listings Moderation
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link small fw-bold ${activeTab === 'USERS' ? 'active bg-bookbazar' : 'text-dark'}`}
            onClick={() => setActiveTab('USERS')}
          >
            <i className="bi bi-people me-1"></i> Registered Users
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link small fw-bold ${activeTab === 'REPORTS' ? 'active bg-bookbazar' : 'text-dark'}`}
            onClick={() => setActiveTab('REPORTS')}
          >
            <i className="bi bi-flag me-1"></i> Reports & Flags
          </button>
        </li>
      </ul>

      {/* TAB 1: PAYMENTS VERIFICATION QUEUE */}
      {activeTab === 'PAYMENTS' && (
        <div className="card border shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="card-header bg-light d-flex flex-wrap justify-content-between align-items-center py-3">
            <h6 className="fw-bold mb-0 text-dark">Contact Unlock Fee Verification Queue</h6>
            <div className="d-flex gap-2">
              {['SUBMITTED', 'VERIFIED', 'REJECTED', ''].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`btn btn-sm ${
                    paymentFilter === st ? 'btn-dark' : 'btn-outline-secondary'
                  }`}
                  onClick={() => setPaymentFilter(st)}
                >
                  {st ? st : 'All'}
                </button>
              ))}
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Buyer</th>
                  <th scope="col">Book / Listing</th>
                  <th scope="col">Method</th>
                  <th scope="col">Transaction ID (TID)</th>
                  <th scope="col">Sender Phone</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end">Verification Action</th>
                </tr>
              </thead>
              <tbody>
                {tabLoading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-muted">
                      <span className="spinner-border spinner-border-sm me-2"></span> Loading payments...
                    </td>
                  </tr>
                ) : payments.length > 0 ? (
                  payments.map((p) => {
                    const isSubmitted = p.status === 'SUBMITTED';
                    const isVerified = p.status === 'VERIFIED';
                    return (
                      <tr key={p.id}>
                        <td className="fw-bold">#{p.id}</td>
                        <td>
                          <div className="fw-semibold text-dark">User #{p.buyer}</div>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '200px' }}>
                            {p.listing?.title || 'Book Listing'}
                          </div>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            Seller: {p.listing?.seller?.display_name || 'Seller'}
                          </span>
                        </td>
                        <td className="text-uppercase fw-semibold">{p.payment_method}</td>
                        <td>
                          <code className="text-primary fw-bold">{p.transaction_id || 'Not submitted'}</code>
                        </td>
                        <td>{p.sender_mobile || 'N/A'}</td>
                        <td className="fw-bold text-success">Rs. {p.amount}</td>
                        <td>
                          {isSubmitted && <span className="badge bg-warning text-dark">Pending</span>}
                          {isVerified && <span className="badge bg-success">Verified</span>}
                          {p.status === 'REJECTED' && <span className="badge bg-danger">Rejected</span>}
                          {p.status === 'INITIATED' && <span className="badge bg-secondary">Initiated</span>}
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={() => handleVerifyPayment(p.id, 'VERIFY')}
                              disabled={actionLoadingId === p.id || isVerified}
                              title="Verify payment and unlock seller contact"
                            >
                              <i className="bi bi-check-lg"></i> Verify & Unlock
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => handleVerifyPayment(p.id, 'REJECT')}
                              disabled={actionLoadingId === p.id || p.status === 'REJECTED'}
                              title="Reject invalid transaction"
                            >
                              <i className="bi bi-x-lg"></i> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-muted">
                      No payment records found in this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LISTINGS MODERATION */}
      {activeTab === 'LISTINGS' && (
        <div className="card border shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="card-header bg-light py-3">
            <h6 className="fw-bold mb-0 text-dark">All Platform Book Listings</h6>
          </div>
          <div className="table-responsive">
            <table className="table align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Title</th>
                  <th scope="col">Class & Board</th>
                  <th scope="col">Price</th>
                  <th scope="col">Seller</th>
                  <th scope="col">City</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {tabLoading ? (
                  <tr><td colSpan="7" className="text-center py-4">Loading listings...</td></tr>
                ) : listings.map((b) => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td className="fw-bold text-dark">{b.title}</td>
                    <td>{b.class_grade_display} &bull; {b.board_display}</td>
                    <td className="fw-bold text-bookbazar">Rs. {Number(b.price).toLocaleString()}</td>
                    <td>{b.seller?.display_name}</td>
                    <td className="text-capitalize">{b.city}</td>
                    <td>
                      <span className={`badge ${b.status === 'ACTIVE' ? 'bg-success' : b.status === 'PAUSED' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USERS MANAGEMENT */}
      {activeTab === 'USERS' && (
        <div className="card border shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="card-header bg-light d-flex justify-content-between align-items-center py-3">
            <h6 className="fw-bold mb-0 text-dark">Platform Users (Dual Role: Buyer & Seller)</h6>
            <form onSubmit={(e) => { e.preventDefault(); loadTabData(); }} className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search username, email, phone..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-sm btn-dark">Search</button>
            </form>
          </div>
          <div className="table-responsive">
            <table className="table align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">User</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">City / Campus</th>
                  <th scope="col">Staff / Admin</th>
                  <th scope="col">Active Status</th>
                  <th scope="col" className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {tabLoading ? (
                  <tr><td colSpan="8" className="text-center py-4">Loading users...</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td className="fw-bold text-dark">{u.display_name} ({u.username})</td>
                    <td>{u.email}</td>
                    <td>{u.phone_number || 'N/A'}</td>
                    <td>{u.city} {u.institute ? `(${u.institute})` : ''}</td>
                    <td>{u.is_staff ? <span className="badge bg-danger">Staff</span> : <span className="badge bg-light text-secondary border">Student</span>}</td>
                    <td>
                      {u.is_active !== false ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-danger">Banned / Inactive</span>
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className={`btn btn-sm ${u.is_active !== false ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        onClick={() => handleToggleUser(u.id)}
                        disabled={actionLoadingId === u.id || u.is_superuser}
                      >
                        {u.is_active !== false ? 'Ban User' : 'Unban User'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS MODERATION */}
      {activeTab === 'REPORTS' && (
        <div className="card border shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="card-header bg-light py-3">
            <h6 className="fw-bold mb-0 text-dark">User Moderation Reports & Flags</h6>
          </div>
          <div className="table-responsive">
            <table className="table align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Listing Title</th>
                  <th scope="col">Reporter</th>
                  <th scope="col">Reason</th>
                  <th scope="col">Details</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {tabLoading ? (
                  <tr><td colSpan="7" className="text-center py-4">Loading reports...</td></tr>
                ) : reports.length > 0 ? (
                  reports.map((r) => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td className="fw-bold text-dark">{r.listing_title}</td>
                      <td>{r.reporter_username || 'Anonymous'}</td>
                      <td><span className="badge bg-warning text-dark">{r.reason_display || r.reason}</span></td>
                      <td style={{ maxWidth: '280px' }}>{r.details}</td>
                      <td>
                        <span className={`badge ${r.status === 'PENDING' ? 'bg-danger' : 'bg-success'}`}>
                          {r.status_display || r.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-success"
                            onClick={() => handleUpdateReport(r.id, 'RESOLVED')}
                            disabled={actionLoadingId === r.id || r.status === 'RESOLVED'}
                          >
                            Resolve
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => handleUpdateReport(r.id, 'DISMISSED')}
                            disabled={actionLoadingId === r.id || r.status === 'DISMISSED'}
                          >
                            Dismiss
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" className="text-center py-4 text-muted">No reports submitted.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
