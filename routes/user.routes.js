const userModel = require("../models/userModel");
const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

userRouter.get("/", authMiddleware, async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await userModel
    .find(keyword)
    .find({ _id: { $ne: req.user._id } });
  res.status(201).send(users);
});

userRouter.post("/register", async (req, res) => {
  const { name, email, password, gender, avatar } = req.body;
  try {
    if (!email || !password || !name || !gender) {
      res.status(401).send("All Fields are Required");
    }
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      res.status(401).send("Account already Exists");
    } else {
      bcrypt.hash(password, 5, async function (err, hash) {
        if (err) {
          res.status(400).send("Failed to Register");
        }
        // Store hash in your password DB.
        const newUser = new userModel({
          name,
          email,
          password: hash,
          gender,
          avatar,
        });
        await newUser.save();
        res.status(201).send({ msg: "Sign Up Successful" });
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(401).send("Email and Password Required");
    }
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      res.status(401).send("Email is not Registered");
    } else {
      bcrypt.compare(
        password,
        userExist.password,
        async function (err, result) {
          if (err) {
            res.status(400).send("Failed to Login");
          }
          if (result === true) {
            const token = jwt.sign(
              { userId: userExist._id },
              process.env.JWT_SECRET,
              { expiresIn: "10d" }
            );
            res.status(201).send({
              msg: "Login Successful",
              id: userExist._id,
              name: userExist.name,
              email: userExist.email,
              avatar: userExist.avatar,
              token,
            });
          } else {
            res.status(401).send("Invalid Email or Password");
          }
        }
      );
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = userRouter;
