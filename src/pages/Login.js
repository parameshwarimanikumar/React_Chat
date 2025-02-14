// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/apiService";
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        navigate("/dashboard");
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

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
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={!isFormValid || loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <p>Don't have an account?</p>
        <button onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;