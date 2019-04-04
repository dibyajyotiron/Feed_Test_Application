const mongoose = require("mongoose");
const { Schema } = mongoose;
const { user } = require("./mixin");

const voteSchema = new Schema(
  {
    _voter: user,
    value: {
      type: String,
      enum: ["-1", "1"],
      required: true
    },
    _comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  },
  { timestamps: true }
);
module.exports.Vote = mongoose.model("Vote", voteSchema);
