import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import globalErrorHandler from './helpers/globalErrorHandler.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from "path";

dotenv.config();

const __dirname = path.resolve();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));

connectDB();

app.use(express.json()); // for parsing application/json

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/image', imageRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));


app.get('/', (req, res) => {
    console.log("Home Page");
    // console.log(__dirname);
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
    console.error(err, err);
    console.error("Unhandled rejection occured! Shutting down...");
    server.close(() => {
        process.exit(1);
    });
});