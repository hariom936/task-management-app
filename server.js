// server.js
import mongoose from 'mongoose';
import dbConfig from './config/db.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js'; // Import your task routes

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use the task routes
app.use('/api', taskRoutes); // You can prefix your routes with '/api' or any other base path

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

async function start() {
  await mongoose.connect(dbConfig.primary.url, dbConfig.primary.options);
  console.log("DB Connected");
}
start();