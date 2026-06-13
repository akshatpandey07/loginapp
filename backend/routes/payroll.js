const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Attendance Summary - Present/Absent/Late count
router.get("/attendance-summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM attendance
      GROUP BY status
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// All attendance records
router.get("/attendance", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, u.name as employee_name
      FROM attendance a
      INNER JOIN employee_profiles ep ON a.employee_id = ep.id
      INNER JOIN users u ON ep.user_id = u.id
      ORDER BY a.attendance_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Mark Attendance
router.post("/attendance", async (req, res) => {
  try {
    const { employee_id, attendance_date, status, work_mode } = req.body;
    const result = await pool.query(
      `INSERT INTO attendance(employee_id, attendance_date, status, work_mode)
       VALUES($1,$2,$3,$4) RETURNING *`,
      [employee_id, attendance_date, status, work_mode]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// All payroll records with employee + department info
router.get("/payroll", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name as employee_name, d.department_name
      FROM payroll p
      INNER JOIN employee_profiles ep ON p.employee_id = ep.id
      INNER JOIN users u ON ep.user_id = u.id
      INNER JOIN departments d ON ep.department_id = d.id
      ORDER BY p.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Department-wise average salary
router.get("/department-salary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.department_name, ROUND(AVG(p.net_salary)) as avg_salary
      FROM payroll p
      INNER JOIN employee_profiles ep ON p.employee_id = ep.id
      INNER JOIN departments d ON ep.department_id = d.id
      GROUP BY d.department_name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Leave status summary
router.get("/leave-summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM leave_applications
      GROUP BY status
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Asset allocation summary
router.get("/asset-summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM assets
      GROUP BY status
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;