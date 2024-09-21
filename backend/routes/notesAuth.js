import express from 'express';
const router = express.Router();
import Note from '../models/Notes.js';
import { body, validationResult } from 'express-validator';
import fetchUser from '../middleware/fetchUser.js';

// ROUTE 1: Get All note using GET: "api/notes/fetchallnotes". Login required.
router.get('/fetchallnotes', fetchUser, async (req, res) => {

    try {
        const notes = await Note.find({user: req.user.id});
        res.send(notes);
    }

    catch(error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 2: Adding New Note using POST: "api/notes/addnote". Login required.
router.post("/addnote", fetchUser, [
    body("title", "Enter a valid title").isLength({min : 3}),
    body("description"," Description must be at least 5 characters").isLength({min: 5})
], async (req, res) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty) {
            return res.status(400).json({errors: errors.array() });
        }

        const { title, description, tag} = req.body;

        const note = new Note({
            title,
            description,
            tag,
            user: req.user.id
        });

        const savedNote =  await note.save();
        res.json(savedNote);

    }
    
    catch(error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});

//ROUTE 3: Update an existing note using PUT "api/notes/updatenote". Login required.
router.put("/updatenote/:id", fetchUser, async (req, res) => {

    try {
        const {title, description, tag} = req.body;

        const newNote = {};
        if(title) { newNote.title = title}
        if(description) { newNote.description = description}
        if(tag) {newNote.tag = tag}

        let note = await Note.findById(req.params.id);
        
        if(!note) { return res.status(404).send("Not found"); }

        if(note.user.toString() !== req.user.id) {
            res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.json({note});

    }

    catch(error) {
        console.error(error.message);
        res.send("Internal Server Error");
    }

});

// ROUTE 4: Delete an existing note using "api/notes/delete". Login required.
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
    
    try {
        let note = await Note.findById(req.params.id);

        if(!note) {
            res.status(404).send("Not Found");
        }

        if(note.user.toString() !== req.user.id) {
            res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({Success: "This note has been deleted", note: note});

    } 

    catch(error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});

export default router;