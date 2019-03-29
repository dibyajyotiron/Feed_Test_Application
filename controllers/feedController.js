const { Feed, validate } = require("../models/feed");
const uuid = require("uuid/v1");

const { isEqual, uniqBy } = require("lodash");

module.exports = {
  test: async (req, res) => {
    return res.json({ success: true, message: "Working" });
  },
  createFeed: async (req, res) => {
    const { name, description, _element, data, readUsers, writeUsers } = req.body;

    const owner = {
      uid: req.user.uid,
      email: req.user.email
    };

    const feed = new Feed({
      name,
      uid: uuid(),
      owner,
      description,
      _element,
      data,
      readUsers,
      writeUsers
    });
    await feed.save();
    return res.json({
      success: true,
      message: "Successfully created feed!"
    });
  },
  addUserToFeed: async (req, res) => {
    const feed = res.locals.feed;

    let { readUsers, writeUsers } = req.body;

    if (isEqual(readUsers, writeUsers)) return res.json({ error: true, message: "Read and write users are same!" });

    feed.readUsers.push(...uniqBy(readUsers, user => user.uid));
    feed.writeUsers.push(...uniqBy(writeUsers, user => user.uid));

    feed.readUsers = uniqBy(feed.readUsers, user => user.uid);
    feed.writeUsers = uniqBy(feed.writeUsers, user => user.uid);

    await feed.save();
    return res.json({
      message: "Successfully added users to Feed"
    });
  },
  getAllFeeds: async (req, res) => {
    const feeds = await Feed.find();
    res.json(feeds);
  },
  getFeedByUID: async (req, res) => {
    const feed = res.locals.feed;
    res.json(feed);
  }
};
