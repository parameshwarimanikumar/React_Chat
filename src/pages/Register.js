import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './register.css';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        if (profilePicture) {
            formData.append("profile_picture", profilePicture);
        }

        try {
            const response = await axios.post('http://localhost:8000/api/users/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                navigate("/login");
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(JSON.stringify(error.response.data));
            } else {
                setErrorMessage("Registration failed.");
            }
        }
    };

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
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
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleProfilePictureChange} 
                    />
                    <button type="submit">Sign up</button>
                </form>
                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default Register;
