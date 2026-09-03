const Workspace = require("../models/Workspace");

// @desc  Create new workspace
// @route POST /api/workspaces
// @access Owner/Admin
const createWorkspace = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      city,
      locality,
      address,
      location,
      price,
      seatsAvailable,
      areaSqft,
      floor,
      leaseTerm,
      amenities,
      images,
    } = req.body;

    const workspace = await Workspace.create({
      name,
      type,
      description,
      city,
      locality,
      address,
      location,
      price,
      seatsAvailable,
      areaSqft,
      floor,
      leaseTerm,
      amenities,
      images,
      owner: req.user._id,
    });

    res.status(201).json(workspace);
  } catch (error) {
    console.error("❌ CREATE WORKSPACE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all workspaces (with basic search/filter)
// @route GET /api/workspaces
// @access Public
const getWorkspaces = async (req, res) => {
  try {
    const { city, name, type, minPrice, maxPrice, wifi, parking, ac, meetingRoom, cafeteria } = req.query;

    let filter = {};

    if (city) filter.city = { $regex: city, $options: "i" };
    if (name) filter.name = { $regex: name, $options: "i" };
    if (type) filter.type = type;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (wifi) filter["amenities.wifi"] = wifi === "true";
    if (parking) filter["amenities.parking"] = parking === "true";
    if (ac) filter["amenities.ac"] = ac === "true";
    if (meetingRoom) filter["amenities.meetingRoom"] = meetingRoom === "true";
    if (cafeteria) filter["amenities.cafeteria"] = cafeteria === "true";

    const workspaces = await Workspace.find(filter).populate("owner", "name email");

    res.json(workspaces);
  } catch (error) {
    console.error("❌ GET WORKSPACES ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single workspace by ID
// @route GET /api/workspaces/:id
// @access Public
const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate("owner", "name email");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json(workspace);
  } catch (error) {
    console.error("❌ GET WORKSPACE BY ID ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update workspace
// @route PUT /api/workspaces/:id
// @access Owner (own workspace) / Admin
const updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this workspace" });
    }

    const updatedFields = req.body;

    Object.assign(workspace, updatedFields);

    const updatedWorkspace = await workspace.save();

    res.json(updatedWorkspace);
  } catch (error) {
    console.error("❌ UPDATE WORKSPACE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete workspace
// @route DELETE /api/workspaces/:id
// @access Owner (own workspace) / Admin
const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this workspace" });
    }

    await workspace.deleteOne();

    res.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE WORKSPACE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
};