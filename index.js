import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import roleRoute from './routes/role.js';
import authRoute from './routes/auth.js';
import userRoute from "./routes/user.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api/role", roleRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

// Generic Response Handler middleware
app.use((obj, req, res, next) => {
    const statusCode = obj.status || 500;
    const message = obj.message || "Something went wrong!";
    return res.status(statusCode).json({
        success: [200,201,204].some(a=> a=== obj.status) ? true : false,
        status: statusCode,
        message: message,
        data: obj.data,
        stack: obj.stack
    });
});

// Database Connection
const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to Database!");
    } catch (error) {
        throw error;
    }
}

// node listener connection
app.listen(8800, ()=> {
    connectMongoDB();
    console.log("Connected to backend!");
})