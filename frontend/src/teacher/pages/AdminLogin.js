import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

  const navigate = useNavigate();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");

  // prevent logged-in user from seeing login page
  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (loggedIn) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    if(username === "admin" && password === "admin123"){

      localStorage.setItem("adminLoggedIn","true");

      navigate("/dashboard", { replace: true });

    }
    else{
      alert("Invalid login");
    }
  };

  return (
    <div className="login-page">

      <div className="login-box">

        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminLogin;