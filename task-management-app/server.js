import mongoose from 'mongoose';
import dbConfig from './config/db.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use the task routes (assuming you want them under /api)
app.use('/api', taskRoutes);

// Use the user/auth routes under /api/auth
app.use('/api/auth', userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

async function start() {
  try {
    await mongoose.connect(dbConfig.primary.url, dbConfig.primary.options);
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1);
  }
}
start();