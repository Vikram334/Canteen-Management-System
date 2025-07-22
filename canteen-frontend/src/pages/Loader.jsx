import React from "react";

const Loader = () => {
  return (
    <div style={styles.overlay}>
      <div style={styles.loader}>
        <div style={styles.emoji}>🍽️</div>
        <p style={styles.text}>
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </p>
      </div>
    </div>
  );
};

const spin = {
  animation: "spin 2s linear infinite",
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(120deg, #f6d365, #fda085)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  loader: {
    textAlign: "center",
    color: "#fff",
  },
  emoji: {
    fontSize: "4rem",
    marginBottom: "16px",
    ...spin,
  },
  text: {
    fontSize: "1.5rem",
    display: "flex",
    gap: "4px",
    justifyContent: "center",
    animation: "pulse 1.5s infinite",
  },
};

// Inject keyframes globally
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
`;
const styleTag = document.createElement("style");
styleTag.innerHTML = keyframes;
document.head.appendChild(styleTag);

export default Loader;
