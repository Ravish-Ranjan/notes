const express = require("express");
const { NoteList } = require("../db");

const router = express.Router();

// fetch user note
router.post("/", async (req, res) => {
    try {
        const { author } = req.body;
        let notes = await NoteList.findOne({ author });
        return res.status(200).json(notes.notes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// create new note
router.post("/new", async (req, res) => {
    try {
        const { author, title, body } = req.body;
        let newDate = new Date().toUTCString();
        let newNote = {
            title,
            body,
            time: newDate,
        };
        let data = await NoteList.findOne({ author });
        data.notes.push(newNote);
        let saved = await data.save();
        return res.status(200).json(saved.notes[saved.notes.length - 1]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// update note
router.patch("/", async (req, res) => {
    try {
        const { author, note_id, title, body } = req.body;
        if (!author || !note_id) {
            return res.status(400).json({
                message: "Missing required fields: authorId or noteId",
            });
        }

        // Build the update object dynamically
        const updateFields = {};
        if (title !== undefined && title !== "") {
            updateFields["notes.$.title"] = title;
        }
        if (body !== undefined && body !== "") {
            updateFields["notes.$.body"] = body;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        // Find the document and update the specific note
        let updated = await NoteList.findOneAndUpdate(
            { author, "notes._id": note_id },
            { $set: updateFields }
        );
        if (updated.nModified == 0) {
            return res.status(400).json({ error: "No Note updated" });
        }
        await updated.save();
        return res.status(200).json({ message: "Note updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// delete note
router.delete("/", async (req, res) => {
    try {
        const { author, note_id } = req.body;
        let ret = await NoteList.findOneAndUpdate(
            { author },
            { $pull: { notes: { _id: note_id } } }
        );
        console.log(ret);
        return res.status(200).json({ message: "deleted" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
module.exports = router;
