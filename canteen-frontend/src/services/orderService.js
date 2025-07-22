export const fetchOrderHistory = async (token) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const res = await fetch(`${BASE_URL}/order-history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
};