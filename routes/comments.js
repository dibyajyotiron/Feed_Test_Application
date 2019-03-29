const router = require("express").Router(),
  { verifyToken, isActive, hasRoles } = require("../middlewares/userMiddleware"),
  { validateCommentBody, validateComment } = require("../middlewares/commentMiddleware"),
  { validateFeed } = require("../middlewares/feedMiddleware"),
  { ALLOWED_ROLES } = require("../constants"),
  { postComment, getComments } = require("../controllers/commentController");

router.use(verifyToken);
router.use(isActive);

router.get("/:uid", hasRoles(ALLOWED_ROLES), validateFeed, getComments);
router.post("/:uid", hasRoles(ALLOWED_ROLES), validateFeed, validateComment, validateCommentBody, postComment);

module.exports = router;
