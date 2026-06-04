import { useState, useEffect } from "react";
import axios from "axios";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/api/employees");
    setEmployees(res.data);
  };

  const deleteEmployee = async (id) => {
    await axios.delete(`http://localhost:5000/api/employees/${id}`);
    fetchEmployees();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employee List</h1>
      <a href="/">Dashboard</a> &nbsp;&nbsp;
      <a href="/create">Create Employee</a>
      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Phone</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department_name}</td>
              <td>{emp.designation}</td>
              <td>{emp.phone}</td>
              <td>{emp.salary}</td>
              <td>
                <button onClick={() => deleteEmployee(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;