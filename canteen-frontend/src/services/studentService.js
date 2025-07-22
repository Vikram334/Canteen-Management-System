import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// -------------------------
// 🔹 Signup a new student
// -------------------------
export const signupStudent = async (studentData) => {
  const res = await axios.post(`${BASE_URL}/student/signup`, studentData);
  return res.data; // returns { message: "Signup successful" }
};

// -------------------------
// 🔹 Login a student
// -------------------------
export const loginStudent = async (credentials) => {
  const res = await axios.post(`${BASE_URL}/student/login`, credentials);
  return res.data; // returns token, student_id
};

// -------------------------
// 🔹 Fetch student profile
// -------------------------
export const fetchUserProfile = async (student_id, token) => {
  const res = await axios.get(`${BASE_URL}/student/profile/${student_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// -------------------------
// 🔹 Update student profile
// -------------------------
export const updateUserProfile = async (student_id, updatedData, token) => {
  const res = await axios.put(
    `${BASE_URL}/student/profile/${student_id}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
