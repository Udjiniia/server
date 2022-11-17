import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        group: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        variant: {
            type: String,
            required: true
        },
        avatarUrl: String,
    },
    {
        timestamps: true,
    });

export default mongoose.model("User", UserSchema);