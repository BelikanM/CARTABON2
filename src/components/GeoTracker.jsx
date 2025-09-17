// src/components/GeoTracker.jsx
import { useState, useEffect, useRef } from "react";
import socket from "../socket";

export default function GeoTracker({ userId }) {
  const [position, setPosition] = useState({ latitude: null, longitude: null, error: null });
  const lastSent = useRef({ latitude: null, longitude: null });

  useEffect(() => {
    if (!navigator.geolocation || !userId) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ latitude, longitude, error: null });

        // envoyer seulement si la position a changé
        if (latitude !== lastSent.current.latitude || longitude !== lastSent.current.longitude) {
          console.log("Envoi position au serveur:", latitude, longitude);
          socket.emit("updatePosition", { userId, latitude, longitude });
          lastSent.current = { latitude, longitude };
        }
      },
      (err) => setPosition(prev => ({ ...prev, error: err.message })),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userId]);

  return (
    <div>
      {position.error && <p>Erreur: {position.error}</p>}
      {position.latitude && position.longitude ? (
        <p>Latitude: {position.latitude}, Longitude: {position.longitude}</p>
      ) : (
        <p>Chargement de la position...</p>
      )}
    </div>
  );
}
