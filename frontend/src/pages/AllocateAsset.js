import API_URL from "../config";
import { useState, useEffect } from "react";
import axios from "axios";

function AllocateAsset() {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    asset_id: "",
    employee_id: "",
    allocated_by: "",
    allocated_date: ""
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/assets`)
      .then(res => setAssets(res.data.filter(a => a.status === "available")));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/api/v1/assets/allocate`, form);
    alert("Asset Allocated Successfully!");
    window.location.href = "/assets";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Allocate Asset</h1>
      <a href="/dashboard">Dashboard</a>
      <br/><br/>
      <form onSubmit={handleSubmit}>
        <select name="asset_id" onChange={handleChange}>
          <option value="">Select Asset</option>
          {assets.map(a => (
            <option key={a.id} value={a.id}>{a.asset_name}</option>
          ))}
        </select><br/><br/>
        <input name="employee_id" placeholder="Employee ID" onChange={handleChange} /><br/><br/>
        <input name="allocated_by" placeholder="Allocated By (User ID)" onChange={handleChange} /><br/><br/>
        <input type="date" name="allocated_date" onChange={handleChange} /><br/><br/>
        <button type="submit">Allocate Asset</button>
      </form>
    </div>
  );
}

export default AllocateAsset;