const mongoose = require("mongoose");
const { Schema } = mongoose;
const { user } = require("./mixin");
const Joi = require("joi");

const commentSchema = new Schema({
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
  postedOn: {
    type: Date,
    default: Date.now
  },
  data: Object
});

function validate(comment) {
  const schema = {
    comment: Joi.string()
      .max(500)
      .required(),
    _parentCommentUid: Joi.string(),
    data: Joi.object()
  };
  return Joi.validate(comment, schema);
}

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
module.exports.validate = validate;
