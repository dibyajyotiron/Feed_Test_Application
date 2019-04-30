const mongoose = require("mongoose");
const { Schema } = mongoose;
const { user } = require("./mixin");

const commentSchema = new Schema(
  {
    uid: String,
    comment: { type: String, trim: true, required: true },
    _owner: { type: user },
    _parentCommentUid: {
      type: String
    },
    _feed: {
      type: Schema.Types.ObjectId,
      ref: "Feed"
    },
    data: Object
  },
  { timestamps: true }
);

commentSchema.pre("find", function(next) {
  this.populate({
    path: "_feed"
  });
  next();
});
commentSchema.pre("findOne", function(next) {
  this.populate({
    path: "_feed"
  });
  next();
});

module.exports.Comment = mongoose.model("Comment", commentSchema);
