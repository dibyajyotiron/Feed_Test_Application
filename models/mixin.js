const mongoose = require("mongoose");
const { Schema } = mongoose;
const user = new Schema(
  {
    uid: String,
    email: String
  },
  { _id: false }
);

module.exports.user = user;
