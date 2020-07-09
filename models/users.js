const mongoose = require("mongoose");

const { Schema } = mongoose;
const usersSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
    },
  },
  { collection: "users" }
);

module.exports = mongoose.model("users", usersSchema);
