const { Comment } = require("../models/comment");
const { validateComment } = require("../models/joiSchema");

module.exports = {
  async validateComment(req, res, next) {
    let comment;
    const { commentUID } = req.params;
    comment = await Comment.findOne({ uid: commentUID });

    const url = req.url.split("/").filter(u => u.length > 0);

    if (!comment)
      return res.status(400).json({
        error: true,
        message: `The comment you're trying to ${!url.includes("vote") ? "reply to" : "vote"} is not there anymore!`
      });

    res.locals.comment = comment;
    return next();
  }
};
