import React, { useEffect, useState } from "react";
import { fetchOrderHistory } from "../services/orderService";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchOrderHistory(token)
        .then((data) => {
          setOrders(data);
          setLoading(false);
        })
        .catch(() => {
          alert("Failed to fetch order history");
          setLoading(false);
        });
    }
  }, [token]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.backgroundOverlay}></div>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Background Effects */}
      <div style={styles.backgroundOverlay}></div>
      <div style={styles.floatingElements}>
        <div style={styles.floatingShape1}></div>
        <div style={styles.floatingShape2}></div>
        <div style={styles.floatingShape3}></div>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>📦 Your Orders</h2>
        <p style={styles.subtitle}>Track your delicious food orders</p>
      </div>

      {orders.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🍽️</div>
          <h3 style={styles.emptyTitle}>No Orders Yet</h3>
          <p style={styles.emptyMessage}>You haven't placed any orders yet. Start exploring our menu!</p>
          <button style={styles.browseButton} onClick={() => window.location.href = '/menu'}>
            Browse Menu
          </button>
        </div>
      ) : (
        <div style={styles.orderList}>
          {orders.map((order, index) => (
            <div 
              key={order._id} 
              style={{
                ...styles.orderCard,
                animationDelay: `${index * 0.1}s`
              }}
              className="order-card"
            >
              {/* Card Header */}
              <div style={styles.orderHeader}>
                <div style={styles.orderBadge}>
                  <span style={styles.badgeText}>#{order.order_id}</span>
                </div>
                <div style={styles.statusBadge}>
                  <span style={styles.statusText}>{order.status}</span>
                </div>
              </div>

              {/* Order Meta */}
              <div style={styles.orderMeta}>
                <div style={styles.metaRow}>
                  <span style={styles.metaIcon}>💰</span>
                  <div style={styles.metaContent}>
                    <span style={styles.metaLabel}>Total</span>
                    <span style={styles.metaValue}>
                      ₹{parseFloat(order.total_price?.$numberDecimal || order.total_price).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div style={styles.metaRow}>
                  <span style={styles.metaIcon}>🎟️</span>
                  <div style={styles.metaContent}>
                    <span style={styles.metaLabel}>Token</span>
                    <span style={styles.tokenValue}>{order.token_number}</span>
                  </div>
                </div>
                
                <div style={styles.metaRow}>
                  <span style={styles.metaIcon}>📅</span>
                  <div style={styles.metaContent}>
                    <span style={styles.metaLabel}>Date</span>
                    <span style={styles.metaValue}>
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              {order.items?.length > 0 && (
                <div style={styles.itemsSection}>
                  <div style={styles.itemsHeader}>
                    <h4 style={styles.itemsTitle}>🍽️ Items ({order.items.length})</h4>
                    <span style={styles.itemsCount}>
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                  </div>
                  
                  <div style={styles.foodGrid}>
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} style={styles.foodCard}>
                        <div style={styles.imageContainer}>
                          <img
                            src={item.image_url || "https://via.placeholder.com/150"}
                            alt={item.name}
                            style={styles.foodImage}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div style={{...styles.imagePlaceholder, display: 'none'}}>
                            <span style={styles.placeholderIcon}>🍽️</span>
                          </div>
                          <div style={styles.quantityBadge}>
                            <span style={styles.quantityText}>{item.quantity}</span>
                          </div>
                        </div>
                        <div style={styles.foodDetails}>
                          <p style={styles.foodName}>{item.name}</p>
                          <p style={styles.foodPrice}>
                            ₹{parseFloat(item.price?.$numberDecimal || item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {order.items.length > 3 && (
                      <div style={styles.moreItems}>
                        <div style={styles.moreItemsIcon}>+</div>
                        <span style={styles.moreItemsText}>
                          {order.items.length - 3} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    backgroundImage: `url("/images/74bb95b8-d4cd-4802-896e-f48de79ca399.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Inter', sans-serif",
    padding: "1rem",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  },

  backgroundOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(44, 95, 95, 0.1) 0%, rgba(255, 255, 255, 0.15) 100%)",
    backdropFilter: "blur(3px)",
    zIndex: 0,
  },

  floatingElements: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1,
  },

  floatingShape1: {
    position: "absolute",
    top: "15%",
    left: "10%",
    width: "60px",
    height: "60px",
    background: "linear-gradient(45deg, rgba(44, 95, 95, 0.1), rgba(44, 95, 95, 0.05))",
    borderRadius: "50%",
    animation: "float 8s ease-in-out infinite",
  },

  floatingShape2: {
    position: "absolute",
    top: "70%",
    right: "15%",
    width: "80px",
    height: "80px",
    background: "linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))",
    borderRadius: "50%",
    animation: "float 10s ease-in-out infinite reverse",
  },

  floatingShape3: {
    position: "absolute",
    bottom: "30%",
    left: "20%",
    width: "50px",
    height: "50px",
    background: "linear-gradient(45deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))",
    borderRadius: "50%",
    animation: "float 9s ease-in-out infinite",
  },

  header: {
    textAlign: "center",
    marginBottom: "2rem",
    position: "relative",
    zIndex: 2,
  },

  title: {
    fontSize: "2.2rem",
    fontWeight: "800",
    color: "#2C5F5F",
    marginBottom: "0.5rem",
    textShadow: "0 2px 4px rgba(44, 95, 95, 0.2)",
  },

  subtitle: {
    fontSize: "1rem",
    color: "#2C5F5F",
    opacity: 0.8,
    fontWeight: "500",
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    position: "relative",
    zIndex: 2,
  },

  loadingSpinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(44, 95, 95, 0.1)",
    borderTop: "4px solid #2C5F5F",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem",
  },

  loadingText: {
    fontSize: "1.1rem",
    color: "#2C5F5F",
    fontWeight: "500",
  },

  emptyState: {
    textAlign: "center",
    padding: "3rem 2rem",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    boxShadow: "0 15px 35px rgba(44, 95, 95, 0.15)",
    maxWidth: "400px",
    position: "relative",
    zIndex: 2,
  },

  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
    opacity: 0.8,
  },

  emptyTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#2C5F5F",
    marginBottom: "0.5rem",
  },

  emptyMessage: {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "1.5rem",
    lineHeight: "1.6",
  },

  browseButton: {
    padding: "0.8rem 1.5rem",
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.3)",
  },

  orderList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1.5rem",
    width: "100%",
    maxWidth: "1200px",
    position: "relative",
    zIndex: 2,
  },

  orderCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    padding: "1.5rem",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.12), 0 4px 12px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    animation: "slideUp 0.6s ease forwards",
    opacity: 0,
    transform: "translateY(20px)",
  },

  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },

  orderBadge: {
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    padding: "0.4rem 0.8rem",
    borderRadius: "20px",
    boxShadow: "0 4px 12px rgba(44, 95, 95, 0.3)",
  },

  badgeText: {
    color: "#ffffff",
    fontSize: "0.8rem",
    fontWeight: "600",
  },

  statusBadge: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    padding: "0.3rem 0.6rem",
    borderRadius: "15px",
    boxShadow: "0 3px 8px rgba(16, 185, 129, 0.3)",
  },

  statusText: {
    color: "#ffffff",
    fontSize: "0.75rem",
    fontWeight: "500",
    textTransform: "uppercase",
  },

  orderMeta: {
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0",
    borderBottom: "1px solid rgba(44, 95, 95, 0.1)",
  },

  metaIcon: {
    fontSize: "1rem",
    minWidth: "1.2rem",
    textAlign: "center",
  },

  metaContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },

  metaLabel: {
    fontSize: "0.85rem",
    color: "#6b7280",
    fontWeight: "500",
  },

  metaValue: {
    fontSize: "0.85rem",
    color: "#2C5F5F",
    fontWeight: "600",
  },

  tokenValue: {
    fontSize: "0.9rem",
    color: "#2C5F5F",
    fontWeight: "700",
    background: "rgba(44, 95, 95, 0.1)",
    padding: "0.2rem 0.5rem",
    borderRadius: "8px",
  },

  itemsSection: {
    marginTop: "1rem",
    padding: "1rem",
    background: "linear-gradient(135deg, rgba(44, 95, 95, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)",
    borderRadius: "12px",
    border: "1px solid rgba(44, 95, 95, 0.1)",
  },

  itemsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.8rem",
  },

  itemsTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2C5F5F",
    margin: 0,
  },

  itemsCount: {
    fontSize: "0.75rem",
    color: "#6b7280",
    background: "rgba(255, 255, 255, 0.8)",
    padding: "0.2rem 0.5rem",
    borderRadius: "10px",
    fontWeight: "500",
  },

  foodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "0.8rem",
  },

  foodCard: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    padding: "0.8rem",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(44, 95, 95, 0.1)",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },

  imageContainer: {
    position: "relative",
    marginBottom: "0.6rem",
  },

  foodImage: {
    width: "100%",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },

  imagePlaceholder: {
    width: "100%",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(44, 95, 95, 0.1)",
    borderRadius: "8px",
  },

  placeholderIcon: {
    fontSize: "1.5rem",
    color: "#2C5F5F",
    opacity: 0.6,
  },

  quantityBadge: {
    position: "absolute",
    top: "4px",
    right: "4px",
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(245, 158, 11, 0.4)",
  },

  quantityText: {
    color: "#ffffff",
    fontSize: "0.7rem",
    fontWeight: "700",
  },

  foodDetails: {
    padding: "0.2rem 0",
  },

  foodName: {
    fontWeight: "600",
    color: "#2C5F5F",
    marginBottom: "0.3rem",
    fontSize: "0.8rem",
    lineHeight: "1.2",
    margin: 0,
  },

  foodPrice: {
    fontWeight: "600",
    color: "#10b981",
    fontSize: "0.85rem",
    margin: 0,
  },

  moreItems: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(44, 95, 95, 0.1)",
    borderRadius: "12px",
    padding: "1rem",
    border: "2px dashed rgba(44, 95, 95, 0.2)",
    transition: "all 0.3s ease",
  },

  moreItemsIcon: {
    fontSize: "1.5rem",
    color: "#2C5F5F",
    fontWeight: "bold",
    marginBottom: "0.3rem",
  },

  moreItemsText: {
    fontSize: "0.75rem",
    color: "#6b7280",
    fontWeight: "500",
    textAlign: "center",
  },
};

// Enhanced CSS animations with responsive design
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(3deg); }
  }
  
  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Enhanced hover effects */
  .order-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 35px rgba(44, 95, 95, 0.2), 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .foodCard:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(44, 95, 95, 0.15);
  }
  
  .moreItems:hover {
    background: rgba(44, 95, 95, 0.15);
    border-color: rgba(44, 95, 95, 0.3);
  }
  
  .browseButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(44, 95, 95, 0.4);
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .container {
      padding: 0.5rem;
    }
    
    .title {
      font-size: 1.8rem;
    }
    
    .subtitle {
      font-size: 0.9rem;
    }
    
    .orderList {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .orderCard {
      padding: 1.2rem;
    }
    
    .orderHeader {
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }
    
    .orderBadge, .statusBadge {
      padding: 0.3rem 0.6rem;
    }
    
    .badgeText, .statusText {
      font-size: 0.75rem;
    }
    
    .metaRow {
      padding: 0.3rem 0;
    }
    
    .metaIcon {
      font-size: 0.9rem;
    }
    
    .metaLabel, .metaValue {
      font-size: 0.8rem;
    }
    
    .itemsSection {
      padding: 0.8rem;
    }
    
    .itemsTitle {
      font-size: 0.9rem;
    }
    
    .itemsCount {
      font-size: 0.7rem;
    }
    
    .foodGrid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 0.6rem;
    }
    
    .foodCard {
      padding: 0.6rem;
    }
    
    .foodImage {
      height: 70px;
    }
    
    .imagePlaceholder {
      height: 70px;
    }
    
    .quantityBadge {
      width: 18px;
      height: 18px;
    }
    
    .quantityText {
      font-size: 0.65rem;
    }
    
    .foodName {
      font-size: 0.75rem;
    }
    
    .foodPrice {
      font-size: 0.8rem;
    }
    
    .moreItems {
      padding: 0.8rem;
    }
    
    .moreItemsIcon {
      font-size: 1.2rem;
    }
    
    .moreItemsText {
      font-size: 0.7rem;
    }
    
    .emptyState {
      padding: 2rem 1.5rem;
    }
    
    .emptyIcon {
      font-size: 3rem;
    }
    
    .emptyTitle {
      font-size: 1.3rem;
    }
    
    .emptyMessage {
      font-size: 0.9rem;
    }
    
    .browseButton {
      padding: 0.7rem 1.2rem;
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    .container {
      padding: 0.25rem;
    }
    
    .title {
      font-size: 1.6rem;
    }
    
    .orderCard {
      padding: 1rem;
      border-radius: 12px;
    }
    
    .orderHeader {
      margin-bottom: 0.8rem;
    }
    
    .orderMeta {
      margin-bottom: 0.8rem;
    }
    
    .metaRow {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
    }
    
    .metaContent {
      width: 100%;
      padding-left: 1.5rem;
    }
    
    .foodGrid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .foodImage {
      height: 60px;
    }
    
    .imagePlaceholder {
      height: 60px;
    }
    
    .foodName {
      font-size: 0.7rem;
    }
    
    .foodPrice {
      font-size: 0.75rem;
    }
    
    .floatingShape1, .floatingShape2, .floatingShape3 {
      width: 30px;
      height: 30px;
    }
  }
  
  @media (max-width: 360px) {
    .orderList {
      grid-template-columns: 1fr;
    }
    
    .orderCard {
      padding: 0.8rem;
    }
    
    .foodGrid {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }
    
    .foodCard {
      padding: 0.5rem;
    }
    
    .foodImage {
      height: 50px;
    }
    
    .imagePlaceholder {
      height: 50px;
    }
    
    .quantityBadge {
      width: 16px;
      height: 16px;
    }
    
    .quantityText {
      font-size: 0.6rem;
    }
  }
  
  /* Landscape orientation */
  @media (max-height: 600px) and (orientation: landscape) {
    .container {
      padding: 0.5rem;
    }
    
    .title {
      font-size: 1.5rem;
    }
    
    .floatingShape1, .floatingShape2, .floatingShape3 {
      display: none;
    }
  }
  
  /* High-resolution displays */
  @media (min-resolution: 2dppx) {
    .foodImage {
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }
  }
  
  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default OrderHistory;
