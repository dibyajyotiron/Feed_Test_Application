const mongoose = require("mongoose");
const { Schema } = mongoose;
const { user } = require("./mixin");

const voteSchema = new Schema({
  _voter: user,
  value: {
    type: String,
    enum: ["-1", "1"],
    required: true
  },
  _comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  },
  votedOn: {
    type: Date,
    default: Date.now
  }
});
module.exports.Vote = mongoose.model("Vote", voteSchema);
