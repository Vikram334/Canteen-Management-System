import api from "./api";

// Fetch user profile using token
export const fetchUserProfile = async (student_id, token) => {
  const res = await api.get(`/profile/${student_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Update user profile using token
export const updateUserProfile = async (student_id, formData, token) => {
  const res = await api.put(`/profile/${student_id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
