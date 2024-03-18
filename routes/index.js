const router = require('express').Router();

// Imports files containing the routes.
const notesRouter = require('./notes');

router.use('/notes', notesRouter);

module.exports = router;