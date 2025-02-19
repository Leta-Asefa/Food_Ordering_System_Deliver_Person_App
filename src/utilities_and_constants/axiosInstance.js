// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', // Replace with your API base URL
  timeout: 5000, // Optional timeout in milliseconds
  headers: { 'Content-Type': 'application/json' },
});

export default api;
