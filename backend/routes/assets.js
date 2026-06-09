const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM assets");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post("/allocate", async (req, res) => {
  try {
    const { asset_id, employee_id, allocated_by, allocated_date } = req.body;
    await pool.query(
      "UPDATE assets SET status='allocated' WHERE id=$1",
      [asset_id]
    );
    const result = await pool.query(
      `INSERT INTO asset_allocations(asset_id,employee_id,allocated_by,allocated_date)
       VALUES($1,$2,$3,$4) RETURNING *`,
      [asset_id, employee_id, allocated_by, allocated_date]
    );
    await pool.query(
      `INSERT INTO notifications(user_id,title,message)
       VALUES($1,$2,$3)`,
      [employee_id, 'Asset Assigned', `Asset has been assigned to you on ${allocated_date}`]
    );
    await pool.query(
      `INSERT INTO audit_logs(table_name,action_type,record_id,new_data,performed_by)
       VALUES($1,$2,$3,$4,$5)`,
      ['assets', 'ALLOCATE', asset_id, JSON.stringify({asset_id, employee_id}), allocated_by]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/notifications/:user_id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC",
      [req.params.user_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/audit", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM audit_logs ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;