import { useState, useEffect } from "react";
import axios from "axios";

function CreateEmployee() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    user_id: "", department_id: "", phone: "",
    address: "", designation: "", salary: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/v1/departments")
      .then(res => setDepartments(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/v1/employees", form);
    alert("Employee Created!");
    window.location.href = "/employees";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Employee</h1>
      <a href="/">Dashboard</a>
      <br/><br/>
      <form onSubmit={handleSubmit}>
        <input name="user_id" placeholder="User ID" onChange={handleChange} /><br/><br/>
        <select name="department_id" onChange={handleChange}>
          <option value="">Select Department</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.department_name}</option>
          ))}
        </select><br/><br/>
        <input name="phone" placeholder="Phone" onChange={handleChange} /><br/><br/>
        <input name="address" placeholder="Address" onChange={handleChange} /><br/><br/>
        <input name="designation" placeholder="Designation" onChange={handleChange} /><br/><br/>
        <input name="salary" placeholder="Salary" onChange={handleChange} /><br/><br/>
        <button type="submit">Create Employee</button>
      </form>
    </div>
  );
}

export default CreateEmployee;