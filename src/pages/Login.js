import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../service/apiService";
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    setErrorMessage("");
    setLoading(true);

    if (!email || !password) {
      setErrorMessage("Email and Password are required.");
      setLoading(false);
      return;
    }

    try {
      const data = await loginUser(email, password);
      if (data?.access) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("username", data.username);
        console.log("✅ Login successful!");

        navigate("/dashboard");
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
      console.error("🚨 Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if form fields are filled
  const isFormValid = formData.email && formData.password;

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="title">Login</span>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="off"
            value={formData.email}
            onChange={handleChange}
            aria-label="Email"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="off"
            value={formData.password}
            onChange={handleChange}
            aria-label="Password"
            required
          />
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`login-btn ${loading ? "loading" : ""}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <p className="register-text">Don't have an account?</p>
        <button className="register-btn" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
