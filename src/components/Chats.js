import React from "react";
import "../pages/dashboard.css";

const Chats = ({ users = [], loading, error, onSelectUser }) => {
  return (
    <div className="chats">
      {loading && <p>Loading chats...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {users?.length > 0 ? (
          users.map((user) => (
            <li key={user.id} onClick={() => onSelectUser(user)} className="chat-item">
              <img
                src={user.profile_picture || "/default-avatar.png"}
                alt="Avatar"
                className="avatar"
                height={40}
                width={40}
                loading="lazy" // Improves performance
              />
              <div>
                <span className="username">{user.username}</span>
              </div>
            </li>
          ))
        ) : (
          !loading && !error && <p>No chats available</p>
        )}
      </ul>
    </div>
  );
};

export default Chats;
