const express = require('express');
const path =require('path');

// Imports the notes router
const api = require('./routes/index');

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data.
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Middleware to serve up static assets from the public folder.
app.use(express.static('public'));

// Send all the requests that begin with /api to the index.js in the routes folder.
app.use('/api', api);

// GET route for the notes home page
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for the note taking page.
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/pages/notes.html'))
);

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`)
);