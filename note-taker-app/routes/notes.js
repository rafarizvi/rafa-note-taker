const notes = require('express').Router();
const fs = require('fs');
const uuid = require('../helpers/uuid');



  notes.get('/', (req, res) => {
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
  // Log that a POST request was received
  console.log(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // Convert the data to a string so we can save it

    fs.readFile(`./db/notes.json`, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        res.json('Error adding note');
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNote);

        // Write the string to a file
        fs.writeFile(`./db/notes.json`, JSON.stringify(parsedNotes, null, 2), (err) =>
          err
            ? console.error(err)
            : console.log(`New note has been added to JSON file`)
            );
            console.log('Added new note');
            res.status(201).json('Added new note');
      }
      
    });

  } else {
    console.log('Add both title and text');
  }
  
});

// DELETE route for deleting notes
notes.delete('/:id', (req, res) => {

  const deleteNoteId = req.params.id;

  fs.readFile(`./db/notes.json`, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
    } else {
      const parsedNotes = JSON.parse(data);


      let noteIndex = -1;

      // Iterate through the notes to find the index of the note to delete
      for (let i = 0; i < parsedNotes.length; i++) {
        if (deleteNoteId === parsedNotes[i].id) {
          noteIndex = i;
          break; // Exit the loop once the note is found
        }
      }

      // If the note with the specified ID is found, delete it
      if (noteIndex !== -1) {
        parsedNotes.splice(noteIndex, 1);
        console.log('Deleted note');
        res.status(200).json('Deleted note');
      } else {
        // If the note is not found, return an error
        console.error('Unable to delete note');
        res.status(404).json('Note not found');
      }

      // Write the string to a file
      fs.writeFile(`./db/notes.json`, JSON.stringify(parsedNotes, null, 2), (err) =>
        err
          ? console.error(err)
          : console.log(`Note has been deleted from JSON file`)
      );
    };
  });


});

module.exports = notes;