const express = require("express");
const path = require("path");
const fs = require("fs");

const notes = require("./db/db.json");
const id = require("./helper/id");

const PORT = process.env.PORT || 3001;
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//Routes

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.post("/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    // Turns notes input into an object, adds id
    const newNote = { title, text, id: id() };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Adds the new note
        parsedNotes.push(newNote);

        // Send updated notes back to db file
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated notes!")
        );
      }
    });
  }
});

// app.delete("/api/notes/:id", () => {});

app.listen(PORT, () => console.log(`App listening at ${PORT}`));
