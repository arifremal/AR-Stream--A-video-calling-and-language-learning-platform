import express from "express";
import "dotenv/config.js";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from 'cookie-parser'

const app = express();

const PORT = process.env.PORT;
app.use(express.json())
app.use(cookieParser())
app.get("/api/signup", (req, res) => {
  res.send("arif");
});
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`app running ${PORT}`);
  connectDB();
});
 