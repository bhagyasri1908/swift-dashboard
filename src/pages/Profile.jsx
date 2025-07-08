import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUser(data[0])); 
  }, []);

  if (!user) return null;

  return (
    <div className="profile-container">
      <header className="dashboard-header">
        <div className="logo-area">
          <img src="/swift-logo.png" alt="Swift Logo" className="logo" />
        </div>
        <div className="profile-area">
          <div className="avatar">{user.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
          <span className="user-name">{user.name}</span>
        </div>
      </header>

      <div className="profile-content">
        <button className="back-button" onClick={() => navigate("/")}>← Welcome, {user.name}</button>

        <div className="profile-card">
          <div className="profile-left">
            <div className="profile-placement">
            <div className="profile-avatar-circle">
              {user.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="center-align-styling">
            <div className="profile-name">{user.name}</div>
            <div className="profile-email">{user.email}</div>
            </div>
            </div> 
          </div>

          <div className="profile-right">
            <div className="profile-row">
              <div className="profile-group">
                <label>User ID</label>
                <div className="profile-field">12345687</div>
              </div>
              <div className="profile-group">
                <label>Name</label>
                <div className="profile-field">{user.name}</div>
              </div>
            </div>
            <div className="profile-row">
              <div className="profile-group">
                <label>Email ID</label>
                <div className="profile-field">{user.email}</div>
              </div>
              <div className="profile-group">
                <label>Address</label>
                <div className="profile-field">
                  {user.address.street}, {user.address.city}
                </div>
              </div>
            </div>
            <div className="profile-row">
              <div className="profile-group">
                <label>Phone</label>
                <div className="profile-field">{user.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
