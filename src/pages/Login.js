import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../service/apiService";  // ✅ Import API service
import "./login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        if (!email || !password) {
            setErrorMessage("Email and Password are required.");
            setLoading(false);
            return;
        }

        try {
            const data = await loginUser(email, password);  // ✅ Use loginUser function

            if (data) {
                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);
                localStorage.setItem("username", data.username);
                navigate("/home");
            } else {
                setErrorMessage("Invalid credentials or server error.");
            }
        } catch (error) {
            setErrorMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="title">Login</span>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
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
