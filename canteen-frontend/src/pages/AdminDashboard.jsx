import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setOrders(res.data))
    .catch(() => alert("Failed to fetch orders"));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📦 Incoming Orders</h2>
      {orders.map(order => (
        <div key={order._id} style={styles.card}>
          <p><strong>Order ID:</strong> {order.order_id}</p>
          <p><strong>Student:</strong> {order.student_id}</p>
          <p><strong>Total:</strong> ₹{parseFloat(order.total_price?.$numberDecimal || order.total_price).toFixed(2)}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Time:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "10px",
    marginBottom: "1rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
};

export default AdminDashboard;
