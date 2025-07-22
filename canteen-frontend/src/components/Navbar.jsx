import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = ({ isLoggedIn, onLogout, isLoading = false }) => {
  const { cartItems } = useCart();
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const [scrollY, setScrollY] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /* ─────────────────────────────  Effects  ───────────────────────────── */
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ────────────────────────────  Handlers  ───────────────────────────── */
  const handleLogout = () => {
    onLogout();
    setShowProfileDropdown(false);
    navigate("/login");
  };
  const isActivePath = (path) => location.pathname === path;

  /* ────────────────────────────  Dynamic styles  ─────────────────────── */
  const headerStyle = {
    ...styles.header,
    background:
      scrollY > 10 ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.9)",
    backdropFilter: scrollY > 10 ? "blur(20px)" : "blur(15px)",
    boxShadow:
      scrollY > 10
        ? "0 8px 32px rgba(44,95,95,0.15), 0 4px 16px rgba(0,0,0,0.1)"
        : "0 4px 20px rgba(44,95,95,0.1)",
  };

  const getNavLinkStyle = (path) => ({
    ...styles.navLink,
    background: isActivePath(path)
      ? "linear-gradient(135deg,#2C5F5F 0%,#1e4a4a 100%)"
      : "rgba(255,255,255,0.8)",
    color: isActivePath(path) ? "#ffffff" : "#2C5F5F",
    boxShadow: isActivePath(path)
      ? "0 8px 25px rgba(44,95,95,0.3), inset 0 1px 0 rgba(255,255,255,0.2)"
      : "0 4px 15px rgba(44,95,95,0.1)",
    transform: isActivePath(path) ? "translateY(-2px)" : "translateY(0)",
  });

  /* ──────────────────────────────  JSX  ──────────────────────────────── */
  return (
    <>
      <header style={headerStyle}>
        <div style={styles.container}>
          {/* ─────────  Logo  ───────── */}
          <Link to="/" style={styles.logo} className="logo">
            <div style={styles.logoIconContainer}>
              <span style={styles.logoIcon}>🍽️</span>
              <div style={styles.logoIconGlow} />
            </div>
            <div style={styles.logoTextContainer}>
              <span style={styles.logoText}>Canteen</span>
              <span style={styles.logoSubtext}>Fresh & Delicious</span>
            </div>
          </Link>

          {/* ─────────  Desktop Navigation  ───────── */}
          <nav style={styles.nav} className="desktop-nav">
            <Link to="/" style={getNavLinkStyle("/")} aria-label="Home">
              <span style={styles.navIcon}>🏠</span>
              <span style={styles.navText}>Home</span>
            </Link>

            <Link to="/menu" style={getNavLinkStyle("/menu")} aria-label="Menu">
              <span style={styles.navIcon}>📋</span>
              <span style={styles.navText}>Menu</span>
            </Link>

            <Link
              to="/orders"
              style={getNavLinkStyle("/orders")}
              aria-label="Orders"
            >
              <span style={styles.navIcon}>📦</span>
              <span style={styles.navText}>Orders</span>
            </Link>

            <Link
              to="/cart"
              style={getNavLinkStyle("/cart")}
              className="cart-link"
              aria-label={`Cart with ${cartCount} items`}
            >
              <span style={styles.navIcon}>🛒</span>
              <span style={styles.navText}>Cart</span>

              {cartCount > 0 && (
                <div style={styles.badgeContainer}>
                  <span style={styles.badge}>
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                  <div style={styles.badgePulse} />
                </div>
              )}
            </Link>

            {/* ─────────  Right-side Controls  ───────── */}
            {isLoading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner} />
                <span style={styles.loadingText}>Loading…</span>
              </div>
            ) : isLoggedIn ? (
              /* Profile dropdown when logged in */
              <div style={styles.profileContainer}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  style={styles.profileButton}
                  className="profile-btn"
                  aria-label="Profile menu"
                >
                  <div style={styles.profileAvatar}>
                    <span style={styles.profileIcon}>👤</span>
                  </div>
                  <span style={styles.profileText}>Profile</span>
                  <span
                    style={{
                      ...styles.dropdownArrow,
                      transform: showProfileDropdown
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    ▼
                  </span>
                </button>

                {showProfileDropdown && (
                  <div style={styles.dropdown}>
                    <div style={styles.dropdownHeader}>
                      <span style={styles.dropdownTitle}>Account</span>
                    </div>

                    <Link
                      to="/profile"
                      style={styles.dropdownItem}
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <span style={styles.dropdownItemIcon}>👤</span>
                      <span style={styles.dropdownItemText}>My Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      style={styles.dropdownItem}
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <span style={styles.dropdownItemIcon}>📦</span>
                      <span style={styles.dropdownItemText}>My Orders</span>
                    </Link>

                    <Link
                      to="/settings"
                      style={styles.dropdownItem}
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <span style={styles.dropdownItemIcon}>⚙️</span>
                      <span style={styles.dropdownItemText}>Settings</span>
                    </Link>

                    <div style={styles.dropdownDivider} />

                    <button
                      onClick={handleLogout}
                      style={styles.dropdownItemButton}
                    >
                      <span style={styles.dropdownItemIcon}>🚪</span>
                      <span style={styles.dropdownItemText}>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login & NEW Sign-Up buttons when not logged in */
              <>
                <Link to="/login" style={styles.loginButton} className="login-btn">
                  <span style={styles.loginIcon}>🔑</span>
                  <span style={styles.loginText}>Login</span>
                </Link>

                <Link
                  to="/signup"
                  style={styles.signupButton}
                  className="signup-btn"
                >
                  <span style={styles.signupIcon}>📝</span>
                  <span style={styles.signupText}>Sign Up</span>
                </Link>
              </>
            )}
          </nav>

          {/* ─────────  Mobile Menu Toggle  ───────── */}
          <button
            style={styles.mobileMenuButton}
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle mobile menu"
          >
            <div style={styles.hamburgerContainer}>
              <div
                style={{
                  ...styles.hamburgerLine,
                  transform: showMobileMenu
                    ? "rotate(45deg) translate(5px,5px)"
                    : "rotate(0)",
                }}
              />
              <div
                style={{
                  ...styles.hamburgerLine,
                  opacity: showMobileMenu ? 0 : 1,
                }}
              />
              <div
                style={{
                  ...styles.hamburgerLine,
                  transform: showMobileMenu
                    ? "rotate(-45deg) translate(7px,-6px)"
                    : "rotate(0)",
                }}
              />
            </div>
          </button>
        </div>

        {/* ─────────  Mobile Navigation Drawer  ───────── */}
        <div
          style={{
            ...styles.mobileMenu,
            maxHeight: showMobileMenu ? "500px" : "0",
            opacity: showMobileMenu ? 1 : 0,
            transform: showMobileMenu ? "translateY(0)" : "translateY(-10px)",
          }}
        >
          {[
            { to: "/", label: "Home", icon: "🏠" },
            { to: "/menu", label: "Menu", icon: "📋" },
            { to: "/orders", label: "Orders", icon: "📦" },
            {
              to: "/cart",
              label: `Cart ${cartCount ? `(${cartCount})` : ""}`,
              icon: "🛒",
            },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={styles.mobileNavLink}
              onClick={() => setShowMobileMenu(false)}
            >
              <span style={styles.mobileNavIcon}>{item.icon}</span>
              <span style={styles.mobileNavText}>{item.label}</span>
            </Link>
          ))}

          {/* Divider */}
          <div style={styles.mobileDivider} />

          {/* Auth section */}
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                style={styles.mobileNavLink}
                onClick={() => setShowMobileMenu(false)}
              >
                <span style={styles.mobileNavIcon}>👤</span>
                <span style={styles.mobileNavText}>Profile</span>
              </Link>

              <Link
                to="/settings"
                style={styles.mobileNavLink}
                onClick={() => setShowMobileMenu(false)}
              >
                <span style={styles.mobileNavIcon}>⚙️</span>
                <span style={styles.mobileNavText}>Settings</span>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                style={styles.mobileLogoutButton}
              >
                <span style={styles.mobileNavIcon}>🚪</span>
                <span style={styles.mobileNavText}>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={styles.mobileNavLink}
                onClick={() => setShowMobileMenu(false)}
              >
                <span style={styles.mobileNavIcon}>🔑</span>
                <span style={styles.mobileNavText}>Login</span>
              </Link>

              <Link
                to="/signup"
                style={styles.mobileNavLink}
                onClick={() => setShowMobileMenu(false)}
              >
                <span style={styles.mobileNavIcon}>📝</span>
                <span style={styles.mobileNavText}>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Dimmed background when mobile drawer is open */}
      {showMobileMenu && (
        <div
          style={styles.overlay}
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </>
  );
};

const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    borderTop: "none",
    width: "100%",
    fontFamily: "'Inter', sans-serif",
  },
  signupButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "600",
    padding: "10px 20px",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    background: "linear-gradient(135deg,#FF8C42 0%,#FF7350 100%)",
    border: "1px solid rgba(255,140,66,0.3)",
    boxShadow: "0 8px 25px rgba(255,140,66,0.35)",
    color: "white",
    backdropFilter: "blur(15px)",
    position: "relative",
    overflow: "hidden",
  },
  signupIcon: { fontSize: "1rem" },
  signupText: { fontWeight: "600" },

  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    maxWidth: "1400px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  left: {
    display: "flex",
    alignItems: "center",
    zIndex: 1001,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "16px",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.15)",
    position: "relative",
    overflow: "hidden",
  },
  logoIconContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    fontSize: "2rem",
    transition: "all 0.3s ease",
    position: "relative",
    zIndex: 2,
  },
  logoIconGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle, rgba(44, 95, 95, 0.2) 0%, transparent 70%)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    animation: "glow 3s ease-in-out infinite alternate",
  },
  logoTextContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
  },
  logoText: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#2C5F5F",
    letterSpacing: "-0.5px",
    transition: "all 0.3s ease",
    lineHeight: "1.2",
  },
  logoSubtext: {
    fontSize: "0.7rem",
    color: "#2C5F5F",
    opacity: 0.7,
    fontWeight: "500",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    padding: "8px",
    borderRadius: "20px",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.1)",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "600",
    position: "relative",
    padding: "10px 16px",
    borderRadius: "12px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    whiteSpace: "nowrap",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    backdropFilter: "blur(15px)",
    overflow: "hidden",
  },
  navIcon: {
    fontSize: "1.1rem",
    transition: "all 0.3s ease",
  },
  navText: {
    transition: "all 0.3s ease",
    fontWeight: "600",
    letterSpacing: "0.3px",
  },
  profileContainer: {
    position: "relative",
  },
  profileButton: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "600",
    padding: "8px 16px",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    border: "1px solid rgba(44, 95, 95, 0.2)",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.3)",
    whiteSpace: "nowrap",
    cursor: "pointer",
    backdropFilter: "blur(15px)",
    color: "white",
    position: "relative",
    overflow: "hidden",
  },
  profileAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  profileIcon: {
    fontSize: "1rem",
    transition: "all 0.3s ease",
  },
  profileText: {
    transition: "all 0.3s ease",
    fontWeight: "600",
    color: "white",
  },
  dropdownArrow: {
    fontSize: "0.8rem",
    transition: "all 0.3s ease",
    color: "rgba(255, 255, 255, 0.8)",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(44, 95, 95, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)",
    minWidth: "200px",
    zIndex: 1002,
    overflow: "hidden",
    animation: "slideDown 0.3s ease",
  },
  dropdownHeader: {
    padding: "12px 16px 8px 16px",
    borderBottom: "1px solid rgba(44, 95, 95, 0.1)",
    background: "linear-gradient(135deg, rgba(44, 95, 95, 0.05) 0%, rgba(44, 95, 95, 0.02) 100%)",
  },
  dropdownTitle: {
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#2C5F5F",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    color: "#2C5F5F",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    borderBottom: "1px solid rgba(44, 95, 95, 0.05)",
    position: "relative",
    overflow: "hidden",
  },
  dropdownItemIcon: {
    fontSize: "1rem",
    width: "20px",
    textAlign: "center",
  },
  dropdownItemText: {
    flex: 1,
    fontWeight: "500",
  },
  dropdownDivider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(44, 95, 95, 0.2), transparent)",
    margin: "4px 0",
  },
  dropdownItemButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    background: "none",
    border: "none",
    color: "#ef4444",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "left",
    position: "relative",
    overflow: "hidden",
  },
  loginButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "600",
    padding: "10px 20px",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    border: "1px solid rgba(44, 95, 95, 0.2)",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.3)",
    whiteSpace: "nowrap",
    color: "white",
    backdropFilter: "blur(15px)",
    position: "relative",
    overflow: "hidden",
  },
  loginIcon: {
    fontSize: "1rem",
    transition: "all 0.3s ease",
  },
  loginText: {
    transition: "all 0.3s ease",
    fontWeight: "600",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    background: "rgba(44, 95, 95, 0.1)",
    borderRadius: "12px",
    backdropFilter: "blur(15px)",
  },
  loadingSpinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(44, 95, 95, 0.2)",
    borderTop: "2px solid #2C5F5F",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "0.9rem",
    color: "#2C5F5F",
    fontWeight: "500",
  },
  badgeContainer: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
  },
  badge: {
    position: "relative",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "white",
    borderRadius: "50%",
    padding: "4px 8px",
    fontSize: "0.7rem",
    fontWeight: "700",
    minWidth: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
    border: "2px solid white",
    zIndex: 2,
  },
  badgePulse: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    background: "rgba(239, 68, 68, 0.4)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    animation: "pulse 2s infinite",
  },
  
  // Mobile styles
  mobileMenuButton: {
    display: "none",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    borderRadius: "12px",
    padding: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(44, 95, 95, 0.1)",
  },
  hamburgerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    width: "20px",
    height: "16px",
  },
  hamburgerLine: {
    width: "100%",
    height: "2px",
    background: "#2C5F5F",
    borderRadius: "2px",
    transition: "all 0.3s ease",
  },
  mobileMenu: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(44, 95, 95, 0.1)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.1)",
  },
  mobileNavLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 24px",
    color: "#2C5F5F",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    borderBottom: "1px solid rgba(44, 95, 95, 0.05)",
    position: "relative",
    overflow: "hidden",
  },
  mobileNavIcon: {
    fontSize: "1.2rem",
    width: "24px",
    textAlign: "center",
  },
  mobileNavText: {
    flex: 1,
    fontWeight: "500",
  },
  mobileCartBadge: {
    color: "#ef4444",
    fontWeight: "700",
    fontSize: "0.9rem",
  },
  mobileDivider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(44, 95, 95, 0.2), transparent)",
    margin: "8px 0",
  },
  mobileLogoutButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 24px",
    background: "none",
    border: "none",
    color: "#ef4444",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "left",
    position: "relative",
    overflow: "hidden",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    zIndex: 999,
  },
};

// Enhanced CSS animations and hover effects
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes glow {
    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
    50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.3; }
  }
  
  @keyframes slideDown {
    0% { opacity: 0; transform: translateY(-10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  /* Enhanced hover effects */
  .logo:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 12px 30px rgba(44, 95, 95, 0.2) !important;
  }
  
  .logo:hover .logoIcon {
    transform: scale(1.1) !important;
  }
  
  .nav-link:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 12px 30px rgba(44, 95, 95, 0.2) !important;
  }
  
  .nav-link:hover .navIcon {
    transform: scale(1.1) !important;
  }
  
  .profile-btn:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 15px 35px rgba(44, 95, 95, 0.4) !important;
  }
  
  .profile-btn:hover .profileAvatar {
    transform: scale(1.1) !important;
    background: rgba(255, 255, 255, 0.3) !important;
  }
  
  .login-btn:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 15px 35px rgba(44, 95, 95, 0.4) !important;
  }
  
  .dropdown-item:hover {
    background: linear-gradient(135deg, rgba(44, 95, 95, 0.05) 0%, rgba(44, 95, 95, 0.02) 100%) !important;
    transform: translateX(5px) !important;
  }
  
  .dropdown-item:hover::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%);
  }
  
  .dropdown-item-button:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%) !important;
    transform: translateX(5px) !important;
  }
  
  .dropdown-item-button:hover::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
  
  .mobile-menu-btn:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 8px 20px rgba(44, 95, 95, 0.2) !important;
  }
  
  .mobile-nav-link:hover {
    background: linear-gradient(135deg, rgba(44, 95, 95, 0.05) 0%, rgba(44, 95, 95, 0.02) 100%) !important;
    transform: translateX(8px) !important;
  }
  
  .mobile-nav-link:hover::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%);
  }
  
  .mobile-logout-button:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%) !important;
    transform: translateX(8px) !important;
  }
  
  .mobile-logout-button:hover::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .desktop-nav {
      display: none !important;
    }
    
    .mobile-menu-btn {
      display: block !important;
    }
    
    .mobile-menu {
      display: flex !important;
    }
    
    .container {
      padding: 8px 16px !important;
    }
    
    .logoText {
      font-size: 1.3rem !important;
    }
    
    .logoSubtext {
      font-size: 0.6rem !important;
    }
  }
  
  @media (max-width: 480px) {
    .logoTextContainer {
      display: none !important;
    }
    
    .container {
      padding: 8px 12px !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Navbar;
