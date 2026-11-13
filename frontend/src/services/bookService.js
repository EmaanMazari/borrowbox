import api from './api';

export const bookService = {
  // Public listing retrieval with filters
  getBooks: async (params = {}) => {
    const res = await api.get('/books/', { params });
    return res.data;
  },

  // Detailed view of a single book with locked/unlocked contact section
  getBookDetail: async (id) => {
    const res = await api.get(`/books/${id}/`);
    return res.data;
  },

  // Create a new book listing (multipart form with image)
  createBook: async (formData) => {
    const res = await api.post('/books/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Update an existing listing
  updateBook: async (id, formData) => {
    const res = await api.patch(`/books/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Delete a listing
  deleteBook: async (id) => {
    const res = await api.delete(`/books/${id}/`);
    return res.data;
  },

  // Seller Dashboard: my listings
  getMySellerListings: async (status = '') => {
    const params = status ? { status } : {};
    const res = await api.get('/books/seller/my-listings/', { params });
    return res.data;
  },

  // Quick toggle status: ACTIVE, PAUSED, SOLD
  toggleListingStatus: async (id, status) => {
    const res = await api.patch(`/books/${id}/status/`, { status });
    return res.data;
  },

  // ISBN / Barcode scanning lookup
  lookupIsbn: async (isbn) => {
    const res = await api.get('/books/isbn-lookup/', { params: { isbn } });
    return res.data;
  },

  // Cover image recognition hook
  recognizeCover: async (formData) => {
    const res = await api.post('/books/recognize-cover/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Metadata dropdown choices (classes, boards, conditions, cities)
  getMetadataChoices: async () => {
    const res = await api.get('/books/metadata-choices/');
    return res.data;
  },
};
