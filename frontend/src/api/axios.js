import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: false,
});

// Public endpoints for the Smart RTI flow.
const PUBLIC_URLS = [
  '/auth/login',
  '/auth/register',
  '/auth/request-otp',
  '/auth/verify-otp',
  '/rti/generate',
  '/rti/submit',
  '/departments',
  '/hods',
  '/districts',
  '/taluks',
  '/villages',
  '/categories',
  '/sample-questions',
];

API.interceptors.request.use((req) => {
  const isPublic = PUBLIC_URLS.some(url => req.url.includes(url));
  if (!isPublic) {
    const token = localStorage.getItem('access_token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});

export default API;
