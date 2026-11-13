import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { bookService } from '../../services/bookService';

const IsbnScannerModal = ({ show, onClose, onBookFound }) => {
  const [isbnInput, setIsbnInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleManualSearch = async (isbnToSearch) => {
    const target = (isbnToSearch || isbnInput).trim();
    if (!target) {
      setError('Please enter a valid ISBN or barcode number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await bookService.lookupIsbn(target);
      if (res.found) {
        onBookFound(res);
        stopCamera();
        onClose();
      } else {
        setError(res.message || 'Book not found for this ISBN. You can still fill details manually.');
      }
    } catch (err) {
      setError('Failed to fetch ISBN information. Please check internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    setError('');
    setCameraActive(true);
    try {
      const html5QrCode = new Html5Qrcode('barcode-reader');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
        },
        (decodedText) => {
          setIsbnInput(decodedText);
          stopCamera();
          handleManualSearch(decodedText);
        },
        () => {
          // scanning frame callback
        }
      );
    } catch (err) {
      console.warn('Camera scanning error or permission denied:', err);
      setError('Camera access denied or unavailable. Please type the ISBN digits manually below.');
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.warn('Error stopping camera:', err);
      }
    }
    setCameraActive(false);
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <i className="bi bi-upc-scan text-bookbazar"></i> Scan Book Barcode / ISBN
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                stopCamera();
                onClose();
              }}
            ></button>
          </div>

          <div className="modal-body p-4">
            <p className="text-muted small">
              Scan the barcode on the back cover of your textbook, or type the 10/13 digit ISBN number to automatically retrieve the title, author, edition, and details.
            </p>

            {/* Camera Viewfinder */}
            <div
              id="barcode-reader"
              className="mb-3 rounded overflow-hidden bg-dark text-white text-center"
              style={{ minHeight: cameraActive ? '260px' : '0px' }}
            ></div>

            {!cameraActive ? (
              <button
                type="button"
                className="btn btn-outline-bookbazar w-100 py-2 mb-3 d-flex align-items-center justify-content-center gap-2"
                onClick={startCamera}
              >
                <i className="bi bi-camera"></i> Open Camera Barcode Scanner
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-outline-danger w-100 py-2 mb-3 d-flex align-items-center justify-content-center gap-2"
                onClick={stopCamera}
              >
                <i className="bi bi-camera-video-off"></i> Stop Camera
              </button>
            )}

            <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1" />
              <span className="px-2 text-muted small fw-semibold">OR ENTER ISBN MANUALLY</span>
              <hr className="flex-grow-1" />
            </div>

            {/* Manual ISBN Input */}
            <div className="input-group mb-3">
              <span className="input-group-text bg-white">
                <i className="bi bi-barcode"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 9789694461234 or 9781285741550"
                value={isbnInput}
                onChange={(e) => setIsbnInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
              />
              <button
                className="btn btn-bookbazar px-3"
                type="button"
                onClick={() => handleManualSearch()}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  'Lookup'
                )}
              </button>
            </div>

            {/* Quick Pakistan Test ISBNs helper for easy demo testing */}
            <div className="bg-light p-2 rounded small text-muted">
              <span className="fw-semibold text-dark">Try Quick Sample ISBNs:</span>
              <div className="d-flex flex-wrap gap-2 mt-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary py-0 px-2"
                  onClick={() => {
                    setIsbnInput('9781285741550');
                    handleManualSearch('9781285741550');
                  }}
                >
                  Stewart Calculus (9781285741550)
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary py-0 px-2"
                  onClick={() => {
                    setIsbnInput('9781444112832');
                    handleManualSearch('9781444112832');
                  }}
                >
                  A-Level Chemistry (9781444112832)
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-warning py-2 mt-3 small d-flex align-items-center gap-2 mb-0">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>{error}</div>
              </div>
            )}
          </div>

          <div className="modal-footer bg-light">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                stopCamera();
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsbnScannerModal;
