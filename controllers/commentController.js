const { Comment, validate } = require("../models/comment");
const { Vote } = require("../models/vote");
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
    return res.json({ success: true, message: "Comment posted!" });
  },
  getComments: async (req, res) => {
    const feed = res.locals.feed;
    const comments = await getAllComments(feed);
    const commentsWithVotes = await getAllCommentsWithVotes(comments);

    const vote1Arr = [];
    const vote2Arr = [];

    const groupByVotes = commentsWithVotes.map(comment => {
      const grouped = groupBy(comment.votes, "value");
      comment.votes = { ...grouped };

      if (Object.keys(comment.votes).length > 0) {
        vote1Arr.push(...comment.votes["1"].map(v => v._voter));
        vote2Arr.push(...comment.votes["-1"].map(v => v._voter));
        comment.votes["1"] = vote1Arr;
        comment.votes["-1"] = vote2Arr;
      }

      // for (let vote in comment.votes) {
      //   const voterArr = [];
      //   voterArr.push(...comment.votes[vote].map(v => v._voter));
      //   comment.votes[vote] = voterArr;
      // }

      return comment;
    });

    return res.json(groupByVotes);
  },
  getAllComments,
  getAllCommentsWithVotes
};
