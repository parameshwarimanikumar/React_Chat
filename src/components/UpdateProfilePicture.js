import React, { useState } from "react";
import axios from 'axios';

const UpdateProfilePicture = () => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [message, setMessage] = useState("");

    // This function handles the file input change
    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]); // Set the selected file in state
    };

    // This function handles the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!profilePicture) {
            setMessage("Please select a profile picture to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('profile_picture', profilePicture);

        try {
            const response = await axios.patch('http://localhost:8000/api/profile-picture/', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Add token here
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200) {
                setMessage("Profile picture updated successfully.");
                // Optionally update the profile picture in your frontend
            }
        } catch (error) {
            setMessage("Error updating profile picture.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfilePictureChange}  // Handles file input
                    required 
                />
                <button type="submit">Update Profile Picture</button>
            </form>
            {message && <p>{message}</p>}  {/* Displays message to the user */}
        </div>
    );
};

export default UpdateProfilePicture;
