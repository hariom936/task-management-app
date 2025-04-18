// taskController.js
import Task from '../models/Task.js';

// Controller function to create a new task
export const createTask = async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask); // Respond with the created task and a 201 status code
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message }); // Respond with an error message and a 500 status code
  }
};

// Controller function to get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks); // Respond with the list of tasks and a 200 status code
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Controller function to get a single task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' }); // Respond with a 404 if the task doesn't exist
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

// Controller function to update a task by ID
export const updateTaskById = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask); // Respond with the updated task
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error: error.message }); // Use 400 for validation errors
  }
};

// Controller function to delete a task by ID
export const deleteTaskById = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).send(); // Respond with a 204 No Content status for successful deletion
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};