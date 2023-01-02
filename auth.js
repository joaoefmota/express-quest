// Authentication process according to Argon2Id

const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

// steps method

const hashingOptions = {
  type: argon2.argon2d,
  memoryCost: 2 ** 16,
  hashLength: 50,
  timeCost: 5,
  paralellism: 1,
};

const verifyPassword = (req, res) => {
  argon2
    .verify(req.user.hashedPassword, req.body.password)
    .then((isVerified) => {
      if (isVerified) {
        const payload = { sub: req.user.id };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        delete req.user.hashedPassword;
        res.send({ token, user: req.user });
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const hashPassword = (req, res, next) => {
  // hash the password using argon2 then call next ();
  argon2
    .hash(req.body.password, hashingOptions)
    .then((hashedPassword) => {
      console.log(hashedPassword);
      req.body.hashedPassword = hashedPassword;

      delete req.body.password;
      next();
    })
    .catch((err) => {
      console.err(err);
      res.sendStatus(500);
    });
};

/* 
    can also use await function that has two parameters: password and hashingOptions
    hashingOptions can be an object immediatly on the parameter like
    const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2d,
    memoryCost: 2 ** 16,
    hashLength: 50,
});
*/

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");

    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }
    const [type, token] = authorizationHeader.split(" ");
    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }
    req.payload = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
};

// and in App.js add the necessary routes,
// like app.post(".auth.js", hashPassword, userHanderls.postUser);
