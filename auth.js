// Authentication process according to Argon2Id

const argon2 = require("argon2");

// steps method

const hashingOptions = {
  type: argon2.argon2d,
  memoryCost: 2 ** 16,
  hashLength: 50,
  timeCost: 5,
  paralellism: 1,
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

module.exports = {
  hashPassword,
};

// and in App.js add the necessary routes,
// like app.post(".auth.js", hashPassword, userHanderls.postUser);
