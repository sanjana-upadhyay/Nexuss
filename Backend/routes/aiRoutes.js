const express = require("express");
const {
  generateDescription,
  summarizeReviews,
  recommendWorkspaces,
} = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate-description", protect, generateDescription);
router.get("/review-summary/:workspaceId", summarizeReviews);
router.post("/recommend", recommendWorkspaces);

module.exports = router;