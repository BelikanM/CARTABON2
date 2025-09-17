// src/components/MapTracker.jsx
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import socket from "../socket";
import TileLayerControl from "./TileLayerControl";

// icônes par défaut
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Centrer sur utilisateur
function CenterOnUser({ latitude, longitude }) {
  const map = useMap();
  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], map.getZoom(), { animate: true });
    }
  }, [latitude, longitude, map]);
  return null;
}

export default function MapTracker({ userId }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handler = (updatedUser) => {
      console.log("MapTracker reçoit positionsUpdate:", updatedUser);
      setUsers(prev => {
        const exists = prev.find(u => u._id === updatedUser._id);
        if (exists) {
          return prev.map(u => u._id === updatedUser._id ? { ...u, ...updatedUser } : u);
        } else {
          return [...prev, updatedUser];
        }
      });
    };

    socket.on("positionsUpdate", handler);
    return () => socket.off("positionsUpdate", handler);
  }, []);

  const currentUser = users.find(u => u._id === userId);

  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: "80vh", width: "100%" }}>
      <TileLayerControl />
      {users.map((user, idx) => (
        <Marker
          key={user._id || idx}
          position={[user.latitude, user.longitude]}
        >
          <Popup>{user.name}</Popup>
        </Marker>
      ))}
      {currentUser && <CenterOnUser latitude={currentUser.latitude} longitude={currentUser.longitude} />}
    </MapContainer>
  );
}
