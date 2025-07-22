import api from "./api";

export const loginUser = async (student_id, password) => {
  try {
    const res = await api.post("/login", { student_id, password });
    // Save token to localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("student_id", res.data.user.student_id); // optional for profile usage
    return res.data;
  } catch (err) {
    console.error("Login failed:", err);
    throw err;
  }
};
