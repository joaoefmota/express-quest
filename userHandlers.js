/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable linebreak-style */
/* eslint-disable quotes */
const database = require("./database");

const getUsers = (req, res) => {
  database
    .query("SELECT * FROM users")
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retriving data from database");
    });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("SELECT * FROM users WHERE id =?", [id])
    .then(([result]) => {
      if (result[0] != null) {
        res.json(result[0]);
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;
  database
    .query(
      "INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.location(`./api/users/${result.insertId}`).sendstatus(201);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error updating users database");
    });
};

const putUsers = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language } = req.body;
  database
    .query(
      "UPDATE users SET firstname=?, lastname=?, email=?, city=?, language=? WHERE id=?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the users database");
    });
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
  putUsers,
};
