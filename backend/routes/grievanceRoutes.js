const express = require("express");
const router = express.Router();

const {
  createGrievance,
  getAllGrievances,
  updateGrievanceStatus,
  forwardGrievance,
  getGrievanceById,
  getForwardOptions,     // ✔ NEW
} = require("../controllers/grievanceController");

const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

// View grievances
router.get(
  "/",
  verifyToken,
  allowRoles("DATA_ENTRY", "OFFICER", "COMMISSIONER"),
  getAllGrievances
);

// Create grievance
router.post(
  "/",
  verifyToken,
  createGrievance
);

// Get grievance by ID
router.get(
  "/:id",
  verifyToken,
  allowRoles("DATA_ENTRY", "OFFICER", "COMMISSIONER"),
  getGrievanceById
);

// ✔ NEW — Forward dropdown options
router.get(
  "/:id/forward-options",
  verifyToken,
  allowRoles("OFFICER", "COMMISSIONER"),
  getForwardOptions
);

// Update status
router.put(
  "/:id/status",
  verifyToken,
  allowRoles("OFFICER", "COMMISSIONER"),
  updateGrievanceStatus
);

// Forward grievance
router.put(
  "/:id/forward",
  verifyToken,
  allowRoles("OFFICER", "COMMISSIONER"),
  forwardGrievance
);

module.exports = router;