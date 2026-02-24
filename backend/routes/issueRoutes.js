const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

// Get issue types based on wing
router.get("/", verifyToken, (req, res) => {
  const { wing_id } = req.user;

  const sql = `
    SELECT id, name
    FROM issue_types
    WHERE wing_id = ? AND is_active = TRUE
    ORDER BY name
  `;

  db.query(sql, [wing_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
});

module.exports = router;
