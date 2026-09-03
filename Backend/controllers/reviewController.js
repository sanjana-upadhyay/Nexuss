const Review = require("../models/Review");
const Workspace = require("../models/Workspace");

const updateWorkspaceRating = async (workspaceId) => {
  const reviews = await Review.find({ workspace: workspaceId });
  const numReviews = reviews.length;
  const avgRating =
    numReviews > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews
      : 0;

  await Workspace.findByIdAndUpdate(workspaceId, {
    rating: avgRating.toFixed(1),
    numReviews,
  });
};

// @desc  Create review
// @route POST /api/reviews
// @access Private
const createReview = async (req, res) => {
  try {
    const { workspaceId, rating, comment, images } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      workspace: workspaceId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this workspace" });
    }

    const review = await Review.create({
      user: req.user._id,
      workspace: workspaceId,
      rating,
      comment,
      images,
    });

    await updateWorkspaceRating(workspaceId);

    const populated = await review.populate("user", "name avatar");

    res.status(201).json(populated);
  } catch (error) {
    console.error("❌ CREATE REVIEW ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all reviews for a workspace
// @route GET /api/reviews/workspace/:workspaceId
// @access Public
const getWorkspaceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ workspace: req.params.workspaceId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("❌ GET REVIEWS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Reply to a review (workspace owner or admin only)
// @route PUT /api/reviews/:id/reply
// @access Private
const replyToReview = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const review = await Review.findById(req.params.id).populate("workspace");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const workspace = review.workspace;

    if (
      workspace.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to reply to this review" });
    }

    review.ownerReply = { text: text.trim(), repliedAt: new Date() };
    await review.save();

    const populated = await Review.findById(review._id).populate("user", "name avatar");

    res.json(populated);
  } catch (error) {
    console.error("❌ REPLY REVIEW ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete review
// @route DELETE /api/reviews/:id
// @access Private (owner of review or admin)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    const workspaceId = review.workspace;
    await review.deleteOne();
    await updateWorkspaceRating(workspaceId);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE REVIEW ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getWorkspaceReviews, replyToReview, deleteReview };