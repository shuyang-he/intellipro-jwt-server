const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require("../models/users");
const SECRET = require("../auth/secret");

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
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const login = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const query = await Users.findOne({ username: username });
    if (query === null) {
      res.status(400).json({
        success: false,
        exist: false,
        valid: true,
      });
    } else {
      const validPw = await bcrypt.compare(password, query.password);
      if (validPw) {
        const token = jwt.sign(
          {
            username: username,
          },
          SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("jwt", token, { maxAge: cookieAge });
        res.status(200).json({
          success: true,
          exist: true,
          valid: true,
          data: query,
        });
      } else {
        res.status(400).json({
          success: false,
          exist: true,
          valid: false,
        });
      }
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const profile = async (req, res, next) => {
  const data = req.data;
  try {
    const query = await Users.findOne({ username: data.username });
    if (query === null) {
      res.status(400).json({
        success: false,
        exist: false,
      });
    } else {
      res.status(200).json({
        success: true,
        data: query,
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const logout = async (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true });
};

module.exports.register = register;
module.exports.login = login;
module.exports.profile = profile;
module.exports.logout = logout;
