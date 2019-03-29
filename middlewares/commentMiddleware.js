const { Comment, validate } = require("../models/comment");
const { isEqual } = require("lodash");
module.exports = {
  validateCommentBody: (req, res, next) => {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({
        error: true,
        message: error.details[0].message
      });
    return next();
  },
  validateComment: async (req, res, next) => {
    let comment;

    if (req.body._parentCommentUid) {
      const { _parentCommentUid } = req.body;
      comment = await Comment.findOne({ uid: _parentCommentUid });
    }
    if (req.params.commentUID) {
      const { commentUID } = req.params;
      comment = await Comment.findOne({ uid: commentUID });
    }
    if (!comment)
      return res.status(400).json({
        error: true,
        message: "The comment you're trying to reply to is not there anymore!"
      });
    res.locals.comment = comment;
    return next();
  }
};
