import mongoose from "mongoose";
import dbConfig from "./config/dbConfig.js";

async function start() {
await mongoose.connect(dbConfig.primary.url, dbConfig.primary.options);
console.log("DB Connected");

}
start();
