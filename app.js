require("dotenv").config();

const express = require("express");

const app = express();
const port = process.env.APP_PORT ?? 5000; // default port in case APP_PORT doesn't work
const { validateMovie, validateUser } = require("./validators");
const userHandlers = require("./userHandlers");

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.use(express.json());
// MIDDLEWARE: software or function called between 2 pieces of software
// An app using Express is nothing but a succession of middleware calls.
// this express.json() vital to use for POST, as EXPRESS can not request bodies by default
// to ensure that all our routes are able to read a JSON formatted request body.
// *adicionamos a info no POSTMAN, que tem de ser match com a database, e clicamos em SEND.
// *Não esquecer que tem de ser POST e, nas tabs, selecionar BODY. Dropdown menu: JSON

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.putMovie);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post("/api/users", validateUser, userHandlers.postUser);
app.put("/api/users/:id", validateUser, userHandlers.putUsers);

app.listen(port, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error("Something bad happened");
  } else {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on ${port}`);
  }
});
