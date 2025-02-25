import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
import "../pages/dashboard.css";

const Sidebar = ({ onSelectUser, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sidebarRef = useRef(null); // Reference for scrolling

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await axios.get("http://localhost:8000/api/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = currentUser
          ? response.data.filter((user) => user.username !== currentUser)
          : response.data;

        setUsers(filtered);
        setFilteredUsers(filtered);
      } catch (error) {
        console.error("🔴 Failed to fetch users:", error.response?.data || error.message);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <div className="sidebar">
      <Navbar />
      <Search onSearch={handleSearch} />
      
      {/* Scrollable Users List */}
      <div className="sidebar-users" ref={sidebarRef}>
        <Chats users={filteredUsers} loading={loading} error={error} onSelectUser={onSelectUser} />
      </div>
    </div>
  );
};

export default Sidebar;