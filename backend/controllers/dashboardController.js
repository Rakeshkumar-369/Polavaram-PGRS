const db = require("../config/db");

exports.getDashboardData = (req, res) => {
  const { role, id: userId } = req.user;

  let whereClause = "";
  let params = [];

  // Role-based filtering
  if (role === "DATA_ENTRY") {
    whereClause = "WHERE created_by = ?";
    params.push(userId);
  } else if (role === "OFFICER") {
    whereClause = "WHERE assigned_to = ?";
    params.push(userId);
  }
  // COMMISSIONER → sees everything (no WHERE)

  const totalSql = `
    SELECT COUNT(*) AS total
    FROM grievances
    ${whereClause}
  `;

  const statusSql = `
    SELECT status, COUNT(*) AS count
    FROM grievances
    ${whereClause}
    GROUP BY status
  `;

  const prioritySql = `
    SELECT priority, COUNT(*) AS count
    FROM grievances
    ${whereClause}
    GROUP BY priority
  `;

  db.query(totalSql, params, (err, totalResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    db.query(statusSql, params, (err, statusResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      db.query(prioritySql, params, (err, priorityResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error" });
        }

        res.json({
          total: totalResult[0].total,
          statusCounts: statusResult,
          priorityCounts: priorityResult,
        });
      });
    });
  });
};
