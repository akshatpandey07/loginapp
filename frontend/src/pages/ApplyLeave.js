import { useState, useEffect } from "react";
import axios from "axios";

function ApplyLeave() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    leave_type_id: "",
    from_date: "",
    to_date: "",
    total_days: "",
    reason: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/v1/leaves/types")
      .then(res => setLeaveTypes(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/v1//leaves/apply", form);
    alert("Leave Applied Successfully!");
    window.location.href = "/leaves";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Apply Leave</h1>
      <a href="/dashboard">Dashboard</a>
      <br/><br/>
      <form onSubmit={handleSubmit}>
        <input name="employee_id" placeholder="Employee ID" onChange={handleChange} /><br/><br/>
        <select name="leave_type_id" onChange={handleChange}>
          <option value="">Select Leave Type</option>
          {leaveTypes.map(l => (
            <option key={l.id} value={l.id}>{l.leave_name}</option>
          ))}
        </select><br/><br/>
        <input type="date" name="from_date" onChange={handleChange} /><br/><br/>
        <input type="date" name="to_date" onChange={handleChange} /><br/><br/>
        <input name="total_days" placeholder="Total Days" onChange={handleChange} /><br/><br/>
        <input name="reason" placeholder="Reason" onChange={handleChange} /><br/><br/>
        <button type="submit">Apply Leave</button>
      </form>
    </div>
  );
}

export default ApplyLeave;