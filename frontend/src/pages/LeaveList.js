import { useState, useEffect } from "react";
import axios from "axios";

function LeaveList() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    const res = await axios.get("http://localhost:5000/api/v1/leaves");
    setLeaves(res.data);
  };

  const handleAction = async (id, action) => {
    await axios.put(`http://localhost:5000/api/v1/leaves/approve/${id}`, {
      action: action,
      remarks: action === "approved" ? "Approved by Manager" : "Rejected by Manager",
      approved_by: 2
    });
    fetchLeaves();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Leave Applications</h1>
      <a href="/dashboard">Dashboard</a> &nbsp;&nbsp;
      <a href="/apply-leave">Apply Leave</a>
      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Days</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(leave => (
            <tr key={leave.id}>
              <td>{leave.employee_name}</td>
              <td>{leave.leave_name}</td>
              <td>{leave.from_date}</td>
              <td>{leave.to_date}</td>
              <td>{leave.total_days}</td>
              <td>{leave.reason}</td>
              <td>{leave.status}</td>
              <td>
                {leave.status === "pending" && (
                  <>
                    <button onClick={() => handleAction(leave.id, "approved")}>Approve</button>
                    &nbsp;
                    <button onClick={() => handleAction(leave.id, "rejected")}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveList;