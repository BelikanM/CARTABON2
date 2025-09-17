import { useState, useEffect } from "react";

export default function HDSettings({ tile, setTile }) {
  const [hdEnabled, setHdEnabled] = useState(false);
  const [maxZoom, setMaxZoom] = useState(tile.maxZoom || 18);

  // Synchroniser le maxZoom quand on change de couche
  useEffect(() => {
    setMaxZoom(tile.maxZoom || 18);
  }, [tile]);

  const toggleHD = () => {
    setHdEnabled(!hdEnabled);
    setTile({
      ...tile,
      maxZoom: !hdEnabled ? 22 : tile.maxZoom || 18, // Zoom max plus élevé si HD activé
    });
  };

  const handleMaxZoomChange = (e) => {
    const zoom = parseInt(e.target.value, 10);
    setMaxZoom(zoom);
    setTile({ ...tile, maxZoom: zoom });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "8px",
        zIndex: 1000,
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      }}
    >
      <h4>Paramètres HD</h4>
      <label>
        <input type="checkbox" checked={hdEnabled} onChange={toggleHD} /> Activer HD
      </label>
      <div style={{ marginTop: "5px" }}>
        <label>
          Zoom max :{" "}
          <input
            type="number"
            value={maxZoom}
            min={1}
            max={24}
            onChange={handleMaxZoomChange}
            style={{ width: "50px", marginLeft: "5px" }}
          />
        </label>
      </div>
    </div>
  );
}
