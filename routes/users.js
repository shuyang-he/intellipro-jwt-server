const express = require("express");
const authentication = require("../auth/authentication");
const { register, login, profile, logout } = require("../controllers/users");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authentication, profile);
router.get("/logout", logout);

module.exports = router;
