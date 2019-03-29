const router = require("express").Router(),
  { verifyToken, isActive, hasRoles } = require("../middlewares/userMiddleware"),
  { validateComment } = require("../middlewares/commentMiddleware"),
  { validateFeed } = require("../middlewares/feedMiddleware"),
  { ALLOWED_ROLES } = require("../constants"),
  { vote, getAllVotersByComment } = require("../controllers/voteController");

router.use(verifyToken);
router.use(isActive);

router.post("/:commentUID", hasRoles(ALLOWED_ROLES), validateComment, vote);
router.get("/:uid", hasRoles(ALLOWED_ROLES), validateFeed, getAllVotersByComment);

module.exports = router;
