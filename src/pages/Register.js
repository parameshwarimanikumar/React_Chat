import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

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
      const response = await fetch("http://localhost:8000/api/create_user/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.status === 201) {
        navigate("/");
      } else {
        // Show backend error messages
        setErrorMessage(data.error || "Registration failed.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username (Optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
