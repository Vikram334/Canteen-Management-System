import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, updateUserProfile } from "../services/userService";

const ProfilePage = () => {
  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const studentId = localStorage.getItem("student_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!studentId || !token) {
      alert("⚠️ Please login to view profile.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchUserProfile(studentId, token);
        setStudent(data);
        setFormData(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("❌ Failed to load profile.");
      }
    };

    fetchData();
  }, [studentId, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await updateUserProfile(studentId, formData, token);
      const updated = await fetchUserProfile(studentId, token);
      setStudent(updated);
      setFormData(updated);
      setEditMode(false);
      alert("✅ Profile updated!");
    } catch (err) {
      alert("❌ Failed to update profile.");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student_id");
    navigate("/login");
  };

  if (!student) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOverlay}></div>
        <div style={styles.loadingContent}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading your profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Background Image */}
      <div style={styles.backgroundImage}></div>
      <div style={styles.backgroundOverlay}></div>
      
      {/* Floating Shapes */}
      <div style={styles.floatingShapes}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
        <div style={styles.shape4}></div>
      </div>
      
      <div style={styles.profileCard}>
        <div style={styles.cardHeader}>
          <div style={styles.avatarWrapper}>
            <div style={styles.avatarRing}></div>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2U2akySBgSHUK-foX-9SGFmLk6zEuGYNNqw&s"
              alt="User Avatar"
              style={styles.avatar}
            />
            <div style={styles.onlineIndicator}></div>
          </div>
          <h1 style={styles.userName}>👤 {student.name}</h1>
          <div style={styles.userTitle}>Student Profile</div>
        </div>

        <div style={styles.cardBody}>
          {editMode ? (
            <div style={styles.editForm}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>📞 Phone Number</label>
                <input
                  name="ph_no"
                  value={formData.ph_no}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>🏫 Department</label>
                <input
                  name="dept_name"
                  value={formData.dept_name}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter department"
                />
              </div>

              <div style={styles.actionButtons}>
                <button onClick={handleUpdate} style={styles.saveButton} className="action-btn">
                  <span style={styles.buttonIcon}>💾</span>
                  <span style={styles.buttonText}>Save Changes</span>
                </button>
                <button onClick={() => setEditMode(false)} style={styles.cancelButton} className="action-btn">
                  <span style={styles.buttonIcon}>❌</span>
                  <span style={styles.buttonText}>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.profileInfo}>
              <div style={styles.infoGrid}>
                <div style={styles.infoCard} className="info-card">
                  <div style={styles.infoIcon}>📞</div>
                  <div style={styles.infoContent}>
                    <div style={styles.infoLabel}>Phone</div>
                    <div style={styles.infoValue}>{student.ph_no}</div>
                  </div>
                </div>

                <div style={styles.infoCard} className="info-card">
                  <div style={styles.infoIcon}>🏫</div>
                  <div style={styles.infoContent}>
                    <div style={styles.infoLabel}>Department</div>
                    <div style={styles.infoValue}>{student.dept_name}</div>
                  </div>
                </div>

                <div style={styles.infoCard} className="info-card">
                  <div style={styles.infoIcon}>🎁</div>
                  <div style={styles.infoContent}>
                    <div style={styles.infoLabel}>Loyalty Points</div>
                    <div style={styles.infoValue}>{student.Loyalty_points || 0}</div>
                  </div>
                </div>

                <div style={styles.infoCard} className="info-card">
                  <div style={styles.infoIcon}>📅</div>
                  <div style={styles.infoContent}>
                    <div style={styles.infoLabel}>Member Since</div>
                    <div style={styles.infoValue}>
                      {new Date(student.created_At).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.actionButtons}>
                <button onClick={() => setEditMode(true)} style={styles.editButton} className="action-btn">
                  <span style={styles.buttonIcon}>✏️</span>
                  <span style={styles.buttonText}>Edit Profile</span>
                </button>
                <button onClick={handleLogout} style={styles.logoutButton} className="action-btn">
                  <span style={styles.buttonIcon}>🚪</span>
                  <span style={styles.buttonText}>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "1rem",
    boxSizing: "border-box",
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
    backgroundAttachment: "fixed",
    zIndex: -2,
  },

  backgroundOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(44, 95, 95, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)",
    backdropFilter: "blur(8px)",
    zIndex: -1,
  },

  floatingShapes: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: "none",
  },

  shape1: {
    position: "absolute",
    top: "10%",
    left: "8%",
    width: "80px",
    height: "80px",
    background: "linear-gradient(45deg, rgba(44, 95, 95, 0.1), rgba(16, 185, 129, 0.1))",
    borderRadius: "50%",
    animation: "float 6s ease-in-out infinite",
  },

  shape2: {
    position: "absolute",
    top: "60%",
    right: "12%",
    width: "60px",
    height: "60px",
    background: "linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(245, 158, 11, 0.1))",
    borderRadius: "50%",
    animation: "float 8s ease-in-out infinite reverse",
  },

  shape3: {
    position: "absolute",
    bottom: "20%",
    left: "15%",
    width: "50px",
    height: "50px",
    background: "linear-gradient(45deg, rgba(245, 158, 11, 0.1), rgba(44, 95, 95, 0.1))",
    borderRadius: "50%",
    animation: "float 7s ease-in-out infinite",
  },

  shape4: {
    position: "absolute",
    top: "30%",
    right: "25%",
    width: "40px",
    height: "40px",
    background: "linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(44, 95, 95, 0.1))",
    borderRadius: "50%",
    animation: "float 9s ease-in-out infinite reverse",
  },

  profileCard: {
    position: "relative",
    zIndex: 1,
    background: "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
    backdropFilter: "blur(20px)",
    padding: "0",
    borderRadius: "24px",
    boxShadow: "0 25px 50px rgba(44, 95, 95, 0.2), 0 15px 35px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
    width: "100%",
    maxWidth: "520px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
    margin: "0 auto",
  },

  cardHeader: {
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 50%, #2C5F5F 100%)",
    padding: "3rem 2rem 2rem 2rem",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },

  avatarWrapper: {
    position: "relative",
    display: "inline-block",
    marginBottom: "1.5rem",
  },

  avatarRing: {
    position: "absolute",
    top: "-8px",
    left: "-8px",
    right: "-8px",
    bottom: "-8px",
    background: "linear-gradient(45deg, #10b981, #f59e0b, #10b981)",
    borderRadius: "50%",
    animation: "rotate 3s linear infinite",
    zIndex: 1,
  },

  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid rgba(255, 255, 255, 0.9)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    position: "relative",
    zIndex: 2,
  },

  onlineIndicator: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    width: "24px",
    height: "24px",
    background: "linear-gradient(45deg, #10b981, #059669)",
    borderRadius: "50%",
    border: "3px solid white",
    zIndex: 3,
    animation: "pulse 2s infinite",
  },

  userName: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "white",
    marginBottom: "0.5rem",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    wordBreak: "break-word",
  },

  userTitle: {
    fontSize: "1rem",
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "400",
    letterSpacing: "0.5px",
  },

  cardBody: {
    padding: "2rem",
  },

  editForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#2C5F5F",
    marginBottom: "0.5rem",
  },

  input: {
    padding: "1rem 1.2rem",
    borderRadius: "12px",
    border: "2px solid rgba(44, 95, 95, 0.1)",
    fontSize: "1rem",
    background: "rgba(248, 250, 252, 0.8)",
    transition: "all 0.3s ease",
    outline: "none",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    width: "100%",
    boxSizing: "border-box",
  },

  profileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },

  infoCard: {
    background: "linear-gradient(135deg, rgba(44, 95, 95, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)",
    padding: "1.5rem",
    borderRadius: "16px",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },

  infoIcon: {
    fontSize: "2rem",
    padding: "0.8rem",
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(44, 95, 95, 0.3)",
    minWidth: "3rem",
    minHeight: "3rem",
    flexShrink: 0,
  },

  infoContent: {
    flex: 1,
    minWidth: 0,
  },

  infoLabel: {
    fontSize: "0.8rem",
    color: "#64748b",
    fontWeight: "500",
    marginBottom: "0.2rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  infoValue: {
    fontSize: "1rem",
    color: "#2C5F5F",
    fontWeight: "600",
    lineHeight: "1.2",
    wordBreak: "break-word",
  },

  actionButtons: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
  },

  editButton: {
    flex: 1,
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    color: "white",
    border: "none",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 20px rgba(44, 95, 95, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    minHeight: "48px",
  },

  logoutButton: {
    flex: 1,
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "white",
    border: "none",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 20px rgba(239, 68, 68, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    minHeight: "48px",
  },

  saveButton: {
    flex: 1,
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    minHeight: "48px",
  },

  cancelButton: {
    flex: 1,
    background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
    color: "white",
    border: "none",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 20px rgba(107, 114, 128, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    minHeight: "48px",
  },

  buttonIcon: {
    fontSize: "1.2rem",
    flexShrink: 0,
  },

  buttonText: {
    fontSize: "1rem",
    fontWeight: "600",
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100vw",
    position: "relative",
    padding: "1rem",
    boxSizing: "border-box",
  },

  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    zIndex: -1,
  },

  loadingContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
    textAlign: "center",
  },

  loadingSpinner: {
    width: "60px",
    height: "60px",
    border: "4px solid rgba(255, 255, 255, 0.3)",
    borderTop: "4px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem",
  },

  loadingText: {
    fontSize: "1.2rem",
    fontWeight: "500",
  },
};

// Enhanced CSS animations with responsive design
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Enhanced hover effects */
  .action-btn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  }

  .action-btn:active {
    transform: translateY(-1px) scale(1.01);
  }

  input:focus {
    border-color: #2C5F5F;
    box-shadow: 0 0 0 3px rgba(44, 95, 95, 0.1);
  }

  .info-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(44, 95, 95, 0.15);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .container {
      padding: 0.5rem !important;
      align-items: flex-start !important;
      padding-top: 1rem !important;
    }

    .profileCard {
      max-width: 100% !important;
      margin: 0 !important;
      border-radius: 20px !important;
    }

    .cardHeader {
      padding: 2rem 1.5rem 1.5rem 1.5rem !important;
    }

    .avatar {
      width: 100px !important;
      height: 100px !important;
    }

    .userName {
      font-size: 1.6rem !important;
    }

    .userTitle {
      font-size: 0.9rem !important;
    }

    .cardBody {
      padding: 1.5rem !important;
    }

    .infoGrid {
      grid-template-columns: 1fr !important;
      gap: 0.8rem !important;
    }

    .infoCard {
      padding: 1.2rem !important;
    }

    .infoIcon {
      font-size: 1.5rem !important;
      padding: 0.6rem !important;
      min-width: 2.5rem !important;
      min-height: 2.5rem !important;
    }

    .infoLabel {
      font-size: 0.75rem !important;
    }

    .infoValue {
      font-size: 0.95rem !important;
    }

    .actionButtons {
      flex-direction: column !important;
      gap: 0.8rem !important;
    }

    .editButton, .logoutButton, .saveButton, .cancelButton {
      width: 100% !important;
      padding: 0.8rem 1.2rem !important;
      font-size: 0.9rem !important;
    }

    .buttonIcon {
      font-size: 1.1rem !important;
    }

    .buttonText {
      font-size: 0.9rem !important;
    }

    .shape1, .shape2, .shape3, .shape4 {
      width: 40px !important;
      height: 40px !important;
    }

    .shape1 {
      top: 5% !important;
      left: 5% !important;
    }

    .shape2 {
      top: 70% !important;
      right: 5% !important;
    }

    .shape3 {
      bottom: 25% !important;
      left: 10% !important;
    }

    .shape4 {
      top: 40% !important;
      right: 20% !important;
    }

    .loadingSpinner {
      width: 50px !important;
      height: 50px !important;
    }

    .loadingText {
      font-size: 1.1rem !important;
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: 0.25rem !important;
      padding-top: 0.5rem !important;
    }

    .profileCard {
      border-radius: 16px !important;
    }

    .cardHeader {
      padding: 1.5rem 1rem 1rem 1rem !important;
    }

    .avatar {
      width: 80px !important;
      height: 80px !important;
    }

    .onlineIndicator {
      width: 20px !important;
      height: 20px !important;
      border-width: 2px !important;
    }

    .userName {
      font-size: 1.4rem !important;
    }

    .userTitle {
      font-size: 0.8rem !important;
    }

    .cardBody {
      padding: 1rem !important;
    }

    .infoCard {
      padding: 1rem !important;
      gap: 0.8rem !important;
    }

    .infoIcon {
      font-size: 1.3rem !important;
      padding: 0.5rem !important;
      min-width: 2rem !important;
      min-height: 2rem !important;
    }

    .infoLabel {
      font-size: 0.7rem !important;
    }

    .infoValue {
      font-size: 0.9rem !important;
    }

    .editButton, .logoutButton, .saveButton, .cancelButton {
      padding: 0.75rem 1rem !important;
      font-size: 0.85rem !important;
      min-height: 44px !important;
    }

    .buttonIcon {
      font-size: 1rem !important;
    }

    .buttonText {
      font-size: 0.85rem !important;
    }

    .label {
      font-size: 0.85rem !important;
    }

    .input {
      padding: 0.8rem 1rem !important;
      font-size: 0.9rem !important;
    }

    .shape1, .shape2, .shape3, .shape4 {
      width: 30px !important;
      height: 30px !important;
    }
  }

  @media (max-width: 360px) {
    .userName {
      font-size: 1.2rem !important;
    }

    .infoCard {
      padding: 0.8rem !important;
    }

    .infoIcon {
      font-size: 1.2rem !important;
      padding: 0.4rem !important;
      min-width: 1.8rem !important;
      min-height: 1.8rem !important;
    }

    .editButton, .logoutButton, .saveButton, .cancelButton {
      padding: 0.7rem 0.8rem !important;
      font-size: 0.8rem !important;
    }
  }

  /* Landscape orientation adjustments */
  @media (max-height: 600px) and (orientation: landscape) {
    .container {
      align-items: flex-start !important;
      padding-top: 0.5rem !important;
      padding-bottom: 0.5rem !important;
    }

    .cardHeader {
      padding: 1.5rem 2rem 1rem 2rem !important;
    }

    .avatar {
      width: 80px !important;
      height: 80px !important;
    }

    .userName {
      font-size: 1.5rem !important;
    }

    .shape1, .shape2, .shape3, .shape4 {
      display: none !important;
    }
  }

  /* High DPI displays */
  @media (min-resolution: 2dppx) {
    .avatar {
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }
  }

  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .backgroundOverlay {
      background: linear-gradient(135deg, rgba(44, 95, 95, 0.2) 0%, rgba(0, 0, 0, 0.3) 100%) !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default ProfilePage;
