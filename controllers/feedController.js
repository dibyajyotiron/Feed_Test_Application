const { Feed } = require("../models/feed");
const { checkReadWriteConflict } = require("../middlewares/feedMiddleware");

const uuid = require("uuid/v1");
const { uniqBy, uniq } = require("lodash");

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
    const {
      name,
      description,
      _element,
      targetElementType,
      targetElementUid,
      targetElementStage,
      data,
      readUsers,
      writeUsers,
      properties,
      labelsRead,
      labelsWrite
    } = req.body;

    if (req.method === "PUT") {
      feed = res.locals.feed;
      feed.name = name ? name : feed.name;
      feed.description = description ? description : feed.description;
      feed._element = _element ? _element : feed._element;

      feed.data = data ? data : feed.data;
      feed.properties = properties ? properties : feed.properties;
      feed.labelsRead = labelsRead.length ? [...labelsRead] : feed.labelsRead;
      feed.labelsWrite = labelsWrite.length ? [...labelsWrite] : feed.labelsWrite;
      feed.readUsers = readUsers ? readUsers : feed.readUsers;
      feed.writeUsers = writeUsers ? writeUsers : feed.writeUsers;
    } else {
      const owner = { uid: req.user.uid, email: req.user.email };

      feed = new Feed({
        name,
        owner,
        description,
        targetElementType,
        targetElementUid,
        targetElementStage,
        _element,
        data,
        properties
      });

      feed = addReadAndWriteUsers(feed, readUsers, writeUsers);
      feed = addReadWriteLabels(feed, labelsRead, labelsWrite);
    }
    await feed.save(req);

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
    const feed = res.locals.feed.toJSON();
    delete feed._id;
    return res.json(feed);
  }
};
