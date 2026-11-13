import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  // Condition badge style mapping
  const conditionBadgeConfig = {
    brand_new: { text: 'Brand New', bg: 'bg-success text-white' },
    like_new: { text: 'Like New', bg: 'bg-teal-600 text-white', style: { backgroundColor: '#0d9488' } },
    good: { text: 'Good', bg: 'bg-primary text-white' },
    fair: { text: 'Fair', bg: 'bg-warning text-dark' },
    poor: { text: 'Heavily Used', bg: 'bg-secondary text-white' },
  }[book.condition] || { text: book.condition_display || 'Used', bg: 'bg-light text-dark' };

  const seller = book.seller || {};
  const sellerInitial = (seller.display_name || 'S').charAt(0).toUpperCase();

  // Media URL fallback
  const coverUrl = book.cover_image
    ? (book.cover_image.startsWith('http') ? book.cover_image : `http://127.0.0.1:8000${book.cover_image}`)
    : null;

  return (
    <div className="card h-100 book-card shadow-sm position-relative">
      {/* Top badges: Condition & Discount */}
      <div className="position-absolute top-0 start-0 m-2 z-1 d-flex flex-column gap-1">
        <span
          className={`badge badge-condition ${conditionBadgeConfig.bg}`}
          style={conditionBadgeConfig.style}
        >
          {conditionBadgeConfig.text}
        </span>
        {book.discount_percentage && (
          <span className="badge bg-danger text-white rounded-pill" style={{ fontSize: '0.7rem' }}>
            {book.discount_percentage}% OFF
          </span>
        )}
      </div>

      {/* Book Cover Image */}
      <Link to={`/books/${book.id}`} className="text-decoration-none">
        <div
          className="bg-light d-flex align-items-center justify-content-center overflow-hidden position-relative"
          style={{ height: '220px', borderBottom: '1px solid #f1f5f9' }}
        >
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={book.title}
              className="w-100 h-100 object-fit-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="d-flex flex-column align-items-center justify-content-center text-muted p-3 text-center w-100 h-100"
            style={{ display: coverUrl ? 'none' : 'flex' }}
          >
            <i className="bi bi-book text-secondary" style={{ fontSize: '3rem' }}></i>
            <span className="small mt-1 text-truncate w-100 fw-semibold">{book.subject || 'Textbook'}</span>
          </div>
        </div>
      </Link>

      {/* Card Body */}
      <div className="card-body d-flex flex-column p-3">
        {/* Education Board & Class Grade Tags */}
        <div className="d-flex flex-wrap gap-1 mb-2">
          <span className="badge bg-bookbazar-light text-bookbazar" style={{ fontSize: '0.7rem' }}>
            {book.class_grade_display || book.class_grade}
          </span>
          {book.board_display && (
            <span className="badge bg-light text-secondary border" style={{ fontSize: '0.7rem' }}>
              {book.board_display.split('(')[0].trim()}
            </span>
          )}
        </div>

        {/* Title & Author */}
        <h6 className="card-title mb-1 fw-bold text-dark text-truncate" title={book.title}>
          <Link to={`/books/${book.id}`} className="text-dark text-decoration-none hover-primary">
            {book.title}
          </Link>
        </h6>
        <p className="card-subtitle small text-muted text-truncate mb-2" title={book.author}>
          by {book.author || 'Unknown Author'}
        </p>

        {/* Pricing */}
        <div className="mt-auto pt-2 border-top">
          <div className="d-flex align-items-baseline gap-2">
            <span className="h5 fw-bold text-bookbazar mb-0">Rs. {Number(book.price).toLocaleString()}</span>
            {book.original_price && Number(book.original_price) > Number(book.price) && (
              <span className="text-muted text-decoration-line-through small">
                Rs. {Number(book.original_price).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Individual Seller Listing Badge (Search result requirement) */}
        <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            <div
              className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
              style={{ width: '26px', height: '26px', fontSize: '0.75rem' }}
            >
              {sellerInitial}
            </div>
            <div className="overflow-hidden">
              <div className="small fw-semibold text-truncate text-dark" style={{ fontSize: '0.8rem' }}>
                {seller.display_name || 'Student Seller'}
              </div>
              <div className="text-muted text-truncate" style={{ fontSize: '0.7rem' }}>
                <i className="bi bi-geo-alt me-1"></i>
                {book.city ? book.city.charAt(0).toUpperCase() + book.city.slice(1) : 'Pakistan'}
              </div>
            </div>
          </div>
          <Link
            to={`/books/${book.id}`}
            className="btn btn-sm btn-outline-bookbazar px-2 py-1 rounded-pill flex-shrink-0"
            style={{ fontSize: '0.75rem' }}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
