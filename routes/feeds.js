const router = require("express").Router(),
  { verifyToken, isActive, hasRoles, checkPermission } = require("../middlewares/userMiddleware"),
  { validateFeedBody, validateFeed, validateFeedInComment } = require("../middlewares/feedMiddleware"),
  { validateComment, validateCommentBody } = require("../middlewares/commentMiddleware"),
  { ALLOWED_ROLES } = require("../constants"),
  { createOrUpdateFeed, getFeedByUID, addUserToFeed, getAllFeeds, getFeedForElement } = require("../controllers/feedController"),
  { vote } = require("../controllers/voteController"),
  { getComments, createCommentOrReply } = require("../controllers/commentController");

router.use(verifyToken);
router.use(isActive);

// get all feeds
router.get("/", hasRoles(ALLOWED_ROLES), getAllFeeds);

// create a feed
router.post("/", validateFeedBody, createOrUpdateFeed);

// update a feed
router.put("/:uid", validateFeed, checkPermission("feed", "write"), createOrUpdateFeed);

// get a particular feed
router.get("/:uid", validateFeed, checkPermission("feed", "read"), getFeedByUID);

// get a feed by elementUid
router.get("/elements/:elementUid", getFeedForElement);

// add users to a feed
router.post("/:uid", validateFeed, checkPermission("feed", "write"), addUserToFeed);

// get comments for a feed
router.get("/:uid/comments", validateFeed, checkPermission("feed", "read"), getComments);

// create a comment
router.post("/:uid/comments/", validateFeed, checkPermission("feed", "read"), validateCommentBody, createCommentOrReply);

// reply to a comment
router.post(
  "/:uid/comments/:commentUID",
  validateFeed,
  checkPermission("feed", "read"),
  validateComment,
  validateFeedInComment,
  validateCommentBody,
  createCommentOrReply
);

// vote a comment
router.post("/:uid/comments/:commentUID/vote", validateFeed, checkPermission("feed", "read"), validateComment, validateFeedInComment, vote);

module.exports = router;
