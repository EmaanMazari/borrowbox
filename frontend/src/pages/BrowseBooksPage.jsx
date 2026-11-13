import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookService } from '../services/bookService';
import BookCard from '../components/common/BookCard';
import AdSensePlaceholder from '../components/common/AdSensePlaceholder';

const BrowseBooksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({ classes: [], boards: [], conditions: [], cities: [] });

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [classGrade, setClassGrade] = useState(searchParams.get('class_grade') || '');
  const [board, setBoard] = useState(searchParams.get('board') || '');
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  // Mobile filters drawer toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const meta = await bookService.getMetadataChoices();
        setMetadata(meta);
      } catch (err) {
        console.warn('Failed to fetch metadata choices:', err);
      }
    };
    fetchMetadata();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (classGrade) params.class_grade = classGrade;
    if (board) params.board = board;
    if (subject) params.subject = subject;
    if (condition) params.condition = condition;
    if (city) params.city = city;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (sort) params.sort = sort;

    try {
      const data = await bookService.getBooks(params);
      setBooks(data.results || data);
    } catch (err) {
      console.error('Error fetching filtered books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // Synchronize query parameters in browser URL
    const paramsObj = {};
    if (search) paramsObj.search = search;
    if (classGrade) paramsObj.class_grade = classGrade;
    if (board) paramsObj.board = board;
    if (subject) paramsObj.subject = subject;
    if (condition) paramsObj.condition = condition;
    if (city) paramsObj.city = city;
    if (minPrice) paramsObj.min_price = minPrice;
    if (maxPrice) paramsObj.max_price = maxPrice;
    if (sort && sort !== 'newest') paramsObj.sort = sort;
    setSearchParams(paramsObj);
  }, [classGrade, board, condition, city, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleResetFilters = () => {
    setSearch('');
    setClassGrade('');
    setBoard('');
    setSubject('');
    setCondition('');
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="container py-4">
      {/* 1. TOP ADSENSE PLACEHOLDER */}
      <AdSensePlaceholder
        slotId="browse-top-leaderboard"
        format="leaderboard"
        className="mb-3"
      />

      {/* Page Title & Breadcrumb */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h3 className="fw-bold text-dark mb-1">Browse Used Books & Textbooks</h3>
          <p className="text-muted small mb-0">
            Showing separate individual seller listings across Pakistan
          </p>
        </div>

        {/* Mobile Filter Toggle & Sort */}
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-md-none"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <i className="bi bi-funnel me-1"></i> Filters
          </button>

          <select
            className="form-select form-select-sm"
            style={{ width: 'auto' }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Sort: Newly Listed</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="popular">Most Viewed</option>
          </select>
        </div>
      </div>

      <div className="row g-4">
        {/* FILTERS SIDEBAR */}
        <div className={`col-md-3 ${showMobileFilters ? 'd-block' : 'd-none d-md-block'}`}>
          <div className="card border shadow-sm p-3 bg-white rounded-3 sticky-top" style={{ top: '80px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-funnel text-bookbazar"></i> Filter Books
              </h6>
              <button
                type="button"
                className="btn btn-link btn-sm text-decoration-none p-0 text-secondary"
                onClick={handleResetFilters}
              >
                Clear All
              </button>
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <label className="form-label small fw-bold text-muted">Keyword</label>
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title, author, ISBN..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-bookbazar" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            {/* Class / Education Level */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Class / Education Level</label>
              <select
                className="form-select form-select-sm"
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
              >
                <option value="">All Classes</option>
                {metadata.classes.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Education Board */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Education Board</label>
              <select
                className="form-select form-select-sm"
                value={board}
                onChange={(e) => setBoard(e.target.value)}
              >
                <option value="">All Boards</option>
                {metadata.boards.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">City / Campus Location</label>
              <select
                className="form-select form-select-sm"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {metadata.cities.map((ct) => (
                  <option key={ct.value} value={ct.value}>
                    {ct.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Book Condition</label>
              <select
                className="form-select form-select-sm"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="">Any Condition</option>
                {metadata.conditions.map((cd) => (
                  <option key={cd.value} value={cd.value}>
                    {cd.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Price Range (PKR)</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Min Rs."
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Max Rs."
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm w-100 mt-2"
                onClick={fetchListings}
              >
                Apply Price Filter
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS GRID */}
        <div className="col-md-9">
          {/* Active filter count banner */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="small text-muted">
              Found <strong>{books.length}</strong> available textbook listings
            </span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-bookbazar" role="status"></div>
              <p className="text-muted mt-2 small">Searching listings...</p>
            </div>
          ) : books.length > 0 ? (
            <div className="row g-3">
              {books.map((book) => (
                <div key={book.id} className="col-lg-4 col-sm-6">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 bg-white border rounded-4 shadow-sm p-4">
              <i className="bi bi-search text-secondary" style={{ fontSize: '3rem' }}></i>
              <h5 className="fw-bold mt-3">No Books Found</h5>
              <p className="text-muted small">
                No used books match your selected filters. Try broadening your criteria or reset the filters.
              </p>
              <button type="button" className="btn btn-outline-bookbazar btn-sm" onClick={handleResetFilters}>
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. BOTTOM ADSENSE PLACEHOLDER */}
      <AdSensePlaceholder
        slotId="browse-bottom-banner"
        format="banner"
        className="mt-5"
      />
    </div>
  );
};

export default BrowseBooksPage;
