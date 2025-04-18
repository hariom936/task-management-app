// taskRoutes.js
import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} from '../controllers/taskController.js'; // Adjust the path as needed

const router = express.Router();

router.post('/tasks', createTask);
router.get('/tasks', getAllTasks);
router.get('/tasks/:id', getTaskById);
router.put('/tasks/:id', updateTaskById);
router.delete('/tasks/:id', deleteTaskById);

export default router;