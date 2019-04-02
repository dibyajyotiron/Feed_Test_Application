const { Comment, validate } = require("../models/comment");
const { Vote } = require("../models/vote");
const io = require("../services/socket");

const uuid = require("uuid/v1");
const { isEqual, countBy, groupBy } = require("lodash");

async function getAllComments(feed) {
  const comments = await Comment.find({ _feed: feed });

  const mappedComments = comments.map(({ comment, _owner, _feed, _parentCommentUid, uid, postedOn }) => {
    return {
      comment,
      _owner,
      _feed: _feed.uid,
      uid,
      _parentCommentUid,
      postedOn
    };
  });

  return mappedComments;
}
async function getAllCommentsWithVotes(comments) {
  const votes = await Vote.aggregate([
    {
      $lookup: {
        from: "comments",
        localField: "_comment",
        foreignField: "_id",
        as: "_comment"
      }
    },
    { $unwind: "$_comment" },
    {
      $project: {
        _id: 0,
        value: 1,
        _voter: 1,
        votedOn: 1,
        _comment: "$_comment.uid"
      }
    }
  ]);

  comments.forEach(comment => {
    comment.votes = votes.filter(vote => vote._comment === comment.uid);
  });

  return comments;
}

module.exports = {
  postComment: async (req, res) => {
    const _owner = {
      uid: req.user.uid,
      email: req.user.email
    };

    const comment = new Comment({
      ...req.body,
      _owner,
      _feed: res.locals.feed,
      uid: uuid()
    });

    await comment.save();
    io.getIO().emit("comments", { action: "create", comment });
    return res.json({ success: true, message: "Comment posted!" });
  },
  getComments: async (req, res) => {
    const feed = res.locals.feed;
    const comments = await getAllComments(feed);
    const commentsWithVotes = await getAllCommentsWithVotes(comments);

    const groupByVotes = commentsWithVotes.map(comment => {
      const grouped = groupBy(comment.votes, "value");
      comment.votes = { ...grouped };
      for (let vote in comment.votes) {
        const voterArr = [];
        voterArr.push(...comment.votes[vote].map(v => v._voter));
        comment.votes[vote] = voterArr;
      }

      return comment;
    });

    return res.json(groupByVotes);
  },
  getAllComments,
  getAllCommentsWithVotes
};
