const router = require("express").Router(),
  { verifyToken, isActive, hasRoles } = require("../middlewares/userMiddleware"),
  { validateFeedBody, validateFeed, checkFeedOwnerOrWritePerm } = require("../middlewares/feedMiddleware"),
  { ALLOWED_ROLES } = require("../constants"),
  { createFeed, getFeedByUID, addUserToFeed, getAllFeeds } = require("../controllers/feedController");

router.use(verifyToken);
router.use(isActive);

router.get("/", hasRoles(ALLOWED_ROLES), getAllFeeds);
router.post("/", hasRoles(ALLOWED_ROLES), validateFeedBody, createFeed);

router.get("/:uid", hasRoles(ALLOWED_ROLES), validateFeed, getFeedByUID);
router.post("/:uid", hasRoles(ALLOWED_ROLES), validateFeed, checkFeedOwnerOrWritePerm, addUserToFeed);

module.exports = router;
