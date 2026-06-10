const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { files: 5 } });

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      SELECT ep.*, u.name, u.email, d.department_name
      FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      INNER JOIN departments d ON ep.department_id = d.id
      WHERE u.name ILIKE $1 OR ep.designation ILIKE $1
      ORDER BY ep.id DESC
      LIMIT $2 OFFSET $3
    `, [`%${search}%`, limit, offset]);

    const countResult = await pool.query(`
      SELECT COUNT(*) FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      WHERE u.name ILIKE $1 OR ep.designation ILIKE $1
    `, [`%${search}%`]);

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { user_id, department_id, phone, address, designation, salary } = req.body;
    const result = await pool.query(
      `INSERT INTO employee_profiles(user_id,department_id,phone,address,designation,salary)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [user_id, department_id, phone, address, designation, salary]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM employee_profiles WHERE id=$1",
      [req.params.id]
    );
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post("/upload", upload.array("images", 5), async (req, res) => {
  try {
    const { employee_id } = req.body;
    const files = req.files;
    for (let file of files) {
      await pool.query(
        "INSERT INTO employee_images(employee_id, image_url) VALUES($1,$2)",
        [employee_id, file.filename]
      );
    }
    res.json({ message: "Images uploaded" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;