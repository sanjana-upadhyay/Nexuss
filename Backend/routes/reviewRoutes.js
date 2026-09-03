const express = require("express");
const {
  createReview,
  getWorkspaceReviews,
  replyToReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createReview);
router.get("/workspace/:workspaceId", getWorkspaceReviews);
router.put("/:id/reply", protect, replyToReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;