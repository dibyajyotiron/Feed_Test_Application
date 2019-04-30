const mongoose = require("mongoose");
const uuid = require("uuid/v1");

const { Schema } = mongoose;

const elementSchema = new Schema({
  uid: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  data: Object
});

elementSchema.pre("save", function(next) {
  if (this.uid === undefined && this.isNew) this.uid = uuid();
  next();
});

module.exports = mongoose.model("element", elementSchema);
