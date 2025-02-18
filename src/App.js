import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Protected route component to handle authentication
const ProtectedRoute = ({ element, ...rest }) => {
  const isAuthenticated = localStorage.getItem('access_token'); // You can check for your token here
  return isAuthenticated ? element : <Navigate to="/" />;
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      </Routes>
    </div>
  );
}

export default App;
