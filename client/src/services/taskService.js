// services/taskService.js
import axios from 'axios';
import authService from './authService'; // Import authService to get the token

const API_BASE_URL = 'http://localhost:5000/api/tasks';

const taskService = {
  async getTasks() {
    try {
      const token = authService.getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(API_BASE_URL, { headers });
      console.log('API Response (getTasks):', response.data); // Debugging
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized access.');
        // Handle unauthorized error, maybe redirect to login using navigate from a component
        throw error;
      }
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  async addTask(taskData) {
    try {
      const token = authService.getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post(API_BASE_URL, taskData, { headers });
      console.log('API Response (addTask):', response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  async getTaskById(id) {
    try {
      const token = authService.getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_BASE_URL}/${id}`, { headers });
      console.log('API Response (getTaskById):', response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  async updateTask(id, taskData) {
    try {
      const token = authService.getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.put(`${API_BASE_URL}/${id}`, taskData, { headers });
      console.log('API Response (updateTask):', response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteTask(id) {
    try {
      const token = authService.getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.delete(`${API_BASE_URL}/${id}`, { headers });
      console.log('API Response (deleteTask):', response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
      throw error;
    }
  },
};

export default taskService;