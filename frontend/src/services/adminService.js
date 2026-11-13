import api from './api';

export const adminService = {
  // Platform metrics
  getStats: async () => {
    const res = await api.get('/admin-dashboard/stats/');
    return res.data;
  },

  // Payment requests queue
  getPayments: async (status = '') => {
    const params = status ? { status } : {};
    const res = await api.get('/admin-dashboard/payments/', { params });
    return res.data;
  },

  // 1-Click Verify / Reject payment
  verifyPayment: async (unlockId, action, adminNotes = '') => {
    const res = await api.post(`/admin-dashboard/payments/${unlockId}/verify/`, {
      action,
      admin_notes: adminNotes,
    });
    return res.data;
  },

  // Users management
  getUsers: async (search = '') => {
    const params = search ? { search } : {};
    const res = await api.get('/admin-dashboard/users/', { params });
    return res.data;
  },

  // Toggle user active / banned
  toggleUserStatus: async (userId) => {
    const res = await api.patch(`/admin-dashboard/users/${userId}/toggle-status/`);
    return res.data;
  },

  // Listings management
  getListings: async (status = '') => {
    const params = status ? { status } : {};
    const res = await api.get('/admin-dashboard/listings/', { params });
    return res.data;
  },

  // Moderation reports
  getReports: async (status = '') => {
    const params = status ? { status } : {};
    const res = await api.get('/reports/admin/list/', { params });
    return res.data;
  },

  updateReport: async (reportId, data) => {
    const res = await api.patch(`/reports/admin/${reportId}/`, data);
    return res.data;
  },

  // User submits a report
  submitReport: async (listingId, reason, details) => {
    const res = await api.post('/reports/submit/', {
      listing: listingId,
      reason,
      details,
    });
    return res.data;
  },
};
