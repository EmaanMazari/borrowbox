import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import IsbnScannerModal from '../components/common/IsbnScannerModal';

const SellBookPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [metadata, setMetadata] = useState({ classes: [], boards: [], conditions: [], cities: [] });
  const [showScanner, setShowScanner] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [classGrade, setClassGrade] = useState('fsc_1');
  const [board, setBoard] = useState('punjab_board');
  const [subject, setSubject] = useState('');
  const [edition, setEdition] = useState('Latest Edition');
  const [condition, setCondition] = useState('good');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState(user?.city || 'lahore');
  const [areaLocation, setAreaLocation] = useState(user?.address_area || '');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

  // AI image recognition feedback
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/sell');
      return;
    }

    const loadMeta = async () => {
      try {
        const meta = await bookService.getMetadataChoices();
        setMetadata(meta);
      } catch (err) {
        console.warn('Failed to load metadata choices:', err);
      }
    };
    loadMeta();

    if (editId) {
      const loadExisting = async () => {
        try {
          const b = await bookService.getBookDetail(editId);
          setTitle(b.title);
          setAuthor(b.author);
          setIsbn(b.isbn || '');
          setClassGrade(b.class_grade);
          setBoard(b.board);
          setSubject(b.subject);
          setEdition(b.edition || '');
          setCondition(b.condition);
          setPrice(b.price);
          setOriginalPrice(b.original_price || '');
          setDescription(b.description);
          setCity(b.city);
          setAreaLocation(b.area_location || '');
          if (b.cover_image) {
            setCoverImagePreview(b.cover_image.startsWith('http') ? b.cover_image : `http://127.0.0.1:8000${b.cover_image}`);
          }
        } catch (err) {
          setError('Failed to load listing for editing.');
        }
      };
      loadExisting();
    }
  }, [isAuthenticated, editId]);

  const handleBookFoundFromScan = (scannedData) => {
    if (scannedData.title) setTitle(scannedData.title);
    if (scannedData.author) setAuthor(scannedData.author);
    if (scannedData.isbn) setIsbn(scannedData.isbn);
    if (scannedData.publish_date) setEdition(`${scannedData.publish_date} Edition`);
    if (scannedData.description) setDescription(scannedData.description);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
      setAiAnalysis(null);
    }
  };

  const handleRunAiRecognition = async () => {
    if (!coverImageFile) {
      setError('Please choose a cover image file first.');
      return;
    }
    setAnalyzingImage(true);
    setError('');
    const fd = new FormData();
    fd.append('cover_image', coverImageFile);

    try {
      const res = await bookService.recognizeCover(fd);
      setAiAnalysis(res);
      // If AI suggested condition
      if (res.suggested_fields?.condition_hint) {
        setCondition(res.suggested_fields.condition_hint);
      }
    } catch (err) {
      setError('Image recognition analysis failed. You can still fill the fields manually.');
    } finally {
      setAnalyzingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !price || !description.trim()) {
      setError('Please fill in all required fields (Title, Author, Price, Description).');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('author', author.trim());
    formData.append('isbn', isbn.trim());
    formData.append('class_grade', classGrade);
    formData.append('board', board);
    formData.append('subject', subject.trim() || 'General');
    formData.append('edition', edition.trim());
    formData.append('condition', condition);
    formData.append('price', price);
    if (originalPrice) formData.append('original_price', originalPrice);
    formData.append('description', description.trim());
    formData.append('city', city);
    formData.append('area_location', areaLocation.trim());

    if (coverImageFile) {
      formData.append('cover_image', coverImageFile);
    }

    try {
      if (editId) {
        await bookService.updateBook(editId, formData);
      } else {
        await bookService.createBook(formData);
      }
      navigate('/seller-dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save book listing. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="max-w-800 mx-auto" style={{ maxWidth: '820px' }}>
        {/* Top Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <div>
            <h3 className="fw-bold text-dark mb-1">
              {editId ? 'Edit Book Listing' : 'Post a Used Book for Sale'}
            </h3>
            <p className="text-muted small mb-0">
              List your textbook for Pakistani students. Zero commission on book sales.
            </p>
          </div>

          {/* Quick ISBN Scanner button */}
          <button
            type="button"
            className="btn btn-outline-bookbazar d-flex align-items-center gap-2 shadow-sm"
            onClick={() => setShowScanner(true)}
          >
            <i className="bi bi-upc-scan fs-5"></i>
            <span>Scan Barcode / ISBN</span>
          </button>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card border shadow-sm rounded-4 p-4 bg-white">
          {/* SECTION 1: COVER IMAGE & AI RECOGNITION */}
          <div className="mb-4 pb-4 border-bottom">
            <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
              <i className="bi bi-camera text-bookbazar"></i> Book Cover Image
            </h5>
            <p className="text-muted small mb-3">
              Upload a clear photo of the textbook cover. You can also test the AI cover recognition hook.
            </p>

            <div className="row g-3 align-items-center">
              <div className="col-sm-4 text-center">
                <div
                  className="border rounded-3 bg-light d-flex align-items-center justify-content-center overflow-hidden position-relative mx-auto"
                  style={{ width: '160px', height: '210px' }}
                >
                  {coverImagePreview ? (
                    <img src={coverImagePreview} alt="Cover Preview" className="w-100 h-100 object-fit-cover" />
                  ) : (
                    <div className="text-muted small p-2">
                      <i className="bi bi-image fs-1 d-block text-secondary"></i>
                      Photo Preview
                    </div>
                  )}
                </div>
              </div>

              <div className="col-sm-8">
                <label className="form-label small fw-bold text-dark">Select Book Cover File</label>
                <input
                  type="file"
                  className="form-control mb-2"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="form-text small text-muted mb-3">
                  Formats: JPG, PNG, WEBP. Maximum file size: 5MB.
                </div>

                {/* AI Recognition Action Button */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                  onClick={handleRunAiRecognition}
                  disabled={!coverImageFile || analyzingImage}
                >
                  {analyzingImage ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Analyzing Cover...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-robot"></i> Run AI Cover Recognition Hook
                    </>
                  )}
                </button>

                {aiAnalysis && (
                  <div className="alert alert-success py-2 mt-2 small">
                    <i className="bi bi-check-circle-fill me-1"></i>
                    <strong>AI Analysis Hook:</strong> {aiAnalysis.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: BASIC DETAILS */}
          <div className="mb-4 pb-4 border-bottom">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-card-text text-bookbazar"></i> Book Information
            </h5>

            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label small fw-bold">Book Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Physics Part 1 or Biology for Class 9"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">ISBN / Barcode</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 9789694461234"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Author / Publication <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Punjab Textbook Board, Dr. Hamid Malik, Stewart"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-bold">Subject <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Physics, Chemistry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-bold">Edition</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 2024 Edition"
                  value={edition}
                  onChange={(e) => setEdition(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: CURRICULUM & CONDITION */}
          <div className="mb-4 pb-4 border-bottom">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-mortarboard text-bookbazar"></i> Class, Board & Condition
            </h5>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-bold">Class / Education Level</label>
                <select
                  className="form-select"
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                >
                  {metadata.classes.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">Education Board</label>
                <select
                  className="form-select"
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                >
                  {metadata.boards.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-bold">Book Condition</label>
                <select
                  className="form-select"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  {metadata.conditions.map((cd) => (
                    <option key={cd.value} value={cd.value}>{cd.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: PRICING & LOCATION */}
          <div className="mb-4 pb-4 border-bottom">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-cash-stack text-bookbazar"></i> Pricing & Campus Location
            </h5>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Asking Price (PKR) <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text">Rs.</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 450"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-text small">Your asking price for the buyer. 100% goes to you.</div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Original Retail Price (PKR)</label>
                <div className="input-group">
                  <span className="input-group-text">Rs.</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 850 (Optional)"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                  />
                </div>
                <div className="form-text small">Shows students how much they save compared to buying new.</div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">City</label>
                <select
                  className="form-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  {metadata.cities.map((ct) => (
                    <option key={ct.value} value={ct.value}>{ct.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Campus / Meetup Area</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. PU New Campus, NUST Gate 2, Gulberg III"
                  value={areaLocation}
                  onChange={(e) => setAreaLocation(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: NOTES & DESCRIPTION */}
          <div className="mb-4">
            <h5 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-card-text text-bookbazar"></i> Description & Student Notes
            </h5>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Mention details about handwritten notes, highlights, intact binding, missing pages or exercises solved..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-light"
              onClick={() => navigate('/seller-dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-bookbazar px-4 py-2 fw-bold shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving Listing...
                </>
              ) : (
                <>{editId ? 'Update Listing' : 'Publish Book Listing'}</>
              )}
            </button>
          </div>
        </form>

        {/* ISBN Scanner Modal */}
        <IsbnScannerModal
          show={showScanner}
          onClose={() => setShowScanner(false)}
          onBookFound={handleBookFoundFromScan}
        />
      </div>
    </div>
  );
};

export default SellBookPage;
