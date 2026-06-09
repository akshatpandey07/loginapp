require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const departmentRoutes = require("./routes/departments");
const skillRoutes = require("./routes/skills");
const employeeRoutes = require("./routes/employees");
const leaveRoutes = require("./routes/leaves");
const assetRoutes = require("./routes/assets");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/assets", assetRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});