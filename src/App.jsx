
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";


function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (tk) => {
    const decoded = jwtDecode(tk);     
    localStorage.setItem("token", tk);
    sessionStorage.setItem("userId", decoded.id); 
    setToken(tk);    
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            token ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;