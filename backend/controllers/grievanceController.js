const db = require("../config/db");

// ================= CREATE GRIEVANCE =================
exports.createGrievance = (req, res) => {
  const {
    name,
    aadhaar,
    fatherName,
    mobile,
    category,
    priority,
    description,
    issue_type_id,
    relation_type,
    relative_name,
    beneficiary_type,
    age,
    caste,
    occupation
  } = req.body;

  const { 
    id: userId, 
    wing_id, 
    designation_id, 
    district_id, 
    unit_id: userUnit 
  } = req.user;

  const unit_id = req.body.unit_id || userUnit;

  if (!name || !aadhaar || !fatherName || !mobile || !category || !priority || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!/^\d{12}$/.test(aadhaar)) {
    return res.status(400).json({ message: "Invalid Aadhaar number" });
  }

  // 👉 Get creator level
  const levelSql = "SELECT level_number FROM designations WHERE id = ?";

  db.query(levelSql, [designation_id], (err, levelResult) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!levelResult.length) return res.status(400).json({ message: "Designation not found" });

    const creatorLevel = levelResult[0].level_number;

    // 👉 SELF ASSIGN (critical change)
    const insertSql = `
      INSERT INTO grievances
      (
        name, aadhaar, father_name, relation_type, relative_name, mobile,
        category, priority, description, beneficiary_type, age, caste, occupation,
        created_by, assigned_to, designation_level, wing_id, unit_id, district_id, issue_type_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [
        name,
        aadhaar,
        fatherName,
        relation_type || null,
        relative_name || null,
        mobile,
        category,
        priority,
        description,
        beneficiary_type || null,
        age || null,
        caste || null,
        occupation || null,
        userId,
        userId,           // ✔ SELF ASSIGN
        creatorLevel,     // ✔ CREATOR LEVEL
        wing_id,
        unit_id || null,
        district_id || null,
        issue_type_id || null,
      ],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });

        res.status(201).json({
          message: "Grievance created successfully",
          id: result.insertId,
        });
      }
    );
  });
};


// ================= GET ALL =================
exports.getAllGrievances = (req, res) => {
  const { role, id } = req.user;

  let sql = "";
  let values = [];

  if (role === "DATA_ENTRY") {
    sql = "SELECT * FROM grievances WHERE created_by = ? ORDER BY created_at DESC";
    values = [id];
  } else if (role === "OFFICER") {
    sql = "SELECT * FROM grievances WHERE assigned_to = ? ORDER BY created_at DESC";
    values = [id];
  } else if (role === "COMMISSIONER") {
    sql = "SELECT * FROM grievances ORDER BY created_at DESC";
  } else {
    return res.status(403).json({ message: "Unauthorized role" });
  }

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
};

// ================= UPDATE STATUS =================
exports.updateGrievanceStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { role, id: userId } = req.user;

  const validStatuses = [
    "Registered",
    "In Progress",
    "Redressed",
    "Reopened",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const getSql = "SELECT status, assigned_to FROM grievances WHERE id = ?";

  db.query(getSql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    const grievance = results[0];

    if (role === "OFFICER" && grievance.assigned_to !== userId) {
      return res.status(403).json({ message: "You are not assigned to this grievance." });
    }

    const oldStatus = grievance.status;

    const updateSql = "UPDATE grievances SET status = ? WHERE id = ?";

    db.query(updateSql, [status, id], (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      insertAudit(id, oldStatus, status, res);
    });
  });
};

// ================= FORWARD GRIEVANCE =================
exports.forwardGrievance = (req, res) => {
  const { id } = req.params;
  const { officer_id } = req.body;   // ✔ selected officer
  const { id: userId } = req.user;

  if (!officer_id) {
    return res.status(400).json({ message: "Target officer required" });
  }

  // Step 1 — Get grievance
  const getSql = `
    SELECT assigned_to, wing_id
    FROM grievances
    WHERE id = ?
  `;

  db.query(getSql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (!results.length) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    const grievance = results[0];

    // Step 2 — Ownership validation
    if (grievance.assigned_to !== userId) {
      return res.status(403).json({
        message: "You are not assigned to this grievance.",
      });
    }

    // Step 3 — Validate target officer + get level
    const officerSql = `
      SELECT designation_id, wing_id
      FROM officers
      WHERE id = ? AND is_active = TRUE
    `;

    db.query(officerSql, [officer_id], (err, officerResult) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (!officerResult.length) {
        return res.status(400).json({ message: "Invalid officer" });
      }

      const target = officerResult[0];

      // ✔ same wing validation
      if (target.wing_id !== grievance.wing_id) {
        return res.status(400).json({
          message: "Cannot forward across wings",
        });
      }

      // Step 4 — get designation level
      const levelSql = `
        SELECT level_number
        FROM designations
        WHERE id = ?
      `;

      db.query(levelSql, [target.designation_id], (err, levelResult) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (!levelResult.length) {
          return res.status(400).json({ message: "Designation not found" });
        }

        const targetLevel = levelResult[0].level_number;

        // Step 5 — Update grievance
        const updateSql = `
          UPDATE grievances
          SET assigned_to = ?, designation_level = ?
          WHERE id = ?
        `;

        db.query(updateSql, [officer_id, targetLevel, id], (err) => {
          if (err) return res.status(500).json({ message: "Database error" });

          res.json({ message: "Grievance forwarded successfully" });
        });
      });
    });
  });
};

// ================= FORWARD OPTIONS =================
exports.getForwardOptions = (req, res) => {
  const { id } = req.params;

  const grievanceSql = `
    SELECT wing_id
    FROM grievances
    WHERE id = ?
  `;

  db.query(grievanceSql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!result.length) return res.status(404).json({ message: "Not found" });

    const wingId = result[0].wing_id;

    const officerSql = `
      SELECT o.id, o.name, d.name AS designation
      FROM officers o
      JOIN designations d ON o.designation_id = d.id
      WHERE o.wing_id = ?
      AND o.is_active = TRUE
      ORDER BY d.level_number
    `;

    db.query(officerSql, [wingId], (err, officers) => {
      if (err) return res.status(500).json({ message: "Database error" });

      res.json(officers);
    });
  });
};

// ================= AUDIT =================
function insertAudit(id, oldStatus, newStatus, res) {
  const auditSql = `
    INSERT INTO grievance_audit
    (grievance_id, old_status, new_status)
    VALUES (?, ?, ?)
  `;

  db.query(auditSql, [id, oldStatus, newStatus], (err) => {
    if (err) console.error("Audit insert failed:", err);
    res.json({ message: "Status updated successfully" });
  });
}

// ================= GET BY ID =================
exports.getGrievanceById = (req, res) => {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  const grievanceSql = `
    SELECT g.*,
           o1.name AS created_by_name,
           o2.name AS assigned_to_name
    FROM grievances g
    LEFT JOIN officers o1 ON g.created_by = o1.id
    LEFT JOIN officers o2 ON g.assigned_to = o2.id
    WHERE g.id = ?
  `;

  db.query(grievanceSql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    const grievance = results[0];

    if (role === "OFFICER" && grievance.assigned_to !== userId) {
      return res.status(403).json({ message: "Access denied." });
    }

    const auditSql = `
      SELECT old_status, new_status, changed_at
      FROM grievance_audit
      WHERE grievance_id = ?
      ORDER BY changed_at DESC
    `;

    db.query(auditSql, [id], (err, auditResults) => {
      if (err) return res.status(500).json({ message: "Database error" });

      res.json({
        grievance,
        auditTrail: auditResults,
      });
    });
  });
};
