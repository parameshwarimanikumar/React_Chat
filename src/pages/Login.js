import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginData = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('username', data.username);
                navigate("/home");
            } else {
                setErrorMessage(data.error || 'Login failed.');
            }
        } catch (error) {
            setErrorMessage("Login failed. Check your connection.");
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
                    <button type="submit">Login</button>
                </form>
                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default Login;
