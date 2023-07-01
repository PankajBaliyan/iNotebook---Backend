const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all notes using: Get "/api/notes/fetchallnotes". Login Required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// ROUTE 2: Add notes using: Get "/api/notes/addnote". Login Required
router.post(
    '/addnote',
    fetchuser,
    [
        body('title', 'Enter a valid title').isLength({ min: 3 }),
        body(
            'description',
            'description must be at least five characters',
        ).isLength({ min: 5 }),
    ],
    async (req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            try {
                // Destructuring the req.body
                const { title, description, tag } = req.body;

                // Create a new note
                const note = new Notes({
                    title,
                    description,
                    tag,
                    user: req.user.id,
                });

                // Save note to database
                const savedNote = await note.save();

                res.json(savedNote);
            } catch (error) {
                console.error(error.message);
                res.status(500).send('Error while creating note');
            }
        } else {
            return res.send({ errors: result.array() });
        }
    },
);

// ROUTE 3: Update notes using: Get "/api/notes/updatenote". Login Required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        try {
            // Destructuring the req.body
            const { title, description, tag } = req.body;

            const newNote = {};
            if (title) {
                newNote.title = title;
            }
            if (description) {
                newNote.description = description;
            }
            if (tag) {
                newNote.tag = tag;
            }

            //Find the note to be updated
            let note = await Notes.findById(req.params.id);
            if (!note) {
                return res.status(404).send('Not Found');
            }

            if (note.user.toString() !== req.user.id) {
                return res.status(401).send('Not Allowed');
            }

            note = await Notes.findByIdAndUpdate(
                req.params.id,
                { $set: newNote },
                { new: true },
            );
            res.json(note);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Error while finding note');
        }
    } else {
        return res.send({ errors: result.array() });
    }
});

// ROUTE 4: Delete notes using: put "/api/notes/deletenote". Login Required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        try {
            //Find the note to be delete & delete it
            let note = await Notes.findById(req.params.id);
            if (!note) {
                return res.status(404).send('Not Found');
            }

            // Allow deletion only if user owns this note
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send('Not Allowed');
            }

            note = await Notes.findByIdAndDelete(req.params.id);
            res.json({ Success: 'Note has been deleted' });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Error while Deleting note');
        }
    } else {
        return res.send({ errors: result.array() });
    }
});

module.exports = router;
