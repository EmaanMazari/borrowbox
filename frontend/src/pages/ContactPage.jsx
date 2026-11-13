import React, { useState } from 'react';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container py-4">
      <div className="max-w-800 mx-auto" style={{ maxWidth: '820px' }}>
        <div className="text-center py-4 mb-4">
          <span className="badge bg-secondary mb-2">Student Support</span>
          <h2 className="display-6 fw-bold text-dark mb-2">We're Here to Help</h2>
          <p className="lead text-secondary">
            Have questions about contact unlocking, JazzCash payments, or listing a textbook?
          </p>
        </div>

        <div className="row g-4 mb-5">
          {/* Support Channels */}
          <div className="col-md-4">
            <div className="card h-100 p-4 border rounded-4 text-center bg-white shadow-sm">
              <i className="bi bi-envelope-at text-bookbazar fs-1 mb-2"></i>
              <h6 className="fw-bold text-dark">Email Support</h6>
              <p className="small text-muted mb-2">Queries & Verification</p>
              <a href="mailto:support@bookbazar.pk" className="small fw-bold text-bookbazar text-decoration-none">
                support@bookbazar.pk
              </a>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 p-4 border rounded-4 text-center bg-white shadow-sm">
              <i className="bi bi-whatsapp text-success fs-1 mb-2"></i>
              <h6 className="fw-bold text-dark">WhatsApp Helpline</h6>
              <p className="small text-muted mb-2">Mon - Sat (9am - 7pm PKT)</p>
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="small fw-bold text-success text-decoration-none">
                +92 (300) 1234567
              </a>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 p-4 border rounded-4 text-center bg-white shadow-sm">
              <i className="bi bi-geo-alt text-primary fs-1 mb-2"></i>
              <h6 className="fw-bold text-dark">Official Office</h6>
              <p className="small text-muted mb-0">
                Blue Area, Sector F-6<br />Islamabad, Pakistan
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card border shadow-sm rounded-4 p-4 p-md-5 bg-white mb-5">
          <h4 className="fw-bold text-dark mb-3">Send Us a Message</h4>
          {submitted ? (
            <div className="alert alert-success py-3 text-center">
              <i className="bi bi-check-circle-fill fs-3 mb-2 d-block"></i>
              <h5 className="fw-bold">Message Received</h5>
              <p className="small mb-0">Our student support team will get back to you via email within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Payment verification status or book query"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Message</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Describe your inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
              <button type="submit" className="btn btn-bookbazar px-4 py-2 fw-bold mt-4">
                Submit Inquiry
              </button>
            </form>
          )}
        </div>

        {/* FAQ Accordion */}
        <div className="card border shadow-sm rounded-4 p-4 bg-white">
          <h5 className="fw-bold text-dark mb-3">Frequently Asked Questions</h5>
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="faq1">
                <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1">
                  Why does BookBazar charge a Rs. 100 contact-access fee?
                </button>
              </h2>
              <div id="collapse1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body small text-secondary">
                  The Rs. 100 fee protects student sellers from spam calls, automated web-scraping, and unserious time-wasters. It ensures that only genuine interested buyers receive direct phone numbers and WhatsApp access.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faq2">
                <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
                  Does BookBazar deliver the book to my home?
                </button>
              </h2>
              <div id="collapse2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body small text-secondary">
                  No. BookBazar is a direct peer-to-peer marketplace. Once you unlock the seller's contact details, you and the seller arrange to meet in a public campus area or send the book via local courier (TCS, Leopard, Post Office).
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faq3">
                <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3">
                  How long does payment verification take?
                </button>
              </h2>
              <div id="collapse3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body small text-secondary">
                  Once you submit your 10-12 digit JazzCash or Easypaisa Transaction ID (TID), our team verifies the payment statement. Verification typically takes a few minutes during active daytime hours.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
