import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupStudent } from "../services/studentService";

const SignupPage = () => {
  const [form, setForm] = useState({
    student_id: "",
    password: "",
    name: "",
    ph_no: "",
    dept_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const departments = [
    "Computer Science", "Information Technology", "Electronics", 
    "Mechanical", "Civil", "Electrical", "Chemical", "Other"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.student_id) newErrors.student_id = "Student ID is required";
    else if (!/^\d+$/.test(form.student_id)) newErrors.student_id = "Student ID must be numeric";
    
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!form.name) newErrors.name = "Full name is required";
    else if (form.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    
    if (!form.ph_no) newErrors.ph_no = "Phone number is required";
    else if (!/^\d{10}$/.test(form.ph_no)) newErrors.ph_no = "Phone number must be 10 digits";
    
    if (!form.dept_name) newErrors.dept_name = "Department is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        student_id: Number(form.student_id),
        ph_no: Number(form.ph_no),
      };

      await signupStudent(payload);
      
      // Success animation/notification could go here
      setTimeout(() => {
        alert("✅ Signup successful! Please login to continue.");
        navigate("/login");
      }, 500);
      
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      
      if (err.response?.status === 409) {
        setErrors({ student_id: "Student ID already exists" });
      } else {
        alert("❌ Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Image */}
      <div style={styles.backgroundImage}></div>
      <div style={styles.backgroundOverlay}></div>
      
      {/* Floating Decorative Elements */}
      <div style={styles.floatingElements}>
        <div style={styles.floatingShape1}></div>
        <div style={styles.floatingShape2}></div>
        <div style={styles.floatingShape3}></div>
        <div style={styles.floatingShape4}></div>
      </div>

      <div style={styles.signupCard}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>🎓</span>
            <div style={styles.logoGlow}></div>
          </div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join our canteen community today!</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🆔</span>
              Student ID
            </label>
            <input
              name="student_id"
              type="text"
              placeholder="Enter your student ID"
              onChange={handleChange}
              value={form.student_id}
              style={{
                ...styles.input,
                ...(errors.student_id ? styles.inputError : {})
              }}
              disabled={loading}
            />
            {errors.student_id && (
              <span style={styles.errorText}>{errors.student_id}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>👤</span>
              Full Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              onChange={handleChange}
              value={form.name}
              style={{
                ...styles.input,
                ...(errors.name ? styles.inputError : {})
              }}
              disabled={loading}
            />
            {errors.name && (
              <span style={styles.errorText}>{errors.name}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>📞</span>
              Phone Number
            </label>
            <input
              name="ph_no"
              type="tel"
              placeholder="Enter 10-digit phone number"
              onChange={handleChange}
              value={form.ph_no}
              style={{
                ...styles.input,
                ...(errors.ph_no ? styles.inputError : {})
              }}
              disabled={loading}
            />
            {errors.ph_no && (
              <span style={styles.errorText}>{errors.ph_no}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🏫</span>
              Department
            </label>
            <select
              name="dept_name"
              onChange={handleChange}
              value={form.dept_name}
              style={{
                ...styles.select,
                ...(errors.dept_name ? styles.inputError : {})
              }}
              disabled={loading}
            >
              <option value="">Select your department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.dept_name && (
              <span style={styles.errorText}>{errors.dept_name}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🔒</span>
              Password
            </label>
            <div style={styles.passwordContainer}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                onChange={handleChange}
                value={form.password}
                style={{
                  ...styles.passwordInput,
                  ...(errors.password ? styles.inputError : {})
                }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
                disabled={loading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <span style={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.signupButton,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? (
              <>
                <div style={styles.buttonSpinner}></div>
                Creating Account...
              </>
            ) : (
              <>
                <span style={styles.buttonIcon}>🚀</span>
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{" "}
            <Link to="/login" style={styles.loginLink}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
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
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden",
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
    zIndex: -2,
  },

  backgroundOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(44, 95, 95, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)",
    backdropFilter: "blur(5px)",
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
    top: "10%",
    left: "10%",
    width: "80px",
    height: "80px",
    background: "linear-gradient(45deg, rgba(44, 95, 95, 0.1), rgba(44, 95, 95, 0.05))",
    borderRadius: "50%",
    animation: "float 8s ease-in-out infinite",
  },

  floatingShape2: {
    position: "absolute",
    top: "70%",
    right: "15%",
    width: "60px",
    height: "60px",
    background: "linear-gradient(45deg, rgba(255, 140, 66, 0.1), rgba(255, 140, 66, 0.05))",
    borderRadius: "50%",
    animation: "float 10s ease-in-out infinite reverse",
  },

  floatingShape3: {
    position: "absolute",
    bottom: "20%",
    left: "20%",
    width: "70px",
    height: "70px",
    background: "linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))",
    borderRadius: "50%",
    animation: "float 9s ease-in-out infinite",
  },

  floatingShape4: {
    position: "absolute",
    top: "40%",
    right: "30%",
    width: "50px",
    height: "50px",
    background: "linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))",
    borderRadius: "50%",
    animation: "float 11s ease-in-out infinite reverse",
  },

  signupCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    padding: "2.5rem",
    borderRadius: "24px",
    boxShadow: "0 25px 50px rgba(44, 95, 95, 0.2), 0 15px 35px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(44, 95, 95, 0.1)",
    width: "100%",
    maxWidth: "480px",
    position: "relative",
    zIndex: 1,
    overflow: "hidden",
  },

  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },

  logoContainer: {
    position: "relative",
    display: "inline-block",
    marginBottom: "1rem",
  },

  logoIcon: {
    fontSize: "3rem",
    position: "relative",
    zIndex: 2,
  },

  logoGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "80px",
    height: "80px",
    background: "radial-gradient(circle, rgba(44, 95, 95, 0.2) 0%, transparent 70%)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    animation: "pulse 3s ease-in-out infinite",
  },

  title: {
    fontSize: "2.2rem",
    fontWeight: "800",
    color: "#2C5F5F",
    marginBottom: "0.5rem",
    textShadow: "0 2px 4px rgba(44, 95, 95, 0.1)",
  },

  subtitle: {
    fontSize: "1.1rem",
    color: "#6b7280",
    fontWeight: "500",
    margin: 0,
  },

  form: {
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
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#2C5F5F",
  },

  labelIcon: {
    fontSize: "1rem",
  },

  input: {
    padding: "1rem 1.2rem",
    border: "2px solid rgba(44, 95, 95, 0.1)",
    borderRadius: "12px",
    fontSize: "1rem",
    background: "rgba(248, 250, 252, 0.8)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
  },

  select: {
    padding: "1rem 1.2rem",
    border: "2px solid rgba(44, 95, 95, 0.1)",
    borderRadius: "12px",
    fontSize: "1rem",
    background: "rgba(248, 250, 252, 0.8)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },

  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  passwordInput: {
    padding: "1rem 3rem 1rem 1.2rem",
    border: "2px solid rgba(44, 95, 95, 0.1)",
    borderRadius: "12px",
    fontSize: "1rem",
    background: "rgba(248, 250, 252, 0.8)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    width: "100%",
    boxSizing: "border-box",
  },

  passwordToggle: {
    position: "absolute",
    right: "1rem",
    background: "none",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    padding: "0.5rem",
    borderRadius: "6px",
    transition: "all 0.3s ease",
  },

  inputError: {
    borderColor: "#ef4444",
    boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)",
  },

  errorText: {
    fontSize: "0.8rem",
    color: "#ef4444",
    fontWeight: "500",
    marginTop: "0.3rem",
  },

  signupButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "1.2rem 2rem",
    background: "linear-gradient(135deg, #2C5F5F 0%, #1e4a4a 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(44, 95, 95, 0.3)",
    position: "relative",
    overflow: "hidden",
    marginTop: "1rem",
  },

  buttonIcon: {
    fontSize: "1.2rem",
  },

  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
    transform: "none",
  },

  buttonSpinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  footer: {
    marginTop: "2rem",
    textAlign: "center",
    padding: "1.5rem 0",
    borderTop: "1px solid rgba(44, 95, 95, 0.1)",
  },

  footerText: {
    fontSize: "0.9rem",
    color: "#6b7280",
    margin: 0,
  },

  loginLink: {
    color: "#2C5F5F",
    fontWeight: "600",
    textDecoration: "none",
    transition: "all 0.3s ease",
  },
};

// Enhanced CSS animations and responsive design
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(3deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Enhanced focus and hover states */
  input:focus, select:focus {
    border-color: #2C5F5F !important;
    box-shadow: 0 0 0 3px rgba(44, 95, 95, 0.1) !important;
    transform: translateY(-1px);
  }
  
  .signupButton:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 30px rgba(44, 95, 95, 0.4);
  }
  
  .signupButton:active:not(:disabled) {
    transform: translateY(-1px) scale(1.01);
  }
  
  .passwordToggle:hover {
    background: rgba(44, 95, 95, 0.1);
  }
  
  .loginLink:hover {
    color: #1e4a4a;
    text-decoration: underline;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
    
    .signupCard {
      padding: 2rem;
      margin: 0;
      border-radius: 16px;
    }
    
    .title {
      font-size: 1.8rem;
    }
    
    .subtitle {
      font-size: 1rem;
    }
    
    .input, .select, .passwordInput {
      padding: 0.8rem 1rem;
      font-size: 0.9rem;
    }
    
    .passwordInput {
      padding-right: 2.5rem;
    }
    
    .signupButton {
      padding: 1rem 1.5rem;
      font-size: 1rem;
    }
    
    .floatingShape1, .floatingShape2, .floatingShape3, .floatingShape4 {
      width: 40px;
      height: 40px;
    }
  }
  
  @media (max-width: 480px) {
    .container {
      padding: 0.5rem;
    }
    
    .signupCard {
      padding: 1.5rem;
      border-radius: 12px;
    }
    
    .title {
      font-size: 1.6rem;
    }
    
    .subtitle {
      font-size: 0.9rem;
    }
    
    .logoIcon {
      font-size: 2.5rem;
    }
    
    .form {
      gap: 1.2rem;
    }
    
    .input, .select, .passwordInput {
      padding: 0.7rem 0.9rem;
      font-size: 0.85rem;
    }
    
    .floatingShape1, .floatingShape2, .floatingShape3, .floatingShape4 {
      width: 30px;
      height: 30px;
    }
  }
  
  /* High DPI displays */
  @media (min-resolution: 2dppx) {
    .signupCard {
      border-width: 0.5px;
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

export default SignupPage;
