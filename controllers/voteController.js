const { Vote } = require("../models/vote");
const uuid = require("uuid/v1");

module.exports = {
  vote: async (req, res, next) => {
    const comment = res.locals.comment;

    let vote = await Vote.findOne({ $and: [{ _comment: comment }, { "_voter.uid": req.user.uid }] });

    const { value } = req.body;

    if (vote) {
      vote.value = value;
    } else {
      vote = new Vote({
        value,
        _voter: { ...req.user },
        _comment: comment
      });
    }

    await vote.save();
    return res.json({ success: true, message: "Thanks for your vote!" });
  },
  getAllVotersByComment: async (req, res, next) => {}
};
