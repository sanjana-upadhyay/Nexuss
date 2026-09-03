const Wishlist = require("../models/Wishlist");

// @desc  Add workspace to wishlist
// @route POST /api/wishlist
// @access Private
const addToWishlist = async (req, res) => {
  try {
    const { workspaceId } = req.body;

    const exists = await Wishlist.findOne({
      user: req.user._id,
      workspace: workspaceId,
    });

    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const item = await Wishlist.create({
      user: req.user._id,
      workspace: workspaceId,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("❌ ADD WISHLIST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get my wishlist
// @route GET /api/wishlist
// @access Private
const getMyWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user._id }).populate(
      "workspace"
    );

    res.json(wishlist);
  } catch (error) {
    console.error("❌ GET WISHLIST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Remove from wishlist
// @route DELETE /api/wishlist/:workspaceId
// @access Private
const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      user: req.user._id,
      workspace: req.params.workspaceId,
    });

    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("❌ REMOVE WISHLIST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addToWishlist, getMyWishlist, removeFromWishlist };