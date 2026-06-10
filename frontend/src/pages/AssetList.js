import { useState, useEffect } from "react";
import axios from "axios";

function AssetList() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    const res = await axios.get("http://localhost:5000/api/v1/assets");
    setAssets(res.data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Asset Management</h1>
      <a href="/dashboard">Dashboard</a> &nbsp;&nbsp;
      <a href="/allocate-asset">Allocate Asset</a>
      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Asset Code</th>
            <th>Asset Name</th>
            <th>Type</th>
            <th>Cost</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.id}>
              <td>{asset.asset_code}</td>
              <td>{asset.asset_name}</td>
              <td>{asset.asset_type}</td>
              <td>{asset.purchase_cost}</td>
              <td>{asset.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssetList;