/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require("jsonwebtoken");
const constants = require("../helpers/constants");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, constants.jwtSecret, (error, decodedToken) => {
      if (error) {
        // token was modified or it expired
        res.status(401).json({ you: "shall not pass" });
      } else {
        // token is valid
        req.decodedToken = decodedToken;
        // console.log("Decoded Token", req.decodedToken);
        next();
      }
    });
  } else {
    res
      .status(401)
      .json({ message: "please provide valid authorization credentials" });
  }
};
