const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const sql = "SELECT * FROM officers WHERE email = ? AND is_active = TRUE";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const officer = results[0];

    const isMatch = await bcrypt.compare(password, officer.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ NEW JWT PAYLOAD
    const payload = {
      id: officer.id,
      name: officer.name,
      role: officer.role,
      wing_id: officer.wing_id,
      designation_id: officer.designation_id,
      district_id: officer.district_id,
      unit_id: officer.unit_id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({
      message: "Login successful",
      token,
      user: payload,
    });
  });
};
