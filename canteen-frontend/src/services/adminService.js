// services/adminService.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// 🔐 Get admin token from localStorage
const getAdminToken = () => localStorage.getItem("adminToken");

// 📥 Admin Login
export const adminLogin = async (credentials) => {
  const res = await axios.post(`${BASE_URL}/admin/login`, credentials);
  return res.data;
};

// 📦 Fetch all orders (admin only)
export const fetchOrders = async () => {
  const res = await axios.get(`${BASE_URL}/admin/orders`, {
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });
  return res.data;
};

// 📄 Fetch all food items (public)
export const fetchFoodItems = async () => {
  const res = await axios.get(`${BASE_URL}/food-items`);
  return res.data;
};

// ➕ Add a new food item
export const addFoodItem = async (itemData) => {
  const res = await axios.post(`${BASE_URL}/admin/food`, itemData, {
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });
  return res.data;
};

// ✏️ Update a food item
export const updateFoodItem = async (id, updatedData) => {
  const res = await axios.put(`${BASE_URL}/admin/food/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });
  return res.data;
};

// ❌ Delete a food item
export const deleteFoodItem = async (id) => {
  const res = await axios.delete(`${BASE_URL}/admin/food/${id}`, {
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });
  return res.data;
};
