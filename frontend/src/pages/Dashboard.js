import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    skills: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const emp = await axios.get("http://localhost:5000/api/employees");
        const dept = await axios.get("http://localhost:5000/api/departments");
        const skill = await axios.get("http://localhost:5000/api/skills");
        setStats({
          employees: emp.data.length,
          departments: dept.data.length,
          skills: skill.data.length
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ background: "#4CAF50", color: "white", padding: "20px", borderRadius: "10px" }}>
          <h2>Employees</h2>
          <h1>{stats.employees}</h1>
        </div>
        <div style={{ background: "#2196F3", color: "white", padding: "20px", borderRadius: "10px" }}>
          <h2>Departments</h2>
          <h1>{stats.departments}</h1>
        </div>
        <div style={{ background: "#FF9800", color: "white", padding: "20px", borderRadius: "10px" }}>
          <h2>Skills</h2>
          <h1>{stats.skills}</h1>
        </div>
      </div>
      <br/>
      <a href="/employees">View Employees</a>
      &nbsp;&nbsp;
      <a href="/create">Create Employee</a>
    </div>
  );
}

export default Dashboard;