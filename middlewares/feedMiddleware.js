const { Feed } = require("../models/feed");
const { validateFeedSchema } = require("../models/joiSchema");

const { intersectionWith } = require("lodash");

function checkReadWriteConflict(readUsers, writeUsers) {
  if (intersectionWith(readUsers, writeUsers, (read, write) => read.uid === write.uid).length) return true;
  return false;
}

module.exports = {
  checkReadWriteConflict,
  async validateFeed(req, res, next) {
    const feed = await Feed.findOne({ uid: req.params.uid });
    if (!feed) return res.status(404).json({ error: true, message: "Requested feed doesn't exist!" });
    res.locals.feed = feed;
    return next();
  },
  validateFeedInComment(req, res, next) {
    const feed = res.locals.feed;
    const comment = res.locals.comment;

    if (JSON.stringify(comment._feed._id) !== JSON.stringify(feed._id))
      return res.status(422).json({
        error: true,
        message: "Comment doesn't belong to the feed"
      });
    return next();
  },

  async validateFeedInElement(req, res, next) {
    const feed = await Feed.findOne({ targetElementUid: req.params.elementUid });

    if (!feed) return res.status(404).json({ error: true, message: "Provide correct element uid!" });
    res.locals.feed = feed;
    return next();
  },

  checkFeedOwnerOrWritePerm(req, res, next) {
    const feed = res.locals.feed;
    const writeUsers = feed.writeUsers.map(user => user.uid);

    if (req.user.uid !== feed.owner.uid && !writeUsers.includes(req.user.uid))
      return res.status(403).json({ error: true, message: "You do not have the necessary permissions!" });
    return next();
  },
  checkFeedReadWrite(req, res, next) {
    const feed = res.locals.feed;
    const readUsers = feed.readUsers.map(user => user.uid);
    const writeUsers = feed.writeUsers.map(user => user.uid);

    if (req.user.uid !== feed.owner.uid && !writeUsers.includes(req.user.uid) && !readUsers.includes(req.user.id))
      return res.status(403).json({ error: true, message: "You do not have the necessary permissions!" });
    return next();
  }
};
