import API_URL from "../config";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#0088FE", "#A28DFF"];

function Analytics() {
  const [attendance, setAttendance] = useState([]);
  const [deptSalary, setDeptSalary] = useState([]);
  const [leaveStatus, setLeaveStatus] = useState([]);
  const [assetStatus, setAssetStatus] = useState([]);
  const [payroll, setPayroll] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/v1/payroll/attendance-summary`)
      .then(res => setAttendance(res.data));

    axios.get(`${API_URL}/api/v1/payroll/department-salary`)
      .then(res => setDeptSalary(res.data));

    axios.get(`${API_URL}/api/v1/payroll/leave-summary`)
      .then(res => setLeaveStatus(res.data));

    axios.get(`${API_URL}/api/v1/payroll/asset-summary`)
      .then(res => setAssetStatus(res.data));

    axios.get(`${API_URL}/api/v1/payroll/payroll`)
      .then(res => setPayroll(res.data));
  }, []);

  const salaryBreakdown = payroll.map(p => ({
    name: p.employee_name,
    Gross: parseFloat(p.basic_salary),
    TDS: parseFloat(p.tds),
    PF: parseFloat(p.pf),
    Net: parseFloat(p.net_salary)
  }));

  return (
    <div style={{ padding: "20px" }}>
      <h1>Analytics Dashboard</h1>
      <a href="/dashboard">Dashboard</a>
      <br/><br/>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>

        {/* 1. Attendance Overview */}
        <div style={{ width: "400px", height: "300px" }}>
          <h3>Attendance Overview</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={attendance} dataKey="count" nameKey="status" cx="50%" cy="50%"
                innerRadius={50} outerRadius={80} label>
                {attendance.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Salary Breakdown */}
        <div style={{ width: "500px", height: "300px" }}>
          <h3>Salary Breakdown (Gross/TDS/PF/Net)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salaryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Gross" fill="#0088FE" />
              <Bar dataKey="TDS" fill="#FF8042" />
              <Bar dataKey="PF" fill="#FFBB28" />
              <Bar dataKey="Net" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Department-wise Salary */}
        <div style={{ width: "400px", height: "300px" }}>
          <h3>Department-wise Avg Salary</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptSalary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department_name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg_salary" fill="#A28DFF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Leave Status */}
        <div style={{ width: "400px", height: "300px" }}>
          <h3>Leave Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={leaveStatus} dataKey="count" nameKey="status" cx="50%" cy="50%"
                outerRadius={80} label>
                {leaveStatus.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 5. Asset Allocation */}
        <div style={{ width: "400px", height: "300px" }}>
          <h3>Asset Allocation</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={assetStatus} dataKey="count" nameKey="status" cx="50%" cy="50%"
                outerRadius={80} label>
                {assetStatus.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Analytics;