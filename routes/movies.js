const moviesRouter = require('express').Router();
const Movie = require('../models/movie');

moviesRouter.get('/', (req, res) => {
  const { max_duration, color } = req.query;
  Movie.findMany({ filters: { max_duration, color } })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error retrieving movies from database');
    });
});


moviesRouter.get('/:id', (req, res) => {
  const  id  = req.params;
  Movie.findOne(id).then(movie => {
    res.json(movie);
  }).catch((err) => {
    console.log(err);
    res.status(500).send('Error retrieving the movie from database');
  })
})


moviesRouter.post('/', (req, res) => {
  const { title, director, year, color, duration } = req.body;
    Movie.createOne(req.body).then(result => {
      const id = result.insertId;
      const createdMovie = { id, title, director, year, color, duration };
      res.status(201).json(createdMovie);
    }).catch((err) => {
      if (err === 'INVALID_DATA')
      res.status(422).send("INVALID DATA");
    })
});

moviesRouter.put('/:id', (req, res) => {
  const movieId = req.params.id;
  let existingMovie = null;
  Movie.editOne(req.body, movieId).then(() => {
    res.status(200).json({ ...existingMovie, ...req.body });
  })
  .catch((err) => {
    console.error(err);
    if (err === 'RECORD_NOT_FOUND')
      res.status(404).send(`Movie with id ${movieId} not found.`);
    else if (err === 'INVALID_DATA')
      res.status(422).send("INVALID DATA");
    else res.status(500).send('Error updating a Users.');
  });
});

moviesRouter.delete('/:id', (req, res) => {
  const movieId = req.params.id;
  Movie.removeOne(movieId).then(result => {
    if (result[0].affectedRows > 0) res.status(200).send('🎉 Movie deleted!');
    else res.status(404).send('Movie not found');
  })
});
module.exports = moviesRouter;