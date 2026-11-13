import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import BookCard from '../components/common/BookCard';
import AdSensePlaceholder from '../components/common/AdSensePlaceholder';

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeBooks = async () => {
      try {
        const data = await bookService.getBooks({ page_size: 8 });
        setFeaturedBooks(data.results || data);
      } catch (err) {
        console.error('Error fetching home listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeBooks();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle.trim()) params.append('search', searchTitle.trim());
    if (selectedClass) params.append('class_grade', selectedClass);
    if (selectedCity) params.append('city', selectedCity);
    navigate(`/browse?${params.toString()}`);
  };

  const quickClasses = [
    { label: 'Matric (Class 9 & 10)', value: 'class_9', icon: 'bi-pencil-square' },
    { label: 'FSc & ICS Part 1 (11th)', value: 'fsc_1', icon: 'bi-mortarboard' },
    { label: 'FSc & ICS Part 2 (12th)', value: 'fsc_2', icon: 'bi-award' },
    { label: 'O Levels & A Levels', value: 'o_levels', icon: 'bi-globe2' },
    { label: 'MDCAT & ECAT Entry Test', value: 'entry_test', icon: 'bi-speedometer2' },
    { label: 'University & Engineering', value: 'bachelor_bs', icon: 'bi-building' },
  ];

  return (
    <div>
      {/* 1. TOP ADSENSE PLACEHOLDER */}
      <div className="container">
        <AdSensePlaceholder
          slotId="home-top-leaderboard"
          format="leaderboard"
          className="mb-2"
        />
      </div>

      {/* 2. HERO SECTION */}
      <section className="bg-white border-bottom py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge bg-bookbazar-light text-bookbazar px-3 py-2 rounded-pill fw-bold mb-3">
                <i className="bi bi-shield-check me-1"></i> Pakistan's #1 Student Textbook Marketplace
              </span>
              <h1 className="display-5 fw-extrabold text-dark lh-tight mb-3">
                Buy & Sell Used Books Directly From <span className="text-bookbazar">Students</span>
              </h1>
              <p className="lead text-secondary mb-4">
                Save up to <strong>70%</strong> on Matric, FSc, O/A Levels, MDCAT, and University textbooks across Lahore, Karachi, Islamabad, Peshawar and all of Pakistan.
              </p>

              {/* Quick Hero Search Box */}
              <div className="card shadow-sm border p-3 bg-light rounded-4">
                <form onSubmit={handleHeroSearch} className="row g-2">
                  <div className="col-md-5">
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Book title, subject, or author..."
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <select
                      className="form-select"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      <option value="">All Classes</option>
                      <option value="class_9">Class 9 (Matric 1)</option>
                      <option value="class_10">Class 10 (Matric 2)</option>
                      <option value="fsc_1">FSc / ICS Part 1</option>
                      <option value="fsc_2">FSc / ICS Part 2</option>
                      <option value="o_levels">O Levels</option>
                      <option value="a_levels">A Levels</option>
                      <option value="entry_test">MDCAT / ECAT</option>
                      <option value="bachelor_bs">University</option>
                    </select>
                  </div>
                  <div className="col-md-2 col-6">
                    <select
                      className="form-select"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                    >
                      <option value="">All Cities</option>
                      <option value="lahore">Lahore</option>
                      <option value="karachi">Karachi</option>
                      <option value="islamabad">Islamabad</option>
                      <option value="rawalpindi">Rawalpindi</option>
                      <option value="faisalabad">Faisalabad</option>
                      <option value="multan">Multan</option>
                      <option value="peshawar">Peshawar</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button type="submit" className="btn btn-bookbazar w-100 fw-bold">
                      Find Books
                    </button>
                  </div>
                </form>
              </div>

              {/* Sub features */}
              <div className="d-flex flex-wrap gap-4 mt-4 small text-secondary">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Free to List Any Book</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Zero Commission on Book Price</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Verified Contact Protection</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Banner */}
            <div className="col-lg-5">
              <div className="card border-0 shadow rounded-4 overflow-hidden bg-primary text-white p-4" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge bg-white text-dark px-3 py-1 rounded-pill fw-bold">
                    Pakistani Student Community
                  </span>
                  <span className="text-white-50 small">Lahore &bull; Karachi &bull; Islamabad</span>
                </div>
                <h4 className="fw-bold mb-3">Have old textbooks lying on your shelf?</h4>
                <p className="text-white-50 small mb-4">
                  Help junior students save money while earning cash back from your used books. It takes less than 2 minutes to post your listing with barcode scanning.
                </p>
                <div className="d-flex gap-2">
                  <Link to="/sell" className="btn btn-warning text-dark fw-bold px-4 py-2 rounded-pill">
                    <i className="bi bi-camera me-1"></i> Sell Your Book Now
                  </Link>
                  <Link to="/browse" className="btn btn-outline-light px-3 py-2 rounded-pill">
                    Explore Books
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BROWSE BY CURRICULUM & CLASS */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h4 className="fw-bold text-dark mb-1">Browse by Class & Curriculum</h4>
              <p className="text-muted small mb-0">Select your education level to find prescribed syllabus books</p>
            </div>
            <Link to="/browse" className="btn btn-sm btn-outline-bookbazar rounded-pill">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-3">
            {quickClasses.map((item, idx) => (
              <div key={idx} className="col-md-4 col-sm-6">
                <Link
                  to={`/browse?class_grade=${item.value}`}
                  className="card p-3 border rounded-3 text-decoration-none text-dark bg-white shadow-sm hover-shadow d-flex flex-row align-items-center gap-3"
                  style={{ transition: 'all 0.2s ease' }}
                >
                  <div
                    className="rounded-circle bg-bookbazar-light text-bookbazar d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '48px', height: '48px', fontSize: '1.4rem' }}
                  >
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">{item.label}</div>
                    <div className="text-muted small">Explore used student copies &rarr;</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RECENT STUDENT LISTINGS */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="badge bg-bookbazar-light text-bookbazar mb-2">Verified Student Sellers</span>
              <h4 className="fw-bold text-dark mb-1">Fresh Books on BookBazar</h4>
              <p className="text-muted small mb-0">Direct student listings with condition, campus area, and asking price</p>
            </div>
            <Link to="/browse" className="btn btn-sm btn-bookbazar rounded-pill px-3">
              Explore All Listings
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-bookbazar" role="status"></div>
              <p className="text-muted mt-2 small">Loading textbook listings...</p>
            </div>
          ) : featuredBooks.length > 0 ? (
            <div className="row g-3">
              {featuredBooks.map((book) => (
                <div key={book.id} className="col-lg-3 col-md-4 col-sm-6">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 bg-light rounded-4">
              <i className="bi bi-book text-muted" style={{ fontSize: '3rem' }}></i>
              <h5 className="fw-bold mt-2">No listings yet</h5>
              <p className="text-muted small">Be the first student to post a used book for sale!</p>
              <Link to="/sell" className="btn btn-bookbazar btn-sm">
                Sell a Book
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. HOW IT WORKS (Explaining the Rs. 100 Contact Fee & Peer-to-Peer Model) */}
      <section className="py-5">
        <div className="container">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-secondary mb-2">Transparent Business Model</span>
            <h3 className="fw-bold text-dark">How BookBazar Works</h3>
            <p className="text-muted">
              We connect students directly. The platform does not stock books or take a cut of the book price.
            </p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="card h-100 p-4 border rounded-4 bg-white shadow-sm">
                <div
                  className="rounded-circle bg-light text-bookbazar mx-auto d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}
                >
                  <i className="bi bi-tag-fill"></i>
                </div>
                <h5 className="fw-bold text-dark">1. List for Free</h5>
                <p className="text-secondary small mb-0">
                  Sellers post their books with photos, condition, board, and asking price. Barcode scanner auto-fills book details in seconds.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 border rounded-4 bg-white shadow-sm position-relative">
                <span className="position-absolute top-0 end-0 m-3 badge bg-bookbazar text-white">
                  Rs. 100 Fee
                </span>
                <div
                  className="rounded-circle bg-light text-primary mx-auto d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}
                >
                  <i className="bi bi-shield-lock-fill"></i>
                </div>
                <h5 className="fw-bold text-dark">2. Unlock Contact</h5>
                <p className="text-secondary small mb-0">
                  To protect seller privacy from spam, buyers pay a small platform fee of Rs. 100 via JazzCash/Easypaisa to unlock verified phone & WhatsApp details.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 border rounded-4 bg-white shadow-sm">
                <div
                  className="rounded-circle bg-light text-success mx-auto d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}
                >
                  <i className="bi bi-people-fill"></i>
                </div>
                <h5 className="fw-bold text-dark">3. Direct Student Deal</h5>
                <p className="text-secondary small mb-0">
                  Buyer and seller connect directly via WhatsApp/Call. Meet on campus or ship. Zero commission taken from the book price!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM ADSENSE PLACEHOLDER */}
      <div className="container">
        <AdSensePlaceholder
          slotId="home-bottom-banner"
          format="banner"
          className="my-4"
        />
      </div>
    </div>
  );
};

export default HomePage;
