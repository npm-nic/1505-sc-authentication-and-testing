const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const validateNewUserDetails = require("../middlewares/validateNewUserDetails");
const validateUserDetails = require("../middlewares/validateUserDetails");
const signToken = require("../helpers/signToken");
const Users = require("../users/users-model");

const authRouter = require("express").Router();

// Register a user
authRouter.post("/register", validateNewUserDetails, (req, res) => {
  const user = req.body;

  // hash the password
  const rounds = 8;
  const hash = bcrypt.hashSync(user.password, rounds);

  user.password = hash;

  // save the user to the database
  Users.add(user)
    .then((user) => {
      res.status(201).json({ data: user });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

authRouter.post("/login", validateUserDetails, (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then((users) => {
      const user = users[0];
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = signToken(user);

        res.status(200).json({
          message: "Welcome to our API...",
          token,
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = authRouter;
