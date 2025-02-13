import React, { useEffect, useState } from "react";

const Sidebar = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            console.error("No auth token found in localStorage!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/users/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.error(`Server error: ${response.status}`);
                const errorText = await response.text();
                console.error("Error details:", errorText);
                return;
            }

            const data = await response.json();
            setUsers(data.filter(user => user.username !== localStorage.getItem("username")));
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div className="sidebar">
            <h2>Users</h2>
            <ul>
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.id}>
                            {user.username} ({user.email})
                        </li>
                    ))
                ) : (
                    <p>No users found</p>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
