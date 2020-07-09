const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const cookieAge = 60 * 60 * 1000;

const register = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const data = req.body.data;
  try {
    const hashedPw = await bcrypt.hash(password, 10);
    const user = new Users({
      username: username,
      password: hashedPw,
      data: data,
    });
    const queryList = await Users.find({ username: username });
    if (queryList.length === 0) {
      const saveResult = await user.save();
      res.status(201).json({
        success: true,
        message: "User created.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User already exist.",
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const query = await Users.findOne({ username: username });
  if (query === null) {
    res.status(400).json({
      exist: false,
      valid: true,
    });
  } else {
    const validPw = bcrypt.compare(password, query.password);
    if (validPw) {
      const token = jwt.sign(
        {
          username: username,
          password: password,
        },
        "SeCrEt",
        { expiresIn: "1h" }
      );
      res.cookie("jwt", token, { maxAge: cookieAge });
      res.status(200).json({
        exist: true,
        valid: true,
      });
    } else {
      res.status(400).json({
        exist: true,
        valid: false,
      });
    }
  }
};

const logout = async (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).json({ logout: true });
};

module.exports.register = register;
module.exports.login = login;
module.exports.logout = logout;
