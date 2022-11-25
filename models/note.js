const Joi = require("joi");
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, min: 3, max: 50 },
  description: { type: String, required: true, min: 10, max: 200 },
  user_id: { type: String, unique: true, required: true },
});

const Note = mongoose.model("Note", noteSchema);

function validateNote(note) {
  const schema = Joi.object({
    title: Joi.string().min(1).max(50).required(),
    description: Joi.string().min(10).max(200).required(),
    user_id: Joi.string().required(),
  });

  return schema.validate(note);
}

module.exports.Note = Note;
module.exports.Validate = validateNote;
