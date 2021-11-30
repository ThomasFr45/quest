// Create the router object that will manage all operations on movies
const usersRouter = require('express').Router();
// Import the movie model that we'll need in controller functions
const Users = require('../models/user');

// GET /api/movies/
usersRouter.get('/', (req, res) => {
  Users.findMany()
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error retrieving movies from database');
    });
});


// TODO : GET /api/movies/:id

usersRouter.get('/:id', (req, res) => {
  const  id  = req.params;
  Users.findOne(id).then(movie => {
    res.json(movie);
  }).catch((err) => {
    console.log(err);
    res.status(500).send('Error retrieving the movie from database');
  })
})


usersRouter.post('/', (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;
    Users.createOne(req.body).then(result => {
      const id = result.insertId;
      const createdMovie = { id, firstname, lastname, email, city, language };
      res.status(201).json(createdMovie);
    }).catch((err) => {
      if (err === 'INVALID_DATA')
      res.status(422).send("INVALID DATA");
      if (err === 'DUPLICATE_EMAIL')
      res.status(422).send("DUPLICATE EMAIL");
    })
});

usersRouter.put('/:id', (req, res) => {
  const userId = req.params.id;
  let existingMovie = null;
  let validationErrors = null;
  Users.editOne(req.body, userId).then(() => {
      res.status(200).json({ ...existingMovie, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Movie with id ${userId} not found.`);
      else if (err === 'INVALID_DATA')
        res.status(422).send("INVALID DATA");
      else res.status(500).send('Error updating a Users.');
    });
});

usersRouter.delete('/:id', (req, res) => {
  const userId = req.params.id;
  Users.removeOne(userId).then(result => {
    if (result[0].affectedRows > 0) res.status(200).send('🎉 User deleted!');
    else res.status(404).send('User not found');
  })
});
module.exports = usersRouter;