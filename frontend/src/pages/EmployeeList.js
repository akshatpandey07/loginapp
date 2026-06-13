import API_URL from "../config";
import { useState, useEffect } from "react";
import axios from "axios";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;

  useEffect(() => {
    fetchEmployees();
  }, [page, search]);

  const fetchEmployees = async () => {
    const res = await axios.get(
      `${API_URL}/api/v1/employees?page=${page}&limit=${limit}&search=${search}`
    );
    setEmployees(res.data.data);
    setTotal(res.data.total);
  };

  const deleteEmployee = async (id) => {
    await axios.delete(`${API_URL}/api/v1/employees/${id}`);
    fetchEmployees();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employee List</h1>
      <a href="/dashboard">Dashboard</a> &nbsp;&nbsp;
      <a href="/create">Create Employee</a>
      <br/><br/>
      <input
        placeholder="Search by name or designation..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        style={{ padding: "8px", width: "300px" }}
      />
      <br/><br/>
      <p>Total Employees: {total}</p>
      <table border="1" style={{ width: "100%" }}>
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
          {employees && employees.map(emp => (
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
      <br/>
      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Previous</button>
      &nbsp;
      <span>Page {page} of {totalPages}</span>
      &nbsp;
      <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</button>
    </div>
  );
}

export default EmployeeList;