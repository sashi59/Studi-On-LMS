import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import cors from 'cors';
import fs from 'fs';

// Routes
import userRoute from './routes/user.route.js';
import courseRoute from './routes/course.route.js';
import adminRoute from './routes/admin.route.js';

const app = express();
dotenv.config();

// Define __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("'uploads' directory created successfully");
}

// MongoDB Connection
const CLIENT_URL = "https://studi-on-lms.onrender.com" || 'http://localhost:3000';
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB Connected');
});

// CORS Middleware
app.use(
    cors({
        origin: [CLIENT_URL],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    })
);

// Razorpay Instance
export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/user', userRoute);
app.use('/api/course', courseRoute);
app.use('/api/admin', adminRoute);

// Serve Static Files in Production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
    });
}

app.listen(port, () => {
    console.log(`Server is listening on port: ${port} & Mode = ${process.env.NODE_ENV}`);
});
