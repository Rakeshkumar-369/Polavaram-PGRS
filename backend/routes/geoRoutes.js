const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ================= DISTRICTS =================
router.get("/districts", (req, res) => {
  db.query("SELECT id,name FROM districts WHERE is_active=1", (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(rows);
  });
});

// ================= MANDALS =================
router.get("/mandals/:districtId", (req, res) => {
  const { districtId } = req.params;

  db.query(
    "SELECT id,name FROM mandals WHERE district_id=? AND is_active=1",
    [districtId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(rows);
    }
  );
});

// ================= VILLAGES =================
router.get("/villages/:mandalId", (req, res) => {
  const { mandalId } = req.params;

  db.query(
    "SELECT id,name FROM villages WHERE mandal_id=? AND is_active=1",
    [mandalId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(rows);
    }
  );
});

// ================= HABITATIONS =================
router.get("/habitations/:villageId", (req, res) => {
  const { villageId } = req.params;

  db.query(
    "SELECT id,name FROM habitations WHERE village_id=? AND is_active=1",
    [villageId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(rows);
    }
  );
});

module.exports = router;