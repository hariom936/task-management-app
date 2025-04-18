import mongoose from "mongoose";
import dbConfig from "./config/db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

async function startServer() {
    try {
        await mongoose.connect(dbConfig.primary.url, dbConfig.primary.options);
        console.log("✅ DB Connected");

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to connect to the database:", error.message);
        process.exit(1); // Exit the app if DB connection fails
    }
}

startServer();
