import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/database/db.js';
import authRoutes from './src/route/auth.route.js';
import addressRoutes from './src/route/address.route.js';
import siteRoutes from "./src/route/site.route.js";
import jobRoutes from "./src/route/job.route.js";
import leaveRoutes from "./src/route/leave.route.js";

// Load environment variables from .env file
dotenv.config();
console.log(process.env.JWT_SECRET)


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/address', addressRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/leaves", leaveRoutes);




// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});