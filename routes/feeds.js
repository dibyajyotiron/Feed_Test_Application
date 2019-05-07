const router = require("express").Router(),
  { verifyToken, isActive, hasRoles, checkPermission } = require("../middlewares/userMiddleware"),
  { validateFeedInComment, validateFeedInElement, validateFeed } = require("../middlewares/feedMiddleware"),
  { validateComment } = require("../middlewares/commentMiddleware"),
  { validateReqBody } = require("../middlewares/generic"),
  { validateFeedSchema, validateCommentSchema } = require("../models/joiSchema"),
  { ALLOWED_ROLES } = require("../constants"),
  { createOrUpdateOrDeleteFeed, getFeedByUID, addUserToFeed, getAllFeeds, getFeedForElement } = require("../controllers/feedController"),
  { vote } = require("../controllers/voteController"),
  { getComments, createCommentOrReply } = require("../controllers/commentController");

router.use(verifyToken);
router.use(isActive);

// create a feed
router.post("/", validateReqBody(validateFeedSchema), createOrUpdateOrDeleteFeed);

// get all feeds
router.get("/", hasRoles(ALLOWED_ROLES), getAllFeeds);

// update a feed
router.put("/:uid", validateFeed, checkPermission("feed", "write"), createOrUpdateOrDeleteFeed);

// delete a feed
router.delete("/:uid", validateFeed, hasRoles(ALLOWED_ROLES), checkPermission("feed", "owner"), createOrUpdateOrDeleteFeed);

// get a particular feed
router.get("/:uid", validateFeed, checkPermission("feed", "read"), getFeedByUID);

// get a feed by elementUid
router.get("/elements/:elementUid", validateFeedInElement, getFeedForElement);

// add users to a feed
router.post("/:uid", validateFeed, checkPermission("feed", "write"), addUserToFeed);

// get comments for a feed
router.get("/:uid/comments", validateFeed, checkPermission("feed", "read"), getComments);

// create a comment
router.post("/:uid/comments/", validateFeed, checkPermission("feed", "read"), validateReqBody(validateCommentSchema), createCommentOrReply);

// reply to a comment
router.post(
  "/:uid/comments/:commentUID",
  validateFeed,
  checkPermission("feed", "read"),
  validateComment,
  validateFeedInComment,
  validateReqBody(validateCommentSchema),
  createCommentOrReply
);

// vote a comment
router.post("/:uid/comments/:commentUID/vote", validateFeed, checkPermission("feed", "read"), validateComment, validateFeedInComment, vote);

module.exports = router;
