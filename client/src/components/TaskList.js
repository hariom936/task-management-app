import React, { useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      console.log('Data received from taskService:', data); // Debugging
      setTasks(data);
      console.log('Tasks state after setting:', tasks); // Debugging
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
    }
  }, [taskService, setTasks]); // Added setTasks as a dependency

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

  if (tasks.length === 0 && !isAdding) {
    return (
      <div className="jumbotron">
        <p className="lead">No Tasks Available.</p>
        <button className="btn btn-primary btn-lg" onClick={handleAddTask}>Add New Task</button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>Task List</h1>
      <button className="btn btn-success mb-3" onClick={handleAddTask} disabled={isAdding || editingTask}>
        Add New Task
      </button>

      {isAdding && <div className="mt-3"><TaskForm onSave={handleSaveTask} onCancel={handleCloseForm} /></div>}

      {editingTask && (
        <div className="mt-3"><TaskForm
          initialTask={editingTask}
          onSave={handleSaveTask}
          onCancel={handleCloseForm}
        /></div>
      )}

      {tasks.length > 0 && (
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
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</td>
                <td>{task.status}</td>
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