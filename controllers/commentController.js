const { Comment } = require("../models/comment");
const { Vote } = require("../models/vote");
const io = require("../services/socket");

const uuid = require("uuid/v1");
const { groupBy } = require("lodash");

async function getAllComments(feed, queryParams = {}) {
  const pageSize = parseInt(queryParams.page_size || 15, 10);
  const pageNumber = parseInt(queryParams.page_number || 1, 10);

  const comments = await Comment.find({ _feed: feed })
    .sort({ createdAt: -1 })
    .skip(pageSize * (pageNumber - 1))
    .limit(pageSize);

  const mappedComments = comments.map(({ comment, _owner, _feed, _parentCommentUid, uid, createdAt }) => {
    return {
      comment,
      owner: _owner,
      feed: _feed.uid,
      uid,
      parentCommentUid: _parentCommentUid,
      createdAt
    };
  });

  return mappedComments;
}
async function getAllCommentsWithVotes(comments) {
  const populateComments = [
    {
      $lookup: {
        from: "comments",
        localField: "_comment",
        foreignField: "_id",
        as: "_comment"
      }
    },
    { $unwind: "$_comment" }
  ];

  const projectComments = [
    {
      $project: {
        _id: 0,
        value: 1,
        _voter: 1,
        votedOn: 1,
        _comment: "$_comment.uid"
      }
    }
  ];

  const votes = await Vote.aggregate([...populateComments, ...projectComments]);

  comments.forEach(comment => {
    comment.votes = votes.filter(vote => vote._comment === comment.uid);
  });

  return comments;
}

module.exports = {
  createCommentOrReply: async (req, res) => {
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
    if (res.locals.comment) {
      comment._parentCommentUid = req.params.commentUID;
    }
    await comment.save();
    io.getIO().emit("comments", { action: "create", comment });
    return res.json({ success: true, message: "Comment posted!" });
  },
  getComments: async (req, res) => {
    const feed = res.locals.feed;
    const comments = await getAllComments(feed, req.query);
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
