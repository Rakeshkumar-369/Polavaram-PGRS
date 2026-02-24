const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all active units
router.get("/", (req, res) => {
  const sql = `
    SELECT id, name
    FROM units
    WHERE is_active = 1
    ORDER BY name
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

module.exports = router;
