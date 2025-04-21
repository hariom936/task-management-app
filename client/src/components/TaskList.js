// components/TaskList.js
import React, { useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';
import TaskForm from './TaskForm';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import authService from '../services/authService'; // Import authService

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  // State for controlling the "Add New Task" form
  const [isAdding, setIsAdding] = useState(false);

  // State for managing the task being edited
  const [editingTask, setEditingTask] = useState(null);

  // State for controlling the delete confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  // State for controlling which filter options are visible
  const [filterType, setFilterType] = useState('');

  // State for filtering
  const [filterStatus, setFilterStatus] = useState('all');

  // State for sorting
  const [sortOption, setSortOption] = useState('newest');

  // State for search
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.error('Unauthorized access. Redirecting to login.');
        navigate('/login'); // Redirect to login on 401
      } else {
        setError('Failed to load tasks. Please try again.');
        console.error('Fetch tasks error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [taskService, navigate, setTasks]);

  useEffect(() => {
    // Check for token on component mount
    if (!authService.getToken()) {
      navigate('/login');
      return; // Prevent further execution if not logged in
    }
    fetchTasks();
  }, [fetchTasks, navigate]); // Add navigate as a dependency

  // Filtered tasks based on selected status
  const filteredTasks = React.useMemo(() => {
    if (filterType === 'status' && filterStatus !== 'all') {
      return tasks.filter(task => task.status.toLowerCase() === filterStatus);
    }
    return tasks;
  }, [tasks, filterType, filterStatus]);

  // Sorted tasks based on selected option
  const sortedTasks = React.useMemo(() => {
    let sorted = [...filteredTasks];
    if (filterType === 'sort') {
      switch (sortOption) {
        case 'oldest':
          sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'dueDate':
          sorted.sort((a, b) => {
            const dateA = a.dueDate ? new Date(a.dueDate) : Infinity;
            const dateB = b.dueDate ? new Date(b.dueDate) : Infinity;
            return dateA - dateB;
          });
          break;
        default: // newest
          sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }
    return sorted;
  }, [filteredTasks, filterType, sortOption]);

  // Searched tasks based on the search term
  const searchedTasks = React.useMemo(() => {
    if (filterType === 'search' && searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return sortedTasks.filter(task =>
        task.title.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    return sortedTasks;
  }, [sortedTasks, filterType, searchTerm]);

  const handleAddTask = () => {
    setIsAdding(true);
  };

  const handleEditTask = async (id) => {
    try {
      const task = await taskService.getTaskById(id);
      setEditingTask(task);
    } catch (err) {
      console.error('Error fetching task for edit:', err);
      setError('Failed to fetch task details for editing.');
    }
  };

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      try {
        const updatedTask = await taskService.updateTask(editingTask._id, taskData);
        setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
        setEditingTask(null);
        alert('Task updated successfully!');
      } catch (err) {
        console.error('Error updating task:', err);
        setError('Failed to update task.');
      }
    } else {
      try {
        const newTask = await taskService.addTask(taskData);
        setTasks([...tasks, newTask]);
        setIsAdding(false);
        alert('Task added successfully!');
      } catch (err) {
        console.error('Error adding task:', err);
        setError('Failed to add task.');
      }
    }
  };

  const handleDeleteTask = (id) => {
    setTaskToDeleteId(id);
    setShowConfirmation(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDeleteId) {
      try {
        await taskService.deleteTask(taskToDeleteId);
        setTasks(tasks.filter((task) => task._id !== taskToDeleteId));
        setShowConfirmation(false);
        setTaskToDeleteId(null);
        alert('Task deleted successfully!');
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task.');
      }
    }
  };

  const cancelDeleteTask = () => {
    setShowConfirmation(false);
    setTaskToDeleteId(null);
  };

  const handleCloseForm = () => {
    setIsAdding(false);
    setEditingTask(null);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    // Reset specific filter/sort/search states when the type changes
    setFilterStatus('all');
    setSortOption('newest');
    setSearchTerm('');
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const taskToUpdate = tasks.find(task => task._id === id);
    if (taskToUpdate) {
      try {
        const updatedTask = await taskService.updateTask(id, { ...taskToUpdate, status: newStatus });
        setTasks(tasks.map(task => (task._id === updatedTask._id ? updatedTask : task)));
        // Provide visual feedback (e.g., a small message or change in UI)
      } catch (err) {
        console.error('Error updating task status:', err);
        setError('Failed to update task status.');
      }
    }
  };

  console.log('Tasks state before render:', tasks); // Debugging

  if (loading) {
    return <div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
        <button className="btn btn-outline-danger ml-2" onClick={fetchTasks}>Retry</button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>Task List</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-success" onClick={handleAddTask} disabled={isAdding || editingTask}>
          Add New Task
        </button>
        <div>
          <select className="form-control form-control-sm d-inline-block mr-2" value={filterType} onChange={handleFilterTypeChange}>
            <option value="">Filter & Sort</option>
            <option value="status">Filter by Status</option>
            <option value="sort">Sort By</option>
            <option value="search">Search - (only for Title)</option>
          </select>
          {filterType === 'status' && (
            <select className="form-control form-control-sm d-inline-block mr-2" value={filterStatus} onChange={handleFilterStatusChange}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          )}
          {filterType === 'sort' && (
            <select className="form-control form-control-sm d-inline-block mr-2" value={sortOption} onChange={handleSortChange}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="dueDate">Due Date</option>
            </select>
          )}
          {filterType === 'search' && (
            <input
              type="text"
              className="form-control form-control-sm d-inline-block"
              placeholder="Search by title"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          )}
        </div>
      </div>

      {isAdding && <div className="mt-3"><TaskForm onSave={handleSaveTask} onCancel={handleCloseForm} /></div>}

      {editingTask && (
        <div className="mt-3"><TaskForm
          initialTask={editingTask}
          onSave={handleSaveTask}
          onCancel={handleCloseForm}
        /></div>
      )}

      {searchedTasks.length === 0 && !isAdding && !editingTask ? (
        <p>No Results Found</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchedTasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</td>
                <td>
                  <select
                    className="form-control form-control-sm"
                    value={task.status}
                    onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-sm btn-info mr-2" onClick={() => handleEditTask(task._id)} disabled={isAdding || editingTask}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTask(task._id)} disabled={isAdding || editingTask}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showConfirmation && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="close" onClick={cancelDeleteTask} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this task?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDeleteTask}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={confirmDeleteTask}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;