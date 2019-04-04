const { Feed } = require("../models/feed");
const { checkReadWriteConflict } = require("../middlewares/feedMiddleware");

const uuid = require("uuid/v1");
const { uniqBy, uniq } = require("lodash");

function parseFeed(feed) {
  ({ data, uid, owner, description, readUsers, writeUsers, createdAt, labelsRead, labelsWrite, properties, _appUid, _element } = feed);
  const newFeed = { data, uid, owner, description, readUsers, writeUsers, createdAt, labelsRead, labelsWrite, properties, _appUid, _element };
  return newFeed;
}

function addReadAndWriteUsers(resource, readUsers, writeUsers) {
  resource.readUsers.push(...uniqBy(readUsers, userObj => userObj.uid));
  resource.writeUsers.push(...uniqBy(writeUsers, userObj => userObj.uid));

  resource.readUsers = uniqBy(resource.readUsers, userObj => userObj.uid);
  resource.writeUsers = uniqBy(resource.writeUsers, userObj => userObj.uid);

  return resource;
}

function addReadWriteLabels(resource, labelsRead, labelsWrite) {
  resource.labelsRead.push(...uniq(labelsRead));
  resource.labelsWrite.push(...uniq(labelsWrite));

  resource.labelsRead = uniq(resource.labelsRead);
  resource.labelsWrite = uniq(resource.labelsWrite);

  return resource;
}

module.exports = {
  test: async (req, res) => {
    return res.json({ success: true, message: "Working" });
  },
  createOrUpdateFeed: async (req, res) => {
    let feed;
    const { name, description, _element, _appUid, data, readUsers, writeUsers, properties, labelsRead, labelsWrite } = req.body;

    if (req.method === "PUT") {
      feed = res.locals.feed;
      feed.name = name ? name : feed.name;
      feed.description = description ? description : feed.description;
      feed._element = _element ? _element : feed._element;
      feed._appUid = _appUid ? _appUid : feed._appUid;
      feed.data = data ? data : feed._data;
      feed.properties = properties ? properties : feed.properties;
      feed.labelsRead = labelsRead ? [...labelsRead] : feed.labelsRead;
      feed.labelsWrite = labelsWrite ? [...labelsWrite] : feed.labelsWrite;
    } else {
      const owner = {
        uid: req.user.uid,
        email: req.user.email
      };

      feed = new Feed({
        name,
        uid: uuid(),
        owner,
        description,
        _appUid,
        _element,
        data,
        properties
      });

      feed = addReadAndWriteUsers(feed, readUsers, writeUsers);
      feed = addReadWriteLabels(feed, labelsRead, labelsWrite);
    }
    await feed.save();

    return res.json({
      success: true,
      message: `Successfully ${req.method === "PUT" ? "updated" : "created"} the feed`
    });
  },
  attachDataToFeed: async (req, res) => {
    const feed = res.locals.feed;
    feed.data.push(req.body.data);
    await feed.save();
    return res.json({
      success: true,
      message: "Successfully attached data!"
    });
  },
  addUserToFeed: async (req, res) => {
    let feed = res.locals.feed;

    let { readUsers, writeUsers } = req.body;

    if (checkReadWriteConflict(readUsers, writeUsers)) return res.json({ error: true, message: "Read and write users are conflicting!" });

    feed = addReadAndWriteUsers(feed, readUsers, writeUsers);

    await feed.save();

    return res.json({
      message: "Successfully added users to Feed"
    });
  },
  getAllFeeds: async (req, res) => {
    const feeds = await Feed.find();
    return res.json(feeds);
  },
  getFeedByUID: (req, res) => {
    let feed = res.locals.feed;

    ({ data, uid, owner, description, readUsers, writeUsers, createdAt, labelsRead, labelsWrite } = feed);
    const newFeed = { data, uid, owner, description, readUsers, writeUsers, createdAt, labelsRead, labelsWrite };
    return res.json(newFeed);
  },
  getFeedForElement: async (req, res) => {
    const feed = await Feed.findOne({ _element: req.params.elementUid });
    return res.json(parseFeed(feed));
  }
};
