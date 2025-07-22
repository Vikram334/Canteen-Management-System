import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageItems = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image_url: "" });

  const token = localStorage.getItem("adminToken");

  const fetchItems = () => {
    axios.get("http://localhost:8080/food-items")
      .then(res => setItems(res.data));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = () => {
    axios.post("http://localhost:8080/admin/add-item", form, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      fetchItems();
      setForm({ name: "", price: "", image_url: "" });
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/admin/delete-item/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(fetchItems);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🍔 Manage Food Items</h2>
      <div style={styles.form}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <div style={styles.grid}>
        {items.map(item => (
          <div key={item._id} style={styles.card}>
            <img src={item.image_url} alt={item.name} style={{ width: "100%", borderRadius: "8px" }} />
            <p>{item.name}</p>
            <p>₹{parseFloat(item.price?.$numberDecimal || item.price).toFixed(2)}</p>
            <button onClick={() => handleDelete(item._id)}>❌ Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
};

export default ManageItems;
