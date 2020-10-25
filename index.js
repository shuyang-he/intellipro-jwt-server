const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const users = require("./routes/users");

const PORT = process.env.PORT || 8000;
const MONGO_INITDB_DATABASE = process.env.MONGO_INITDB_DATABASE || "intellipro-jwt";
const MONGO_INITDB_ROOT_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME || "root";
const MONGO_INITDB_ROOT_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD || "secret";

console.log(MONGO_INITDB_DATABASE);
console.log(MONGO_INITDB_ROOT_USERNAME);
console.log(MONGO_INITDB_ROOT_PASSWORD);

const corsOptions = {
  // origin: "http://localhost:3000/",
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use("/api/users", users);

const mongoURI = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@database:27017/${MONGO_INITDB_DATABASE}`;
const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  autoCreate: true,
  autoIndex: false,
};

app.use("/api/users", users);

mongoose
  .connect(mongoURI, connectOptions, (err, db) => {
    if (err) {
      throw err;
    }
    console.log("Connect to MongoDB");
  })
  .then((res) => {
    return app.listen(PORT, () => {
      console.log("Server started on port", PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
