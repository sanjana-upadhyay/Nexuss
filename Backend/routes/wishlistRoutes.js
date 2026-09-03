const express = require("express");
const {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addToWishlist);
router.get("/", protect, getMyWishlist);
router.delete("/:workspaceId", protect, removeFromWishlist);

module.exports = router;