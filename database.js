/* eslint-disable no-console */
require('dotenv').config();
const mysql = require('mysql2/promise');

const database = mysql.createPool({
  //  to prepare a connection pool using the environment variables you've just created in .env
  host: process.env.DB_HOST, // address of the server
  port: process.env.DB_PORT, // port of the DB server (mysql), not to be confused with the APP_PORT!
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

database
  .getConnection()
  .then(() => {
    console.log('Can reach database');
  })
  .catch((err) => {
    console.error(err);
  });

/*
When the script reloads, you should see a lot of stuff in your terminal.
Paying attention you will see result is an array containing the selected rows as a first element.
Rest of the array contains extra information about the request.
We will focus on the selected rows, and extract them from the result array :
*/

database
  .query('SELECT * FROM movies')
  .then((result) => {
    const movies = result[0];
    console.log(movies);
  })
  .catch((err) => {
    console.error(err);
  });

database.query('SELECT * FROM users').then(([result]) => {
  const users = result;
  console.log(users);
});

/*
Ou usando array descructuring
database
  .query("select * from movies")
  .then(([movies]) => {
    console.log(movies);
  })
  .catch((err) => {
    console.error(err);
  });
  */

module.exports = database;
