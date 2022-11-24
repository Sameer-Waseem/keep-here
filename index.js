const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const note = require("./routes/notes");
const user = require("./routes/users");
const cors = require("cors");

const app = express();

require("./startup/production")(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", user);
app.use("/api/note", note);

mongoose
  .connect(config.get("db"))
  .then(() => console.log("Connected to MongoDB..."))
  .catch((error) => console.log("Could not connected to MongoDB...", error));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
