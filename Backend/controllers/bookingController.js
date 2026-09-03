const Booking = require("../models/Booking");
const Workspace = require("../models/Workspace");

// Helper: check if two time ranges overlap
const timesOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

// @desc  Create new booking
// @route POST /api/bookings
// @access Private (logged-in user)
const createBooking = async (req, res) => {
  try {
    const { workspaceId, date, endDate, startTime, endTime, seatsBooked } = req.body;

    if (startTime >= endTime) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (seatsBooked > workspace.seatsAvailable) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Build the list of dates to book (1 date if single-day, or a range if multi-day)
    const startDate = new Date(date);
    const finalDate = endDate ? new Date(endDate) : startDate;

    if (finalDate < startDate) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const dateList = [];
    const cursor = new Date(startDate);
    while (cursor <= finalDate) {
      dateList.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    if (dateList.length > 30) {
      return res.status(400).json({ message: "Bookings longer than 30 days are not supported yet" });
    }

    // Check availability for every day in the range
    for (const d of dateList) {
      const existingBookings = await Booking.find({
        workspace: workspaceId,
        date: d,
        status: { $ne: "cancelled" },
      });

      const overlappingSeats = existingBookings
        .filter((b) => timesOverlap(startTime, endTime, b.startTime, b.endTime))
        .reduce((sum, b) => sum + b.seatsBooked, 0);

      if (overlappingSeats + Number(seatsBooked) > workspace.seatsAvailable) {
        const remaining = workspace.seatsAvailable - overlappingSeats;
        return res.status(409).json({
          message:
            remaining > 0
              ? `Only ${remaining} seat(s) available on ${d.toDateString()}`
              : `Fully booked on ${d.toDateString()}. Please choose different dates or time.`,
        });
      }
    }

    const numberOfDays = dateList.length;
    const totalPrice = workspace.price * seatsBooked * numberOfDays;

    const booking = await Booking.create({
      user: req.user._id,
      workspace: workspaceId,
      date: startDate,
      endDate: numberOfDays > 1 ? finalDate : undefined,
      numberOfDays,
      startTime,
      endTime,
      seatsBooked,
      totalPrice,
    });

    const populated = await booking.populate("workspace", "name city price images owner");

    res.status(201).json(populated);
  } catch (error) {
    console.error("❌ CREATE BOOKING ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Check availability for a workspace on a given date/time
// @route GET /api/bookings/availability/:workspaceId?date=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM
// @access Public
const checkAvailability = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { date, startTime, endTime } = req.query;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (!date || !startTime || !endTime) {
      return res.json({ availableSeats: workspace.seatsAvailable });
    }

    const existingBookings = await Booking.find({
      workspace: workspaceId,
      date: new Date(date),
      status: { $ne: "cancelled" },
    });

    const overlappingSeats = existingBookings
      .filter((b) => timesOverlap(startTime, endTime, b.startTime, b.endTime))
      .reduce((sum, b) => sum + b.seatsBooked, 0);

    res.json({
      availableSeats: Math.max(0, workspace.seatsAvailable - overlappingSeats),
      totalSeats: workspace.seatsAvailable,
    });
  } catch (error) {
    console.error("❌ CHECK AVAILABILITY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get logged-in user's bookings
// @route GET /api/bookings/my
// @access Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("workspace", "name city price images")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("❌ GET MY BOOKINGS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single booking by ID
// @route GET /api/bookings/:id
// @access Private (owner of booking or admin)
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "workspace",
      "name city price images owner"
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this booking" });
    }

    res.json(booking);
  } catch (error) {
    console.error("❌ GET BOOKING BY ID ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Cancel booking
// @route PUT /api/bookings/:id/cancel
// @access Private (owner of booking or admin)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Cancellation policy: free cancellation up to 24 hours before the booking date+time
    const bookingDateTime = new Date(booking.date);
    const [hours, minutes] = booking.startTime.split(":").map(Number);
    bookingDateTime.setHours(hours, minutes, 0, 0);

    const hoursUntilBooking = (bookingDateTime - new Date()) / (1000 * 60 * 60);
    const isFreeCancellation = hoursUntilBooking >= 24;

    booking.status = "cancelled";
    await booking.save();

    res.json({
      message: isFreeCancellation
        ? "Booking cancelled — full refund applies (cancelled more than 24hrs in advance)."
        : "Booking cancelled. Note: this was within 24hrs of the booking time, so a cancellation fee may apply as per policy.",
      isFreeCancellation,
      booking,
    });
  } catch (error) {
    console.error("❌ CANCEL BOOKING ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all bookings for a specific workspace (owner view)
// @route GET /api/bookings/workspace/:workspaceId
// @access Private (workspace owner or admin)
const getWorkspaceBookings = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view these bookings" });
    }

    const bookings = await Booking.find({ workspace: req.params.workspaceId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("❌ GET WORKSPACE BOOKINGS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
// @desc  Get analytics for owner's workspaces
// @route GET /api/bookings/analytics
// @access Private (Owner/Admin)
const getOwnerAnalytics = async (req, res) => {
  try {
    const myWorkspaces = await Workspace.find(
      req.user.role === "admin" ? {} : { owner: req.user._id }
    ).select("_id");

    const workspaceIds = myWorkspaces.map((w) => w._id);

    const bookings = await Booking.find({
      workspace: { $in: workspaceIds },
      status: { $ne: "cancelled" },
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalBookings = bookings.length;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthBookings = bookings.filter((b) => b.createdAt >= startOfMonth);
    const thisMonthRevenue = thisMonthBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    res.json({
      totalRevenue,
      totalBookings,
      totalWorkspaces: workspaceIds.length,
      thisMonthBookings: thisMonthBookings.length,
      thisMonthRevenue,
    });
  } catch (error) {
    console.error("❌ GET ANALYTICS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  checkAvailability,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getWorkspaceBookings,
  getOwnerAnalytics,
};