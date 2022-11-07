require('dotenv').config();

const express = require('express');

const app = express();

const port = process.env.APP_PORT ?? 5000; // default port in case APP_PORT doesn't work

const welcome = (req, res) => {
  res.send('Welcome to my favourite movie list');
};

app.get('/', welcome);

const movieHandlers = require('./movieHandlers');
const userHanders = require('./userHandlers');

app.get('/api/movies', movieHandlers.getMovies);
app.get('/api/movies/:id', movieHandlers.getMovieById);
app.get('/api/users', userHanders.getUsers);
app.get('/api/users/:id', userHanders.getUserById);

app.listen(port, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error('Something bad happened');
  } else {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on ${port}`);
  }
});
