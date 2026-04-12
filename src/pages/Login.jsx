import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const { user, login, isAdmin } = useAuth();

  const [form, setForm] = useState({
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
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      alert("Login successful!");
      const admin = res.data.user?.role === "admin";
      navigate(admin ? "/admin" : "/catalog", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Login error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Left Side: Blurred Background & Centered Text */}
        <div className="auth-left">
          <div className="left-content">
            <h1>Welcome Back</h1>
            <p>Sign in to continue your reading journey with LiteX.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-right">
          <div className="form-wrapper">
            <div className="auth-logo">
              <span style={{ color: "white", padding: "4px 8px", borderRadius: "4px" }}>📚</span>
              Onix Library
            </div>
            
            <h2>Sign In</h2>
            <p className="subtitle">Welcome back! Please enter your details.</p>

            <form onSubmit={handleSubmit}>
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
                Sign In ➔
              </button>
            </form>

            <div className="auth-footer">
              Don&apos;t have an account? <Link to="/register">Create Account</Link>
              <br />
              <Link to="/">← Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;