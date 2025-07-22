import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/admin/login", {
        username,
        password,
      });
      localStorage.setItem("adminToken", res.data.token);
      alert("✅ Admin Logged In");
      navigate("/admin/dashboard");
    } catch (err) {
      alert("❌ Invalid Admin Credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Admin Login</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>Login</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    background: "#2C5F5F",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  }
};

export default AdminLogin;
