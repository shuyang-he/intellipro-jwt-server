const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const users = require("./routes/users");

const PORT = process.env.PORT || 8000;
const MONGO_INITDB_DATABASE = process.env.MONGO_INITDB_DATABASE;
const MONGO_INITDB_ROOT_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
const MONGO_INITDB_ROOT_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;

const corsOptions = {
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use("/api/users", users);

let mongoURI = "";
if (MONGO_INITDB_DATABASE === undefined && MONGO_INITDB_ROOT_USERNAME === undefined && MONGO_INITDB_ROOT_PASSWORD === undefined) {
  mongoURI = `mongodb+srv://admin:admin@cluster0.ee6d2.mongodb.net/intellipro-jwt?retryWrites=true&w=majority`;
} else {
  mongoURI = `mongodb://max:max@mongo:27017/${MONGO_INITDB_DATABASE}`
}

console.log(mongoURI);

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
