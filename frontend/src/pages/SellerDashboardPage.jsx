import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';

const SellerDashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('ALL'); // ALL, ACTIVE, PAUSED, SOLD
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const data = await bookService.getMySellerListings(currentTab === 'ALL' ? '' : currentTab);
      setListings(data.results || data);
    } catch (err) {
      console.error('Failed to load seller listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/seller-dashboard');
      return;
    }
    fetchMyListings();
  }, [isAuthenticated, currentTab]);

  const handleToggleStatus = async (id, newStatus) => {
    setActionLoadingId(id);
    try {
      await bookService.toggleListingStatus(id, newStatus);
      fetchMyListings();
    } catch (err) {
      alert('Failed to update status. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book listing?')) return;
    setActionLoadingId(id);
    try {
      await bookService.deleteBook(id);
      fetchMyListings();
    } catch (err) {
      alert('Failed to delete listing.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Metrics summary
  const totalCount = listings.length;
  const activeCount = listings.filter((b) => b.status === 'ACTIVE').length;
  const pausedCount = listings.filter((b) => b.status === 'PAUSED').length;
  const soldCount = listings.filter((b) => b.status === 'SOLD').length;
  const totalViews = listings.reduce((acc, b) => acc + (b.views_count || 0), 0);

  return (
    <div className="container py-4">
      {/* Top Banner */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <span className="badge bg-bookbazar-light text-bookbazar mb-1">Seller Control Panel</span>
          <h3 className="fw-bold text-dark mb-1">My Book Listings</h3>
          <p className="text-muted small mb-0">
            Manage your used book catalog, pause active listings, or mark them as sold
          </p>
        </div>

        <Link to="/sell" className="btn btn-bookbazar d-flex align-items-center gap-2 shadow-sm">
          <i className="bi bi-plus-circle"></i> Add New Book Listing
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card p-3 border shadow-sm rounded-3 bg-white">
            <span className="text-muted small fw-semibold">Active Listings</span>
            <div className="h3 fw-bold text-success mb-0">{activeCount}</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card p-3 border shadow-sm rounded-3 bg-white">
            <span className="text-muted small fw-semibold">Paused Listings</span>
            <div className="h3 fw-bold text-warning mb-0">{pausedCount}</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card p-3 border shadow-sm rounded-3 bg-white">
            <span className="text-muted small fw-semibold">Books Sold</span>
            <div className="h3 fw-bold text-secondary mb-0">{soldCount}</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card p-3 border shadow-sm rounded-3 bg-white">
            <span className="text-muted small fw-semibold">Total Views</span>
            <div className="h3 fw-bold text-bookbazar mb-0">{totalViews}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-3 border-bottom pb-2">
        {['ALL', 'ACTIVE', 'PAUSED', 'SOLD'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`btn btn-sm ${
              currentTab === tab ? 'btn-bookbazar fw-bold' : 'btn-outline-secondary'
            }`}
            onClick={() => setCurrentTab(tab)}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()} Listings
          </button>
        ))}
      </div>

      {/* Listings Table / Cards */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-bookbazar" role="status"></div>
          <p className="text-muted mt-2 small">Loading your listings...</p>
        </div>
      ) : listings.length > 0 ? (
        <div className="card border shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th scope="col" style={{ width: '80px' }}>Cover</th>
                  <th scope="col">Book Details</th>
                  <th scope="col">Price</th>
                  <th scope="col">Status</th>
                  <th scope="col">Views</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((book) => {
                  const coverUrl = book.cover_image
                    ? (book.cover_image.startsWith('http') ? book.cover_image : `http://127.0.0.1:8000${book.cover_image}`)
                    : null;

                  return (
                    <tr key={book.id}>
                      {/* Thumbnail */}
                      <td>
                        <div
                          className="rounded border bg-light d-flex align-items-center justify-content-center overflow-hidden"
                          style={{ width: '56px', height: '70px' }}
                        >
                          {coverUrl ? (
                            <img src={coverUrl} alt={book.title} className="w-100 h-100 object-fit-cover" />
                          ) : (
                            <i className="bi bi-book text-muted"></i>
                          )}
                        </div>
                      </td>

                      {/* Title & Board */}
                      <td>
                        <div className="fw-bold text-dark">{book.title}</div>
                        <div className="small text-muted">by {book.author}</div>
                        <div className="d-flex gap-1 mt-1">
                          <span className="badge bg-light text-secondary border" style={{ fontSize: '0.65rem' }}>
                            {book.class_grade_display || book.class_grade}
                          </span>
                          <span className="badge bg-light text-secondary border" style={{ fontSize: '0.65rem' }}>
                            {book.condition_display || book.condition}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td>
                        <div className="fw-bold text-bookbazar">Rs. {Number(book.price).toLocaleString()}</div>
                        {book.original_price && (
                          <div className="small text-muted text-decoration-line-through">
                            Rs. {Number(book.original_price).toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        {book.status === 'ACTIVE' && (
                          <span className="badge bg-success">Active</span>
                        )}
                        {book.status === 'PAUSED' && (
                          <span className="badge bg-warning text-dark">Paused</span>
                        )}
                        {book.status === 'SOLD' && (
                          <span className="badge bg-secondary">Sold</span>
                        )}
                      </td>

                      {/* Views */}
                      <td className="small text-muted">
                        <i className="bi bi-eye me-1"></i>
                        {book.views_count || 0}
                      </td>

                      {/* Quick Actions (Pause, Sold, Edit, Delete) */}
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          {/* Toggle Active / Paused */}
                          {book.status === 'ACTIVE' ? (
                            <button
                              type="button"
                              className="btn btn-outline-warning"
                              title="Pause listing temporarily"
                              onClick={() => handleToggleStatus(book.id, 'PAUSED')}
                              disabled={actionLoadingId === book.id}
                            >
                              <i className="bi bi-pause-circle"></i> Pause
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-outline-success"
                              title="Activate listing"
                              onClick={() => handleToggleStatus(book.id, 'ACTIVE')}
                              disabled={actionLoadingId === book.id}
                            >
                              <i className="bi bi-play-circle"></i> Activate
                            </button>
                          )}

                          {/* Mark as Sold */}
                          {book.status !== 'SOLD' && (
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              title="Mark as Sold"
                              onClick={() => handleToggleStatus(book.id, 'SOLD')}
                              disabled={actionLoadingId === book.id}
                            >
                              <i className="bi bi-check-circle"></i> Mark Sold
                            </button>
                          )}

                          {/* Edit */}
                          <Link to={`/sell?edit=${book.id}`} className="btn btn-outline-primary" title="Edit book details">
                            <i className="bi bi-pencil"></i>
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            title="Delete listing"
                            onClick={() => handleDeleteListing(book.id)}
                            disabled={actionLoadingId === book.id}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-5 bg-white border rounded-4 shadow-sm p-4">
          <i className="bi bi-folder2-open text-muted" style={{ fontSize: '3rem' }}></i>
          <h5 className="fw-bold mt-2">No Listings in this Tab</h5>
          <p className="text-muted small">You don't have any books with status: {currentTab}.</p>
          <Link to="/sell" className="btn btn-bookbazar btn-sm">
            Post a Book for Sale
          </Link>
        </div>
      )}
    </div>
  );
};

export default SellerDashboardPage;
