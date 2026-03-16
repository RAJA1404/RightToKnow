import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: false,
});

// Skip auth header for login and register endpoints
const PUBLIC_URLS = ['/auth/login/', '/auth/register/'];

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