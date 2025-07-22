import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [fillPercent, setFillPercent] = useState(0);
  const [barColor, setBarColor] = useState("rgb(220, 38, 38)");
  const [showConfetti, setShowConfetti] = useState(false);

  const startStatusBarAnimation = useCallback(() => {
    let startTime = Date.now();
    let animationId;
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      if (elapsed <= 2) {
        const progress = elapsed / 2;
        const fill = progress * 33.3;
        const red = [220, 38, 38];
        const orange = [251, 146, 60];
        const color = red.map((r, i) => Math.round(r + (orange[i] - r) * progress));
        
        setFillPercent(fill);
        setBarColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        setCurrentStatus(0);
        
        animationId = requestAnimationFrame(animate);
      } else if (elapsed <= 22) {
        const progress = (elapsed - 2) / 20;
        const fill = 33.3 + progress * (86.6 - 33.3);
        const orange = [251, 146, 60];
        const yellow = [245, 158, 11];
        const color = orange.map((o, i) => Math.round(o + (yellow[i] - o) * progress));
        
        setFillPercent(fill);
        setBarColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        setCurrentStatus(1);
        
        animationId = requestAnimationFrame(animate);
      } else if (elapsed <= 27) {
        const progress = (elapsed - 22) / 5;
        const fill = 86.6 + progress * (100 - 86.6);
        const yellow = [245, 158, 11];
        const green = [44, 95, 95]; // Changed to canteen green
        const color = yellow.map((y, i) => Math.round(y + (green[i] - y) * progress));
        
        setFillPercent(Math.min(fill, 100));
        setBarColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        setCurrentStatus(2);
        
        // Show confetti when order is ready
        if (progress > 0.8 && !showConfetti) {
          setShowConfetti(true);
        }
        
        if (elapsed < 27) {
          animationId = requestAnimationFrame(animate);
        }
      }
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [showConfetti]);

  useEffect(() => {
    if (!state) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    } else {
      const visibilityTimer = setTimeout(() => setIsVisible(true), 100);
      const cleanupAnimation = startStatusBarAnimation();
      
      return () => {
        clearTimeout(visibilityTimer);
        if (cleanupAnimation) {
          cleanupAnimation();
        }
      };
    }
  }, [state, navigate, startStatusBarAnimation]);

  if (!state) {
    return (
      <div style={styles.container}>
        <div style={styles.backgroundOverlay}></div>
        <div style={styles.floatingElements}>
          <div style={styles.floatingShape1}></div>
          <div style={styles.floatingShape2}></div>
          <div style={styles.floatingShape3}></div>
        </div>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Invalid Access</h2>
          <p style={styles.errorMessage}>No order information found. Redirecting to menu...</p>
          <div style={styles.loadingBar}>
            <div style={styles.loadingProgress}></div>
          </div>
        </div>
      </div>
    );
  }

  const {
    orderId = "N/A",
    tokenNumber = "--",
    totalAmount = 0,
    time = "ASAP",
    paymentMode = "N/A",
  } = state;

  const statusSteps = [
    { label: "Order Placed", icon: "📝", color: "#ef4444" },
    { label: "Preparing", icon: "👨‍🍳", color: "#f59e0b" },
    { label: "Ready to Serve", icon: "🍽️", color: "#2C5F5F" }
  ];

  return (
    <div style={styles.container}>
      {/* Background Image */}
      <div style={styles.backgroundImage}></div>
      <div style={styles.backgroundOverlay}></div>
      
      {/* Floating Elements */}
      <div style={styles.floatingElements}>
        <div style={styles.floatingShape1}></div>
        <div style={styles.floatingShape2}></div>
        <div style={styles.floatingShape3}></div>
        <div style={styles.floatingShape4}></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div style={styles.confettiContainer}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.confetti,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#2C5F5F', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      )}

      <div style={{
        ...styles.contentWrapper,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      }}>
        {/* Success Icon */}
        <div style={styles.successIconContainer}>
          <div style={styles.successIcon}>
            <div style={styles.checkmark}>✓</div>
            <div style={styles.successRipple}></div>
          </div>
        </div>

        {/* Hero Section */}
        <div style={styles.heroSection}>
          <h1 style={styles.title}>
            <span style={styles.titleGradient}>Thank You!</span>
          </h1>
          <p style={styles.message}>
            🎉 Your delicious order has been placed successfully
          </p>
          <div style={styles.orderIdBadge}>
            <span style={styles.orderIdLabel}>Order ID:</span>
            <span style={styles.orderIdValue}>{orderId}</span>
          </div>
        </div>

        {/* Token Number Highlight */}
        <div style={styles.tokenCard}>
          <div style={styles.tokenHeader}>
            <span style={styles.tokenIcon}>🎟️</span>
            <span style={styles.tokenTitle}>Your Token Number</span>
          </div>
          <div style={styles.tokenNumber}>
            <span style={styles.tokenValue}>{tokenNumber}</span>
            <div style={styles.tokenPulse}></div>
          </div>
          <p style={styles.tokenSubtext}>Please remember this number for pickup</p>
        </div>

        {/* Order Status Progress */}
        <div style={styles.statusContainer}>
          <div style={styles.statusHeader}>
            <h3 style={styles.statusTitle}>
              <span style={styles.statusIcon}>📊</span>
              Order Progress
            </h3>
          </div>
          
          <div style={styles.statusProgress}>
            {statusSteps.map((step, index) => (
              <div key={index} style={styles.statusStepWrapper}>
                <div style={{
                  ...styles.statusStep,
                  ...(index <= currentStatus ? styles.statusStepActive : {}),
                  ...(index === currentStatus ? styles.statusStepCurrent : {})
                }}>
                  <div style={{
                    ...styles.statusStepIcon,
                    background: index <= currentStatus ? step.color : '#e5e7eb',
                    boxShadow: index <= currentStatus ? `0 8px 25px ${step.color}30` : 'none'
                  }}>
                    <span style={styles.statusStepEmoji}>{step.icon}</span>
                  </div>
                  <div style={styles.statusLabel}>{step.label}</div>
                </div>
                
                {index < statusSteps.length - 1 && (
                  <div style={{
                    ...styles.statusConnector,
                    background: index < currentStatus ? 
                      'linear-gradient(90deg, #2C5F5F 0%, #10b981 100%)' : 
                      '#e5e7eb'
                  }}></div>
                )}
              </div>
            ))}
          </div>
          
          {/* Dynamic Status Bar */}
          <div style={styles.statusBarContainer}>
            <div style={{
              ...styles.statusBar,
              width: `${fillPercent}%`,
              background: `linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #2C5F5F 100%)`,
            }}></div>
            <div style={styles.statusBarBackground}></div>
          </div>
        </div>

        {/* Order Details Card */}
        <div style={styles.detailsCard}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <span style={styles.cardIcon}>📋</span>
              Order Summary
            </h3>
          </div>
          
          <div style={styles.cardContent}>
            <div style={styles.detailRow}>
              <div style={styles.detailLabel}>
                <span style={styles.detailIcon}>💰</span>
                Total Amount
              </div>
              <span style={styles.amountValue}>₹{Number(totalAmount).toFixed(2)}</span>
            </div>
            
            <div style={styles.detailRow}>
              <div style={styles.detailLabel}>
                <span style={styles.detailIcon}>🕒</span>
                Estimated Time
              </div>
              <span style={styles.detailValue}>{time}</span>
            </div>
            
            <div style={styles.detailRow}>
              <div style={styles.detailLabel}>
                <span style={styles.detailIcon}>💳</span>
                Payment Method
              </div>
              <span style={styles.detailValue}>{paymentMode}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonContainer}>
          <button 
            style={styles.primaryButton} 
            onClick={() => navigate("/")}
            className="primary-btn"
          >
            <span style={styles.buttonIcon}>🔙</span>
            Back to Menu
          </button>
          
          <button 
            style={styles.secondaryButton}
            onClick={() => navigate("/orders")}
            className="secondary-btn"
          >
            <span style={styles.buttonIcon}>📦</span>
            View Orders
          </button>
        </div>

        {/* Footer Message */}
        <div style={styles.footer}>
          <div style={styles.footerCard}>
            <div style={styles.footerIcon}>
              {currentStatus === 2 ? "🎉" : "📱"}
            </div>
            <p style={styles.footerText}>
              {currentStatus === 2 ? 
                "Your order is ready! Please collect it from the counter." :
                "We'll notify you when your order is ready for pickup!"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    margin: "0",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  },

  backgroundImage: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("/images/74bb95b8-d4cd-4802-896e-f48de79ca399.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: -2,
  },

  backgroundOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(44, 95, 95, 0.1) 0%, rgba(255, 255, 255, 0.2) 100%)",
    backdropFilter: "blur(3px)",
    zIndex: -1,
  },

  floatingElements: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  },

  floatingShape1: {
    position: "absolute",
    top: "15%",
    left: "10%",
    width: "100px",
    height: "100px",
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
    width: "60px",
    height: "60px",
    background: "linear-gradient(45deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))",
    borderRadius: "50%",
    animation: "float 9s ease-in-out infinite",
  },

  floatingShape4: {
    position: "absolute",
    top: "40%",
    right: "30%",
    width: "70px",
    height: "70px",
    background: "linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))",
    borderRadius: "50%",
    animation: "float 11s ease-in-out infinite reverse",
  },

  confettiContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    zIndex: 10,
  },

  confetti: {
    position: "absolute",
    width: "8px",
    height: "8px",
    borderRadius: "2px",
    animation: "confetti 3s linear infinite",
  },

  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "600px",
    width: "100%",
    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    zIndex: 1,
  },

  successIconContainer: {
    position: "relative",
    marginBottom: "2rem",
  },

  successIcon: {
    width: "100px",
    height: "100px",
    background: "linear-gradient(135deg, #2C5F5F 0%, #10b981 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 20px 40px rgba(44, 95, 95, 0.3), 0 8px 25px rgba(0, 0, 0, 0.1)",
    position: "relative",
    overflow: "hidden",
  },

  checkmark: {
    color: "white",
    fontSize: "3rem",
    fontWeight: "bold",
    animation: "checkmarkPop 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    position: "relative",
    zIndex: 2,
  },

  successRipple: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    animation: "ripple 2s infinite",
  },

  heroSection: {
    textAlign: "center",
    marginBottom: "2rem",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "2rem",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    boxShadow: "0 15px 35px rgba(44, 95, 95, 0.1)",
  },

  title: {
    fontSize: "3rem",
    fontWeight: "800",
    marginBottom: "1rem",
    textShadow: "0 4px 8px rgba(44, 95, 95, 0.2)",
  },

  titleGradient: {
    background: "linear-gradient(135deg, #2C5F5F 0%, #10b981 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  message: {
    fontSize: "1.3rem",
    color: "#2C5F5F",
    marginBottom: "1.5rem",
    lineHeight: "1.6",
    opacity: 0.9,
  },

  orderIdBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "rgba(44, 95, 95, 0.1)",
    padding: "0.8rem 1.5rem",
    borderRadius: "50px",
    border: "1px solid rgba(44, 95, 95, 0.2)",
    backdropFilter: "blur(10px)",
  },

  orderIdLabel: {
    fontSize: "0.9rem",
    color: "#2C5F5F",
    fontWeight: "500",
  },

  orderIdValue: {
    fontSize: "1rem",
    color: "#2C5F5F",
    fontWeight: "700",
  },

  tokenCard: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "2rem",
    marginBottom: "2rem",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    boxShadow: "0 15px 35px rgba(44, 95, 95, 0.15)",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },

  tokenHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
  },

  tokenIcon: {
    fontSize: "1.5rem",
  },

  tokenTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#2C5F5F",
  },

  tokenNumber: {
    position: "relative",
    display: "inline-block",
    marginBottom: "0.5rem",
  },

  tokenValue: {
    fontSize: "4rem",
    fontWeight: "800",
    color: "#2C5F5F",
    textShadow: "0 4px 8px rgba(44, 95, 95, 0.2)",
    position: "relative",
    zIndex: 2,
  },

  tokenPulse: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "120%",
    height: "120%",
    background: "rgba(44, 95, 95, 0.1)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    animation: "pulse 2s infinite",
  },

  tokenSubtext: {
    fontSize: "0.9rem",
    color: "#6b7280",
    fontStyle: "italic",
  },

  statusContainer: {
    width: "100%",
    marginBottom: "2rem",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "2rem",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    boxShadow: "0 15px 35px rgba(44, 95, 95, 0.15)",
  },

  statusHeader: {
    textAlign: "center",
    marginBottom: "2rem",
  },

  statusTitle: {
    fontSize: "1.4rem",
    color: "#2C5F5F",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    margin: 0,
  },

  statusIcon: {
    fontSize: "1.2rem",
  },

  statusProgress: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2rem",
    position: "relative",
  },

  statusStepWrapper: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    position: "relative",
  },

  statusStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "all 0.3s ease",
    position: "relative",
  },

  statusStepActive: {
    animation: "statusPulse 2s infinite",
  },

  statusStepCurrent: {
    animation: "statusBounce 1s infinite",
  },

  statusStepIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "0.8rem",
    transition: "all 0.3s ease",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
  },

  statusStepEmoji: {
    fontSize: "1.5rem",
    color: "white",
  },

  statusLabel: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#2C5F5F",
    textAlign: "center",
  },

  statusConnector: {
    flex: 1,
    height: "4px",
    margin: "0 1rem",
    borderRadius: "2px",
    transition: "all 0.5s ease",
  },

  statusBarContainer: {
    position: "relative",
    width: "100%",
    height: "8px",
    background: "rgba(44, 95, 95, 0.1)",
    borderRadius: "4px",
    overflow: "hidden",
  },

  statusBar: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease",
    position: "relative",
  },

  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(44, 95, 95, 0.1)",
    borderRadius: "4px",
  },

  detailsCard: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    overflow: "hidden",
    marginBottom: "2rem",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    boxShadow: "0 15px 35px rgba(44, 95, 95, 0.15)",
  },

  cardHeader: {
    background: "linear-gradient(135deg, rgba(44, 95, 95, 0.1) 0%, rgba(44, 95, 95, 0.05) 100%)",
    padding: "1.5rem",
    borderBottom: "1px solid rgba(44, 95, 95, 0.1)",
  },

  cardTitle: {
    margin: 0,
    fontSize: "1.3rem",
    color: "#2C5F5F",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },

  cardIcon: {
    fontSize: "1.2rem",
  },

  cardContent: {
    padding: "1.5rem",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid rgba(44, 95, 95, 0.1)",
  },

  detailLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "1rem",
    color: "#6b7280",
    fontWeight: "500",
  },

  detailIcon: {
    fontSize: "1.2rem",
  },

  detailValue: {
    fontSize: "1rem",
    color: "#2C5F5F",
    fontWeight: "600",
  },

  amountValue: {
    fontSize: "1.3rem",
    color: "#2C5F5F",
    fontWeight: "800",
    background: "linear-gradient(135deg, #2C5F5F 0%, #10b981 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  buttonContainer: {
    display: "flex",
    gap: "1rem",
    width: "100%",
    marginBottom: "2rem",
  },

  primaryButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "1rem 2rem",
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    color: "white",
    fontSize: "1.1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.3)",
    backdropFilter: "blur(15px)",
    position: "relative",
    overflow: "hidden",
  },

  secondaryButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "1rem 2rem",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#2C5F5F",
    fontSize: "1.1rem",
    fontWeight: "600",
    border: "2px solid rgba(44, 95, 95, 0.2)",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(15px)",
    position: "relative",
    overflow: "hidden",
  },

  buttonIcon: {
    fontSize: "1.2rem",
  },

  footer: {
    width: "100%",
    textAlign: "center",
  },

  footerCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    borderRadius: "16px",
    padding: "1.5rem",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.1)",
  },

  footerIcon: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
  },

  footerText: {
    color: "#2C5F5F",
    fontSize: "1rem",
    fontWeight: "500",
    margin: 0,
    lineHeight: "1.6",
  },

  // Error Styles
  errorCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    padding: "3rem",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(239, 68, 68, 0.2)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
    border: "1px solid rgba(239, 68, 68, 0.1)",
    position: "relative",
    zIndex: 1,
  },

  errorIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
    animation: "bounce 2s infinite",
  },

  errorTitle: {
    color: "#ef4444",
    fontSize: "2rem",
    marginBottom: "1rem",
    fontWeight: "700",
  },

  errorMessage: {
    color: "#6b7280",
    fontSize: "1.1rem",
    marginBottom: "2rem",
    lineHeight: "1.6",
  },

  loadingBar: {
    width: "100%",
    height: "6px",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: "3px",
    overflow: "hidden",
    position: "relative",
  },

  loadingProgress: {
    width: "30%",
    height: "100%",
    background: "linear-gradient(90deg, #ef4444, #dc2626)",
    borderRadius: "3px",
    animation: "loading 2s ease-in-out infinite",
  },
};

// Enhanced CSS animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(3deg); }
  }
  
  @keyframes confetti {
    0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
  }
  
  @keyframes checkmarkPop {
    0% { transform: scale(0) rotate(0deg); }
    50% { transform: scale(1.2) rotate(180deg); }
    100% { transform: scale(1) rotate(360deg); }
  }
  
  @keyframes ripple {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.1; }
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.1; }
  }
  
  @keyframes statusPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes statusBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  @keyframes loading {
    0% { left: -30%; }
    100% { left: 100%; }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  
  /* Enhanced hover effects */
  .primary-btn:hover {
    transform: translateY(-3px) scale(1.02) !important;
    box-shadow: 0 15px 35px rgba(44, 95, 95, 0.4) !important;
  }
  
  .secondary-btn:hover {
    transform: translateY(-3px) scale(1.02) !important;
    box-shadow: 0 15px 35px rgba(44, 95, 95, 0.2) !important;
    background: rgba(255, 255, 255, 1) !important;
  }
  
  .primary-btn:active {
    transform: translateY(-1px) scale(1.01) !important;
  }
  
  .secondary-btn:active {
    transform: translateY(-1px) scale(1.01) !important;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .container {
      padding: 16px !important;
    }
    
    .title {
      font-size: 2.5rem !important;
    }
    
    .message {
      font-size: 1.1rem !important;
    }
    
    .tokenValue {
      font-size: 3rem !important;
    }
    
    .statusStepIcon {
      width: 50px !important;
      height: 50px !important;
    }
    
    .statusStepEmoji {
      font-size: 1.2rem !important;
    }
    
    .statusLabel {
      font-size: 0.8rem !important;
    }
    
    .buttonContainer {
      flex-direction: column !important;
    }
    
    .primaryButton, .secondaryButton {
      width: 100% !important;
    }
  }
  
  @media (max-width: 480px) {
    .heroSection {
      padding: 1.5rem !important;
    }
    
    .tokenCard {
      padding: 1.5rem !important;
    }
    
    .statusContainer {
      padding: 1.5rem !important;
    }
    
    .detailsCard {
      margin: 0 !important;
    }
    
    .cardHeader {
      padding: 1.2rem !important;
    }
    
    .cardContent {
      padding: 1.2rem !important;
    }
    
    .statusProgress {
      flex-direction: column !important;
      gap: 1rem !important;
    }
    
    .statusConnector {
      display: none !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default ThankYouPage;
