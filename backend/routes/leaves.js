const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/types", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM leave_types");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post("/apply", async (req, res) => {
  try {
    const { employee_id, leave_type_id, from_date, to_date, total_days, reason } = req.body;
    const result = await pool.query(
      `INSERT INTO leave_applications(employee_id,leave_type_id,from_date,to_date,total_days,reason)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [employee_id, leave_type_id, from_date, to_date, total_days, reason]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT la.*, lt.leave_name, ep.designation,
      u.name as employee_name
      FROM leave_applications la
      INNER JOIN leave_types lt ON la.leave_type_id = lt.id
      INNER JOIN employee_profiles ep ON la.employee_id = ep.id
      INNER JOIN users u ON ep.user_id = u.id
      ORDER BY la.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put("/approve/:id", async (req, res) => {
  try {
    const { action, remarks, approved_by } = req.body;
    await pool.query(
      "UPDATE leave_applications SET status=$1 WHERE id=$2",
      [action, req.params.id]
    );
    await pool.query(
      `INSERT INTO approval_history(leave_id,approved_by,action,remarks)
       VALUES($1,$2,$3,$4)`,
      [req.params.id, approved_by, action, remarks]
    );
    res.json({ message: "Leave updated successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
