// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import GeoTracker from "./components/GeoTracker";
import MapTracker from "./components/MapTracker";
import "./App.css";

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const handleSetUserId = (id) => {
    setUserId(id);
    localStorage.setItem("userId", id);
  };

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
  };

  return (
    <Router>
      <nav className="navbar">
        {!userId && <Link to="/register" className="nav-button">Inscription</Link>}
        {!userId && <Link to="/login" className="nav-button">Se connecter</Link>}
        {userId && <Link to="/map" className="nav-button">Carte en temps réel</Link>}
        {userId && <button className="nav-button" onClick={handleLogout}>Déconnexion</button>}
      </nav>

      <Routes>
        <Route path="/register" element={<RegisterForm setUserId={handleSetUserId} />} />
        <Route path="/login" element={<LoginForm setUserId={handleSetUserId} />} />
        <Route
          path="/map"
          element={
            userId ? (
              <>
                <GeoTracker userId={userId} />
                <MapTracker userId={userId} />
              </>
            ) : (
              <p className="center-text">Veuillez vous inscrire ou vous connecter pour voir la carte en temps réel.</p>
            )
          }
        />
        <Route path="*" element={<p className="center-text">Page non trouvée. <Link to="/register">Inscription</Link></p>} />
      </Routes>
    </Router>
  );
}

export default App;
