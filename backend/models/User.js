import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now
    }
});

const User = mongoose.model("user", UserSchema)
User.createIndexes();
export default User;