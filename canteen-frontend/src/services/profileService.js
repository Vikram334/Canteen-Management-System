import api from "./api";

export const getUserProfile = async (student_id) => {
  const res = await api.get(`/profile/${student_id}`);
  return res.data;
};

export const updateUserProfile = async (student_id, updatedData) => {
  const res = await api.put(`/profile/${student_id}`, updatedData);
  return res.data;
};
