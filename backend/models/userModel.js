import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
    },
    passwordResetToken: {
        type: String,
    },
    images: [{
        type: String,
        default: [],
    }]
}, { timestamps: true });

const User = mongoose.model("user", userSchema);

export { User };
