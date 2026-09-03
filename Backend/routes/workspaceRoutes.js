const express = require("express");
const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
} = require("../controllers/workspaceController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getWorkspaces);
router.get("/:id", getWorkspaceById);

router.post("/", protect, authorize("owner", "admin"), createWorkspace);
router.put("/:id", protect, authorize("owner", "admin"), updateWorkspace);
router.delete("/:id", protect, authorize("owner", "admin"), deleteWorkspace);

module.exports = router;