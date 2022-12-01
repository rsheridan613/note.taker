const router = require("express").Router();
const fs = require("fs");

const id = require("../helper/id");

// Grabbing notes from db to push to page
router.get("/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON objects
      const parsedNotes = JSON.parse(data);
      // Pushing objects to page
      res.json(parsedNotes);
    }
  });
});

router.post("/notes", (req, res) => {
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
        // Pushes all notes
        res.json(parsedNotes);

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

module.exports = router;
