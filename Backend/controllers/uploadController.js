// @desc  Upload image(s) to Cloudinary
// @route POST /api/upload
// @access Private
const uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imageUrls = req.files.map((file) => file.path);

    res.status(200).json({ urls: imageUrls });
  } catch (error) {
    console.error("❌ UPLOAD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadImage };