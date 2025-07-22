import React from "react";
import { useCart } from "../context/CartContext";

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();

  return (
    <div style={styles.card}>
      <img src={food.image_url} alt={food.name} style={styles.image} />
      <div style={styles.content}>
        <h3 style={styles.title}>{food.name}</h3>
        <p style={styles.description}>{food.description}</p>
        <p style={styles.price}>₹{food.price?.$numberDecimal}</p>
        <p>⭐ {food.rating} ({food.reviews_count} reviews)</p>
        <button style={styles.button} onClick={() => addToCart(food)}>Add to Cart</button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    width: "280px",
    margin: "16px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  content: {
    padding: "16px",
  },
  title: {
    fontSize: "1.2rem",
    marginBottom: "8px",
    color: "#333",
  },
  description: {
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "12px",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    color: "#2d8f2d",
  },
  rating: {
    fontSize: "0.9rem",
    color: "#444",
  },
};

export default FoodCard;

