const connection = require('../db-config');
const db = connection.promise();
const Joi = require('joi');

const findMany = ({ filters: { color, max_duration } }) => {
  let sql = 'SELECT * FROM movies';
  const sqlValues = [];
  if (color) {
    sql += ' WHERE color = ?';
    sqlValues.push(color);
  }
  if (max_duration) {
    if (color) sql += ' AND duration <= ? ;';
    else sql += ' WHERE duration <= ?';
    sqlValues.push(max_duration);
  }
  return db.query(sql, sqlValues).then(([results]) => results);
};

const findOne = ({ id }) => {
  let sql = 'SELECT * FROM movies ';
  const parsedId = parseInt(id);
  sql += 'WHERE id = ?';
  return db.query(sql, parsedId).then(([results]) => results);
}

const createOne = ({ title, director, year, color, duration }) => {
  const { error } = Joi.object({
    title: Joi.string().max(255).required(),
    director: Joi.string().max(255).required(),
    year: Joi.number().integer().min(1888).required(),
    color: Joi.boolean().required(),
    duration: Joi.number().integer().min(1).required(),
  }).validate(
    { title, director, year, color, duration },
    { abortEarly: false }
  );
  if (error) return Promise.reject('INVALID_DATA');
  return db.query('INSERT INTO movies (title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)', [title, director, year, color, duration]).then(([results]) => results);
}

const editOne = (body, movieId) => {
  return db.query('SELECT * FROM movies WHERE id = ?', [movieId])
  .then(([results]) => {
    existingMovie = results[0];
    if (!existingMovie) return Promise.reject('RECORD_NOT_FOUND');
    validationErrors = Joi.object({
      title: Joi.string().max(255),
      director: Joi.string().max(255),
      year: Joi.number().integer().min(1888),
      color: Joi.boolean(),
      duration: Joi.number().integer().min(1),
    }).validate(body, { abortEarly: false }).error;
    if (validationErrors) return Promise.reject('INVALID_DATA');
    return db.query('UPDATE movies SET ? WHERE id = ?', [body, movieId]);
  })
}

const removeOne = (movieId) => {
  return db.query('DELETE FROM movies WHERE id = ?', [movieId]);
}
module.exports = {
  findMany,
  findOne,
  createOne,
  editOne,
  removeOne
}