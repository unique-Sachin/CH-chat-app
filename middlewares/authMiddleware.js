const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) {
        res.status(400).send("Access-Denied");
      }
      const user = await userModel.findById(decoded.userId);
      if (user.email) {
        req.user = user;
        next();
      } else {
        res.status(400).send("Access-Denied");
      }
    });
  } else {
    res.status(400).send("Access-Denied");
  }
};

module.exports = authMiddleware;
