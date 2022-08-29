const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const { User, validateRegister, validateLogin } = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = validateRegister(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "Email already register." });

    user = new User(req.body);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      "jwtPrivateKey"
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = validateLogin(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(404).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      "jwtPrivateKey"
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ issue: error });
  }
});

module.exports = router;
