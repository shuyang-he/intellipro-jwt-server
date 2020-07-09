const jwt = require("jsonwebtoken");
const SECRET = require("./secret");

const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({
          success: false,
          message: err,
        });
      } else {
        req.data = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: "No authorization found in headers.",
    });
  }
};

module.exports = authentication;
