/* eslint-disable no-console */
/* eslint-disable radix */
const database = require("./database");

const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    colors: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    colors: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
];

const getMovies = (req, res) => {
  database
    .query("SELECT * FROM movies")
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

/* ANTIGO, para EXEMPLO
const getMovies = (req, res) => {
  res.json(movies);
};
*/

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("SELECT * FROM movies WHERE id =?", [id])
    .then(([result]) => {
      if (result[0] != null) {
        res.json(result[0]);
      } else {
        res.status(404).send("Not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

/* ANTIGO, no início do exemplo:
const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  const movie = movies.find((movie) => movie.id === id);

  if (movie != null) {
    res.json(movie);
  } else {
    res.status(404).send("Not Found");
  }
};
*/

const postMovie = (req, res) => {
  // console.log(req.body);
  const { title, director, year, color, duration } = req.body;
  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      console.log(result.insertId);
      res
        .location(`/api/movies/${result.insertId}`)
        .sendStatus(201)
        .send("Movie successefully inserted");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
  // res.send("Post route is working");
};

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
};
