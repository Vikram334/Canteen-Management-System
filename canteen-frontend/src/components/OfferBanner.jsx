import React from "react";

const offerData = [
  {
    title: "🔥 Hot Deal",
    description: "Get 50% off on all beverages today only!",
    gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    accentColor: "#fecaca",
    icon: "🥤",
    sparkles: "✨",
  },
  {
    title: "💥 Combo Offer", 
    description: "Buy 1 meal, get 1 snack free!",
    gradient: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    accentColor: "#a7f3d0",
    icon: "🍛",
    sparkles: "🎊",
  },
  {
    title: "🎉 Happy Hour",
    description: "Flat 20% off between 4 PM - 6 PM",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    accentColor: "#d1fae5",
    icon: "⏰",
    sparkles: "🌟",
  },
  {
    title: "💰 Cashback",
    description: "Pay online & get ₹20 cashback",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    accentColor: "#fef3c7",
    icon: "💳",
    sparkles: "💎",
  },
];

const OfferBanner = () => {
  return (
    <>
      <div style={styles.bannerContainer}>
        {/* Floating decorative elements */}
        <div style={styles.floatingElements}>
          <div style={styles.floatingShape1}></div>
          <div style={styles.floatingShape2}></div>
          <div style={styles.floatingShape3}></div>
        </div>

        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            <span style={styles.headerIcon}>🎯</span>
            <span style={styles.headerText}>Special Offers</span>
          </h2>
          <p style={styles.headerSubtitle}>Limited time deals just for you!</p>
        </div>

        {/* Offer Cards Grid */}
        <div style={styles.container} className="offer-banner-grid">
          {offerData.map((offer, idx) => (
            <div
              key={idx}
              style={{
                ...styles.card,
                background: offer.gradient,
                animationDelay: `${idx * 0.1}s`
              }}
              className="offer-card"
            >
              {/* Card background pattern */}
              <div style={styles.cardPattern}></div>
              
              {/* Sparkle effect */}
              <div style={styles.sparkleContainer}>
                <span style={styles.sparkle1}>{offer.sparkles}</span>
                <span style={styles.sparkle2}>{offer.sparkles}</span>
                <span style={styles.sparkle3}>{offer.sparkles}</span>
              </div>

              {/* Card content */}
              <div style={styles.cardContent}>
                <div style={styles.iconContainer}>
                  <span style={styles.icon}>{offer.icon}</span>
                  <div style={styles.iconGlow}></div>
                </div>
                
                <div style={styles.textGroup}>
                  <h3 style={styles.title}>{offer.title}</h3>
                  <p style={styles.description}>{offer.description}</p>
                </div>
              </div>

              {/* Shine effect */}
              <div style={styles.shineEffect}></div>
              
              {/* Corner accent */}
              <div style={{
                ...styles.cornerAccent,
                background: offer.accentColor
              }}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={styles.bottomCTA}>
          <p style={styles.ctaText}>
            🚀 Don't miss out! These offers won't last long
          </p>
        </div>
      </div>

      {/* Enhanced CSS with comprehensive responsive design */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.7; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        .offer-card {
          animation: slideUp 0.6s ease forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .offer-card:hover {
          transform: translateY(-8px) scale(1.03) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 15px 35px rgba(44, 95, 95, 0.1) !important;
        }

        .offer-card:hover .iconContainer {
          transform: scale(1.1) rotate(5deg) !important;
        }

        .offer-card:hover .shineEffect {
          animation: shine 0.8s ease-in-out !important;
        }

        .offer-card:hover .sparkleContainer span {
          animation: sparkle 1s ease-in-out infinite !important;
        }

        .offer-card:hover .iconGlow {
          animation: pulse 1s ease-in-out infinite !important;
        }

        .offer-card:active {
          transform: translateY(-4px) scale(1.01) !important;
        }

        /* Large Desktop (1200px and above) */
        @media (min-width: 1200px) {
          .offer-banner-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 2rem !important;
          }

          .offer-card {
            padding: 1.5rem !important;
            min-height: 140px !important;
          }

          .headerTitle {
            font-size: 2.5rem !important;
          }

          .headerSubtitle {
            font-size: 1.2rem !important;
          }
        }

        /* Standard Desktop (992px to 1199px) */
        @media (min-width: 992px) and (max-width: 1199px) {
          .offer-banner-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.5rem !important;
          }

          .offer-card {
            padding: 1.3rem !important;
            min-height: 130px !important;
          }
        }

        /* Tablet (768px to 991px) */
        @media (min-width: 768px) and (max-width: 991px) {
          .bannerContainer {
            padding: 1.5rem !important;
          }

          .offer-banner-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.2rem !important;
          }

          .offer-card {
            padding: 1.2rem !important;
            min-height: 120px !important;
          }

          .headerTitle {
            font-size: 2rem !important;
          }

          .headerSubtitle {
            font-size: 1rem !important;
          }

          .iconContainer {
            width: 55px !important;
            height: 55px !important;
          }

          .icon {
            font-size: 2rem !important;
          }

          .title {
            font-size: 1.1rem !important;
          }

          .description {
            font-size: 0.85rem !important;
          }
        }

        /* Mobile Large (480px to 767px) */
        @media (min-width: 480px) and (max-width: 767px) {
          .bannerContainer {
            padding: 1rem !important;
            margin: 0.5rem 0 !important;
            border-radius: 16px !important;
          }

          .offer-banner-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
          }

          .offer-card {
            padding: 1rem !important;
            min-height: 110px !important;
            border-radius: 16px !important;
          }

          .headerTitle {
            font-size: 1.8rem !important;
            flex-direction: column !important;
            gap: 0.3rem !important;
          }

          .headerSubtitle {
            font-size: 0.9rem !important;
          }

          .iconContainer {
            width: 50px !important;
            height: 50px !important;
          }

          .icon {
            font-size: 1.8rem !important;
          }

          .title {
            font-size: 1rem !important;
          }

          .description {
            font-size: 0.8rem !important;
            line-height: 1.3 !important;
          }

          .ctaText {
            font-size: 1rem !important;
          }

          .bottomCTA {
            padding: 1.2rem !important;
          }

          .floatingShape1, .floatingShape2, .floatingShape3 {
            width: 40px !important;
            height: 40px !important;
          }
        }

        /* Mobile Medium (360px to 479px) */
        @media (min-width: 360px) and (max-width: 479px) {
          .bannerContainer {
            padding: 0.8rem !important;
            margin: 0.3rem 0 !important;
            border-radius: 12px !important;
          }

          .offer-banner-grid {
            grid-template-columns: 1fr !important;
            gap: 0.8rem !important;
          }

          .offer-card {
            padding: 0.8rem !important;
            min-height: 100px !important;
            border-radius: 12px !important;
          }

          .headerTitle {
            font-size: 1.5rem !important;
            flex-direction: column !important;
            gap: 0.2rem !important;
          }

          .headerSubtitle {
            font-size: 0.85rem !important;
          }

          .cardContent {
            gap: 0.8rem !important;
          }

          .iconContainer {
            width: 45px !important;
            height: 45px !important;
            border-radius: 12px !important;
          }

          .icon {
            font-size: 1.6rem !important;
          }

          .title {
            font-size: 0.9rem !important;
          }

          .description {
            font-size: 0.75rem !important;
            line-height: 1.2 !important;
          }

          .ctaText {
            font-size: 0.9rem !important;
          }

          .bottomCTA {
            padding: 1rem !important;
            margin-top: 1.5rem !important;
          }

          .sparkle1, .sparkle2, .sparkle3 {
            font-size: 0.8rem !important;
          }

          .cornerAccent {
            width: 6px !important;
            height: 6px !important;
            top: 8px !important;
            right: 8px !important;
          }
        }

        /* Mobile Small (320px to 359px) */
        @media (max-width: 359px) {
          .bannerContainer {
            padding: 0.6rem !important;
            margin: 0.2rem 0 !important;
            border-radius: 10px !important;
          }

          .offer-banner-grid {
            grid-template-columns: 1fr !important;
            gap: 0.6rem !important;
          }

          .offer-card {
            padding: 0.6rem !important;
            min-height: 90px !important;
            border-radius: 10px !important;
          }

          .headerTitle {
            font-size: 1.3rem !important;
            flex-direction: column !important;
            gap: 0.1rem !important;
          }

          .headerSubtitle {
            font-size: 0.8rem !important;
          }

          .cardContent {
            gap: 0.6rem !important;
          }

          .iconContainer {
            width: 40px !important;
            height: 40px !important;
            border-radius: 10px !important;
          }

          .icon {
            font-size: 1.4rem !important;
          }

          .title {
            font-size: 0.85rem !important;
          }

          .description {
            font-size: 0.7rem !important;
            line-height: 1.1 !important;
          }

          .ctaText {
            font-size: 0.8rem !important;
          }

          .bottomCTA {
            padding: 0.8rem !important;
            margin-top: 1rem !important;
          }

          .floatingShape1, .floatingShape2, .floatingShape3 {
            width: 25px !important;
            height: 25px !important;
          }
        }

        /* Landscape orientation adjustments */
        @media (max-height: 600px) and (orientation: landscape) {
          .bannerContainer {
            padding: 1rem !important;
          }

          .headerTitle {
            font-size: 1.5rem !important;
          }

          .headerSubtitle {
            font-size: 0.9rem !important;
          }

          .offer-card {
            min-height: 80px !important;
            padding: 0.8rem !important;
          }

          .floatingShape1, .floatingShape2, .floatingShape3 {
            display: none !important;
          }
        }

        /* Ultra-wide screens */
        @media (min-width: 1400px) {
          .bannerContainer {
            max-width: 1200px !important;
            margin: 1rem auto !important;
          }

          .offer-banner-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 2.5rem !important;
          }
        }

        /* High DPI displays */
        @media (min-resolution: 2dppx) {
          .offer-card {
            border-width: 0.5px !important;
          }
        }

        /* Reduced motion accessibility */
        @media (prefers-reduced-motion: reduce) {
          .offer-card {
            animation: none !important;
          }

          .floatingShape1, .floatingShape2, .floatingShape3 {
            animation: none !important;
          }

          .sparkle1, .sparkle2, .sparkle3 {
            animation: none !important;
          }

          .headerIcon {
            animation: none !important;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .offer-card:hover {
            transform: none !important;
          }

          .offer-card:active {
            transform: scale(0.98) !important;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .bannerContainer {
            background: linear-gradient(135deg, rgba(44, 95, 95, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%) !important;
          }
        }
      `}</style>
    </>
  );
};

const styles = {
  bannerContainer: {
    position: "relative",
    width: "100%",
    background: "linear-gradient(135deg, rgba(44, 95, 95, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    padding: "2rem",
    margin: "1rem 0",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    boxShadow: "0 20px 40px rgba(44, 95, 95, 0.1)",
    overflow: "hidden",
    boxSizing: "border-box",
  },

  floatingElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    zIndex: 1,
  },

  floatingShape1: {
    position: "absolute",
    top: "10%",
    left: "5%",
    width: "60px",
    height: "60px",
    background: "linear-gradient(45deg, rgba(44, 95, 95, 0.1), rgba(44, 95, 95, 0.05))",
    borderRadius: "50%",
    animation: "float 6s ease-in-out infinite",
  },

  floatingShape2: {
    position: "absolute",
    top: "60%",
    right: "8%",
    width: "40px",
    height: "40px",
    background: "linear-gradient(45deg, rgba(44, 95, 95, 0.08), rgba(44, 95, 95, 0.03))",
    borderRadius: "50%",
    animation: "float 8s ease-in-out infinite reverse",
  },

  floatingShape3: {
    position: "absolute",
    bottom: "20%",
    left: "15%",
    width: "50px",
    height: "50px",
    background: "linear-gradient(45deg, rgba(44, 95, 95, 0.06), rgba(44, 95, 95, 0.02))",
    borderRadius: "50%",
    animation: "float 7s ease-in-out infinite",
  },

  header: {
    textAlign: "center",
    marginBottom: "2rem",
    position: "relative",
    zIndex: 2,
  },

  headerTitle: {
    fontSize: "2.2rem",
    fontWeight: "800",
    color: "#2C5F5F",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    textShadow: "0 2px 4px rgba(44, 95, 95, 0.1)",
    fontFamily: "'Inter', sans-serif",
    flexWrap: "wrap",
  },

  headerIcon: {
    fontSize: "2rem",
    animation: "pulse 2s ease-in-out infinite",
    flexShrink: 0,
  },

  headerText: {
    flexShrink: 0,
  },

  headerSubtitle: {
    fontSize: "1.1rem",
    color: "#2C5F5F",
    opacity: 0.8,
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
    lineHeight: "1.4",
    maxWidth: "600px",
    margin: "0 auto",
  },

  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
    justifyContent: "center",
    position: "relative",
    zIndex: 2,
  },

  card: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    color: "#fff",
    padding: "1.25rem",
    borderRadius: "20px",
    width: "100%",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2), 0 8px 25px rgba(0, 0, 0, 0.1)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    minHeight: "120px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(15px)",
    boxSizing: "border-box",
  },

  cardPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
    `,
    pointerEvents: "none",
  },

  sparkleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },

  sparkle1: {
    position: "absolute",
    top: "15%",
    right: "15%",
    fontSize: "1rem",
    animation: "sparkle 2s ease-in-out infinite",
    animationDelay: "0s",
  },

  sparkle2: {
    position: "absolute",
    bottom: "20%",
    left: "10%",
    fontSize: "0.8rem",
    animation: "sparkle 2s ease-in-out infinite",
    animationDelay: "0.7s",
  },

  sparkle3: {
    position: "absolute",
    top: "60%",
    right: "25%",
    fontSize: "0.6rem",
    animation: "sparkle 2s ease-in-out infinite",
    animationDelay: "1.4s",
  },

  cardContent: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    width: "100%",
    position: "relative",
    zIndex: 2,
  },

  iconContainer: {
    position: "relative",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    transition: "all 0.3s ease",
    flexShrink: 0,
  },

  icon: {
    fontSize: "2.2rem",
    position: "relative",
    zIndex: 2,
  },

  iconGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "80%",
    height: "80%",
    background: "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  },

  textGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    flex: 1,
    minWidth: 0,
  },

  title: {
    margin: 0,
    fontSize: "1.2rem",
    fontWeight: "700",
    lineHeight: "1.3",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    fontFamily: "'Inter', sans-serif",
    wordBreak: "break-word",
  },

  description: {
    margin: 0,
    fontSize: "0.9rem",
    opacity: 0.9,
    lineHeight: "1.4",
    fontWeight: "500",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Inter', sans-serif",
    wordBreak: "break-word",
  },

  shineEffect: {
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
    transition: "left 0.6s ease",
    pointerEvents: "none",
  },

  cornerAccent: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    opacity: 0.6,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },

  bottomCTA: {
    textAlign: "center",
    marginTop: "2rem",
    padding: "1.5rem",
    background: "linear-gradient(135deg, rgba(44, 95, 95, 0.1) 0%, rgba(44, 95, 95, 0.05) 100%)",
    borderRadius: "16px",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    position: "relative",
    zIndex: 2,
  },

  ctaText: {
    fontSize: "1.1rem",
    color: "#2C5F5F",
    fontWeight: "600",
    margin: 0,
    fontFamily: "'Inter', sans-serif",
    textShadow: "0 1px 2px rgba(44, 95, 95, 0.1)",
    lineHeight: "1.4",
  },
};

export default OfferBanner;
