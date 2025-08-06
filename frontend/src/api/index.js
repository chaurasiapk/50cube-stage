// api.js

import axios from "axios";

/**
 * Base URL for all API requests
 * Uses environment variable fallback to localhost for development
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Axios instance with default configuration
 */
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to attach auth token to headers (if available)
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===================== USER API =====================

/**
 * Fetches the user profile based on email
 * 
 * @param {string} email - User's email address
 * 
 * NOTE: In a real-world application, this endpoint should be protected.
 * The server should authenticate the request using a token (e.g. JWT)
 * and extract the user identity from the token instead of relying on
 * query parameters like email to prevent spoofing.
 */
export const getUserProfile = (email) =>
  api.get(`/user/profile?email=${email ?? ""}`);

// ================= MERCH STORE API ==================

/**
 * Fetches the merchandise catalog
 */
export const getMerchCatalog = () => api.get("/merch/catalog");

/**
 * Submits request to get a quote for merchandise
 * @param {Object} data - Quote request payload
 */
export const getMerchQuote = (data) => api.post("/merch/quote", data);

/**
 * Redeems merchandise using provided data
 * @param {Object} data - Redemption payload
 */
export const redeemMerch = (data) => api.post("/merch/redeem", data);

// ================ ADMIN METRICS API =================

/**
 * Fetches admin metrics since a given timestamp
 * @param {string} since - ISO timestamp or date string
 */
export const getAdminMetrics = (since) =>
  api.get(`/admin/metrics?since=${since}`);

// ================= LANE CONSOLE API =================

/**
 * Fetches the impact data of lanes
 */
export const getLanesImpact = () => api.get("/admin/lanes/impact");

/**
 * Updates the state of a lane
 * @param {string} id - Lane ID
 * @param {string} state - New lane state
 */
export const updateLaneState = (id, state) =>
  api.post(`/admin/lanes/${id}/state`, { state });

// Export the axios instance for direct use if needed
export default api;
