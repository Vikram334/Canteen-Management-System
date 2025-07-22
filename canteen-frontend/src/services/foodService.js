import api from "./api";

export const getAllFoodItems = async () => {
  try {
    const response = await api.get("food-items"); // backend route you’ll define
    return response.data;
  } catch (err) {
    console.error("Error fetching food items:", err);
    throw err;
  }
};
