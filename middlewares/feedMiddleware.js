const { Feed, validate } = require("../models/feed");
const { isEqual } = require("lodash");
module.exports = {
  validateFeed: async (req, res, next) => {
    const feed = await Feed.findOne({ uid: req.params.uid });
    if (!feed) return res.status(404).json({ error: true, message: "Requested feed doesn't exist!" });
    res.locals.feed = feed;
    return next();
  },
  validateFeedBody: (req, res, next) => {
    const { readUsers, writeUsers } = req.body;

    if (isEqual(readUsers, writeUsers)) return res.status(400).json({ error: true, message: "Read and write users are conflicting!" });

    const { error } = validate(req.body);

    if (error)
      return res.status(400).json({
        error: true,
        message: error.message
      });
    return next();
  },
  checkFeedOwnerOrWritePerm: (req, res, next) => {
    const feed = res.locals.feed;
    const writeUsers = feed.writeUsers.map(user => user.uid);

    if (req.user.uid !== feed.owner.uid || !writeUsers.includes(req.user.uid))
      return res.status(403).json({ error: true, message: "You do not have the necessary permissions!" });
    return next();
  }
};
