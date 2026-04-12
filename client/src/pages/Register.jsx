import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      navigate(isAdmin ? "/admin" : "/catalog", { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Left Side: Blurred Background & Centered Text */}
        <div className="auth-left">
          <div className="left-content">
           <h1>Join Our Library</h1>
            <p>Create an account to access thousands of titles.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-right">
          <div className="form-wrapper">
            <div className="auth-logo">
              <span style={{ color: "white", padding: "4px 8px", borderRadius: "4px" }}>📚</span>
              Onix Library
            </div>
            
            <h2>Create account</h2>
            <p className="subtitle">Start your reading journey today</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  placeholder="Enter your Full Name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your Email"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="auth-button">
                Create Account ➔
              </button>
            </form>

            <div className="auth-footer">
              Already have an account? <Link to="/login">Sign in</Link>
              <br />
              <Link to="/">← Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;