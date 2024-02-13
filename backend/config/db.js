import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to DB : ${mongoose.connection.host}`)
    } catch (error) {
        console.log(`MongoDB error: ${error}`);
    }
}

export default connectDB;