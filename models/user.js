const connection = require('../db-config');
const db = connection.promise();
const Joi = require('joi');

const findMany = () => {
  let sql = 'SELECT * FROM users';
  return db.query(sql).then(([results]) => results);
};

const findOne = ({ id }) => {
  let sql = 'SELECT * FROM users ';
  const parsedId = parseInt(id);
  sql += 'WHERE id = ?';
  return db.query(sql, parsedId).then(([results]) => results);
}

const createOne = ({ email, firstname, lastname, city, language }) => {
  const { error } = Joi.object({
    email: Joi.string().email().max(255).required(),
    firstname: Joi.string().max(255).required(),
    lastname: Joi.string().max(255).required(),
    city: Joi.string().allow(null, '').max(255),
    language: Joi.string().allow(null, '').max(255),
  }).validate(
    { email, firstname, lastname, city, language },
    { abortEarly: false }
  );
  if (error) return Promise.reject('INVALID_DATA');
  return db.query('INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)', [firstname, lastname, email, city, language]).then((results) => results[0]);
}

const editOne = (body, userId) => {
  return db.query('SELECT * FROM users WHERE id = ?', [userId])
  .then(([results]) => {
    existingMovie = results[0];
    if (!existingMovie) return Promise.reject('RECORD_NOT_FOUND');
    validationErrors = Joi.object({
      email: Joi.string().email().max(255),
      firstname: Joi.string().min(1).max(255),
      lastname: Joi.string().min(1).max(255),
      city: Joi.string().allow(null, '').max(255),
      language: Joi.string().allow(null, '').max(255),
    }).validate(body, { abortEarly: false }).error;
    if (validationErrors) return Promise.reject('INVALID_DATA');
    return db.query('UPDATE users SET ? WHERE id = ?', [body, userId]);
  })
}

const removeOne = (userId) => {
  return db.query('DELETE FROM users WHERE id = ?', [userId]);
}
module.exports = {
  findMany,
  findOne,
  createOne,
  editOne,
  removeOne
}