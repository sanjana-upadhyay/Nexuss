const express = require("express");
const {
  createBooking,
  checkAvailability,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getWorkspaceBookings,
  getOwnerAnalytics,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/analytics", protect, getOwnerAnalytics);
router.get("/availability/:workspaceId", checkAvailability);
router.get("/workspace/:workspaceId", protect, getWorkspaceBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;