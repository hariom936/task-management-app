// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Replace with your actual backend API URL

const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const getToken = () => {
  return localStorage.getItem('token');
};

const logoutUser = () => {
  localStorage.removeItem('token');
};

const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

setAuthHeader(getToken());

const authService = {
  registerUser,
  loginUser,
  getToken,
  logoutUser,
  setAuthHeader,
};

export default authService;