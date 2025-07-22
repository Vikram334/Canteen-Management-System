import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import ThankYouPage from "./pages/ThankYouPage";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Loader from "./pages/Loader";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import OrderHistory from "./pages/OrderHistory";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageItems from "./pages/ManageItems";
import RequireAdminAuth from "./components/RequireAdminAuth";
import SignupPage from "./pages/SignupPage";




function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student_id");
    setIsLoggedIn(false);
  };

  if (loading) return <Loader />;

  return (
    <Router>
      <ScrollToTop />
      {/* Show Navbar only on student routes (not admin login/dashboard) */}
      {!window.location.pathname.startsWith("/admin") && (
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      )}
      <main style={styles.main}>
        <Routes>
          {/* Student Auth Routes */}
          <Route path="/" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />} />

          <Route
            path="/cart"
            element={isLoggedIn ? <CartPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/thank-you"
            element={isLoggedIn ? <ThankYouPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/orders"
            element={isLoggedIn ? <OrderHistory /> : <Navigate to="/login" replace />}
          />
        <Route path="/signup" element={<SignupPage />} />
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAdminAuth>
                <AdminDashboard />
              </RequireAdminAuth>
            }
          />
          <Route
            path="/admin/items"
            element={
              <RequireAdminAuth>
                <ManageItems />
              </RequireAdminAuth>
            }
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

const styles = {
  main: {
    paddingTop: "80px",
    paddingBottom: "40px",
    minHeight: "calc(100vh - 120px)",
    backgroundColor: "#f9f9f9",
  },
};

export default App;
