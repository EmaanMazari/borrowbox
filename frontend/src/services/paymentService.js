import api from './api';

export const paymentService = {
  // Step 1: Initiate unlock request for Rs. 100 fee
  initiateUnlock: async (listingId, paymentMethod = 'jazzcash') => {
    const res = await api.post('/payments/unlock-request/', {
      listing_id: listingId,
      payment_method: paymentMethod,
    });
    return res.data;
  },

  // Step 2: Submit 10-12 digit TID and optional receipt screenshot
  submitPaymentProof: async (unlockId, formData) => {
    const res = await api.post(`/payments/unlock-request/${unlockId}/submit-proof/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Buyer: View all my contact unlock requests (with unlocked contact details if verified)
  getMyUnlocks: async () => {
    const res = await api.get('/payments/my-unlocks/');
    return res.data;
  },

  // Check if current user has unlocked a listing
  checkUnlockStatus: async (listingId) => {
    const res = await api.get(`/payments/status/${listingId}/`);
    return res.data;
  },
};
