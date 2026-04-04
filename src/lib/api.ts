import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add token to every request
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Review API calls
export const getReviews = (productId: string | number) => api.get(`/products/${productId}/reviews`);
export const postReview = (productId: string | number, data: { rating: number; comment: string }) => 
  api.post(`/products/${productId}/reviews`, data);
