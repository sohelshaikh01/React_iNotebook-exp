import mongoose from "mongoose";

const NotesSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require: true
    },
    tag: {
        type: String,
        default: 'General'
    },
    date: {
        type: String,
        default: Date.now
    }
});

const notes = mongoose.model("notes", NotesSchema)
export default notes;