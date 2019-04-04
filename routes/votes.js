const router = require("express").Router(),
  { verifyToken, isActive, hasRoles } = require("../middlewares/userMiddleware"),
  { validateComment } = require("../middlewares/commentMiddleware"),
  { vote } = require("../controllers/voteController");

router.use(verifyToken);
router.use(isActive);

router.post("/:commentUID", validateComment, vote);

module.exports = router;
