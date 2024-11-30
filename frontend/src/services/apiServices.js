import axios from 'axios';

const API_URL_UNAUTHENTICATED = 'http://localhost:3000/api';
const API_URL_AUTHENTICATED = 'http://localhost:3000/api/authenticated';
const API_URL_ADMIN = 'http://localhost:3000/api/admin';

// Create axios instance
const api = axios.create({
  withCredentials: true,  
});

/** Unauthenticated APIs */
const unauthenticatedAPI = {
  signup: (data) => api.post(`${API_URL_UNAUTHENTICATED}/signup`, data),
  signupConfirmed: (email) => api.post(`${API_URL_UNAUTHENTICATED}/signupConfirmed`, { email }),
  login: (data) => api.post(`${API_URL_UNAUTHENTICATED}/login`, data),
  logout: () => api.post(`${API_URL_UNAUTHENTICATED}/logout`),
  googleLogin: () => api.get(`${API_URL_UNAUTHENTICATED}/google`),
  googleCallback: () => api.get(`${API_URL_UNAUTHENTICATED}/google/callback`),
  getQuoteList: (params) => api.get(`${API_URL_UNAUTHENTICATED}/getQuoteList`, { params }),
};


/** Authenticated APIs */
const authenticatedAPI = {
  getAccountDetails: () => api.get(`${API_URL_AUTHENTICATED}/getAccountDetails`),
  updateAccountRequest: (data) => api.post(`${API_URL_AUTHENTICATED}/updateAccountRequest`, data),
  handleQuoteFavorite: (data) => api.post(`${API_URL_AUTHENTICATED}/handleQuoteFavorite`, data),
  getFavoriteQuotes: () => api.get(`${API_URL_AUTHENTICATED}/getFavoriteQuotes`),
  changePasswordRequest: (data) => api.post(`${API_URL_AUTHENTICATED}/changePasswordRequest`, data),
  changePasswordVerifyToken: (token) => api.post(`${API_URL_AUTHENTICATED}/changePasswordVerifyToken`, { token }),
  changePasswordConfirmed: (data) => api.post(`${API_URL_AUTHENTICATED}/changePasswordConfirmed`, data),
  deleteSelfFromUser: () => api.delete(`${API_URL_AUTHENTICATED}/deleteSelfFromUser`),
  toggleEmailService: () => api.post(`${API_URL_AUTHENTICATED}/toggleEmailService`),
  emailServiceSignup: (data) => api.post(`${API_URL_AUTHENTICATED}/emailServiceSignup`, data),
  emailServiceSignupConfirmed: () => api.post(`${API_URL_AUTHENTICATED}/emailServiceSignupConfirmed`),
  emailUnsubscribe: () => api.delete(`${API_URL_AUTHENTICATED}/emailUnsubscribe`),
  getAllTagNames: () => api.get(`${API_URL_AUTHENTICATED}/getAllTagNames`),
};

/** Admin APIs */
const adminAPI = {
  getQuotes: (params) => api.get(`${API_URL_ADMIN}/quotes`, { params }),
  addQuote: (data) => api.post(`${API_URL_ADMIN}/addQuote`, data),
  updateQuote: (data) => api.put(`${API_URL_ADMIN}/updateQuote`, data),
  deleteQuote: (quoteNumberId) => api.delete(`${API_URL_ADMIN}/deleteQuote`, { data: { quoteNumberId } }),

  getQuoteSequences: (params) => api.get(`${API_URL_ADMIN}/quoteSequences`, { params }),
  createQuoteSequence: (data) => api.post(`${API_URL_ADMIN}/createQuoteSequence`, data),
  updateQuoteSequence: (data) => api.put(`${API_URL_ADMIN}/updateQuoteSequence`, data),
  deleteQuoteSequence: (_id) => api.delete(`${API_URL_ADMIN}/deleteQuoteSequence`, { data: { _id } }),

  getUsers: (params) => api.get(`${API_URL_ADMIN}/users`, { params }),
  addUser: (data) => api.post(`${API_URL_ADMIN}/addUser`, data),
  updateUser: (data) => api.put(`${API_URL_ADMIN}/updateUser`, data),
  userfavorites: (params) => api.get(`${API_URL_ADMIN}/userfavorites`, { params }),
  deletefavorite: (data) => api.delete(`${API_URL_ADMIN}/deletefavorite`, data),
  deleteUser: (_id) => api.delete(`${API_URL_ADMIN}/deleteUser`, { data: { _id } }),

  getTags: (params) => api.get(`${API_URL_ADMIN}/tags`, { params }),
  addTag: (data) => api.post(`${API_URL_ADMIN}/addTag`, data),
  updateTag: (data) => api.put(`${API_URL_ADMIN}/updateTag`, data),
  deleteTag: (_id) => api.delete(`${API_URL_ADMIN}/deleteTag`, { data: { _id } }),
};

// Export grouped APIs
export { unauthenticatedAPI, authenticatedAPI, adminAPI };
