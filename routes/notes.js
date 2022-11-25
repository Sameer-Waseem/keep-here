const express = require("express");
const { Note, Validate } = require("../models/note");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    res.status(200).json({ note });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json({ notes });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, user_id } = req.body;

    const { error } = Validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let notes = new Note({ title, description, user_id });
    await notes.save();

    res.status(200).json({ notes });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = Validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    let note = await Note.findByIdAndUpdate(id, req.body, { new: true });

    if (!note)
      return res.status(404).json({
        message: "Note with the given id was not found!",
      });

    res.status(200).json({ note });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    let note = await Note.findByIdAndRemove(id);

    if (!note)
      return res.status(404).json({
        message: "Note with the given id was not found!",
      });

    res.status(200).json({ message: "Note deleted successfully." });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
