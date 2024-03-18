const notes = require('express').Router();
const fs = require('fs');
const uuid = require('../helpers/uuid');

// GET route parses all notes from notes.json.
  notes.get('/', (req, res) => {
    // Reads the notes.json file.
    fs.readFile(`./db/notes.json`, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        res.status(500).json('Error reading notes');
      } else {
        res.json(JSON.parse(data));
      }
    });
  });


// POST request for notes
notes.post('/', (req, res) => {
  // Log that a POST request was received.
  console.log(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body.
  const { title, text } = req.body;

  // Checks if all the required inputs are present.
  if (title && text) {
    // newNote variable saves an object containing the title, text, and id.
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // Reads and parses the notes.json file, then pushes the 'newNote' object to the saved array of notes.
    fs.readFile(`./db/notes.json`, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        res.json('Error adding note');
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNote);

        // Stringifies and writes the updated array back to the notes.json file.
        fs.writeFile(`./db/notes.json`, JSON.stringify(parsedNotes, null, 2), (err) =>
          err
            ? console.error(err)
            : console.log(`New note has been added to JSON file`)
            );
            console.log('Added new note');
            res.status(200).json('Added new note');
      }  
    });

  } else {
    console.log('Add both title and text');
  }
});

// DELETE route for deleting notes.
// Uses the id parameter to identify the note and deletes it.
notes.delete('/:id', (req, res) => {

  const deleteNoteId = req.params.id;
  // Reads notes.json file, then interates to find the specified id.
  fs.readFile(`./db/notes.json`, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
    } else {
      const parsedNotes = JSON.parse(data);

      // If no matching id is found, noteIndex = -1 remains unchanged.
      let noteIndex = -1;

      // Iterate through the notes to find the index of the note to delete
      for (let i = 0; i < parsedNotes.length; i++) {
        if (deleteNoteId === parsedNotes[i].id) {
          noteIndex = i;
          break; // Exit the loop once the note is found
        }
      }

      // Delete the note if the note with the specified ID is found.
      if (noteIndex !== -1) {
        parsedNotes.splice(noteIndex, 1);
        console.log('Deleted note');
        res.status(200).json('Deleted note');
      } else {
        // If the note is not found, return an error.
        console.error('Unable to delete note');
        res.status(404).json('Note not found');
      }

      // Write the string back to the notes.json file.
      fs.writeFile(`./db/notes.json`, JSON.stringify(parsedNotes, null, 2), (err) =>
        err
          ? console.error(err)
          : console.log(`Note has been deleted from JSON file`)
      );
    };
  });
});

module.exports = notes;