/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable linebreak-style */
/* eslint-disable quotes */
const database = require("./database");

const getUsers = (req, res) => {
  const initialSql = "SELECT * FROM users";
  const where = [];
  if (req.query.language != null) {
    where.push({
      column: "language",
      value: req.query.language,
      operator: "=",
    });
  }
  if (req.query.city != null) {
    where.push({
      column: "city",
      value: req.query.city,
      operator: "=",
    });
  }
  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "WHERE" : "AND"} ${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )

    .then(([users]) => {
      res.json(users);
    })

    .catch((err) => {
      console.err(err);
      res.status(500).send("Error retrieving data from database");
    });
};

/* ANTIGO ANTES DA QUEST6
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
*/

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
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;
  database
    .query(
      "INSERT INTO users (firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language, hashedPassword]
    )
    .then(([result]) => {
      res.location(`./api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      if ((err.code = "ERR_DUP_ENTRY")) {
        res.status(500).send(`The user with email: ${email} already exists`);
      } else {
        console.log(err);
        res.status(500).send("Error updating users database");
      }
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

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("DELETE FROM users WHERE id=?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not found");
      } else {
        res.status(204).send("User deleted");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the user");
    });
};

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  const { email } = req.body;

  database
    .query("SELECT * FROM users WHERE email = ?", [email])
    .then(([users]) => {
      if (users[0] != null) {
        req.user = users[0];
        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
  putUsers,
  deleteUser,
  getUserByEmailWithPasswordAndPassToNext,
};
