import { TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import { FaLayerGroup, FaCog, FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import io from "socket.io-client";
import * as L from "leaflet";

const tileOptions = [
  {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a>',
    subdomains: "abc",
  },
  {
    name: "OpenTopoMap",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>',
    subdomains: "abc",
  },
  {
    name: "Carto Positron",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">Carto</a>',
    subdomains: "abcd",
  },
  {
    name: "Carto Dark Matter",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">Carto</a>',
    subdomains: "abcd",
    maxZoom: 19,
  },
  {
    name: "Esri World Imagery (Satellite)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles © Esri",
    maxZoom: 19,
  },
  {
    name: "OSM Humanitarian",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.fr/">OSM France</a>, Humanitarian OSM',
    subdomains: "abc",
    maxZoom: 20,
  },
  {
    name: "OpenCycleMap",
    url: "https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}{r}.png?apikey=1c98397b543d4d3088ae23354ebf4e95",
    attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 22,
  },
  {
    name: "Transport",
    url: "https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}{r}.png?apikey=1c98397b543d4d3088ae23354ebf4e95",
    attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 22,
  },
  {
    name: "Paysage",
    url: "https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}{r}.png?apikey=1c98397b543d4d3088ae23354ebf4e95",
    attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 22,
  },
  {
    name: "En plein air",
    url: "https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}{r}.png?apikey=1c98397b543d4d3088ae23354ebf4e95",
    attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 22,
  },
  {
    name: "Transport sombre",
    url: "https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}{r}.png?apikey=1c98397b543d4d3088ae23354ebf4e95",
    attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 22,
  },
  {
    name: "Carte de la colonne vertébrale",
    url: "https://{s}.tile.thunderforest.com/spinal-map/{z}/{x}/{y}{r}.png?apikey=1c98397b543d4d3088ae23354ebf4e95",
    attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 22,
  },
  {
    name: "Pionnier",
    url: "https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}{r}.png?apikey=1c98397b543d4d3088ae23354ebf4e95",
    attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 22,
  },
  {
    name: "Atlas mobile",
    url: "https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}{r}.png?apikey=1c98397b543d4d3088ae23354ebf4e95",
    attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 22,
  },
  {
    name: "Quartier",
    url: "https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}{r}.png?apikey=1c98397b543d4d3088ae23354ebf4e95",
    attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 22,
  },
  {
    name: "Atlas",
    url: "https://{s}.tile.thunderforest.com/atlas/{z}/{x}/{y}{r}.png?apikey=1c98397b543d4d3088ae23354ebf4e95",
    attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 22,
  },
];
const defaultFilterValues = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  blur: 0,
  invert: 0,
  opacity: 100,
};
const presets = [
  { name: "Aucun", values: { ...defaultFilterValues } },
  { name: "Grayscale", values: { ...defaultFilterValues, grayscale: 100 } },
  { name: "Sombre", values: { ...defaultFilterValues, brightness: 70 } },
  { name: "Contraste élevé", values: { ...defaultFilterValues, contrast: 150 } },
  { name: "Inversé", values: { ...defaultFilterValues, hueRotate: 180 } },
  { name: "Flou puissant", values: { ...defaultFilterValues, blur: 5 } },
  { name: "Inversion totale", values: { ...defaultFilterValues, invert: 100 } },
  { name: "Sépia intense", values: { ...defaultFilterValues, sepia: 100 } },
  { name: "Saturation extrême", values: { ...defaultFilterValues, saturate: 300 } },
  { name: "Lumineux", values: { ...defaultFilterValues, brightness: 150 } },
  { name: "Contraste extrême", values: { ...defaultFilterValues, contrast: 200 } },
  { name: "Rotation teinte 90°", values: { ...defaultFilterValues, hueRotate: 90 } },
  { name: "Gris contrasté", values: { ...defaultFilterValues, grayscale: 50, contrast: 150 } },
  { name: "Opacité saturée", values: { ...defaultFilterValues, opacity: 60, saturate: 200 } },
  { name: "Sharpen (Texture Améliorée)", values: { ...defaultFilterValues, contrast: 120, brightness: 110 } },
  { name: "Vintage (Texture Rétro)", values: { ...defaultFilterValues, sepia: 50, contrast: 110 } },
  { name: "High Detail (Texture Détaillée)", values: { ...defaultFilterValues, contrast: 150, saturate: 120 } },
  { name: "Night Mode (Texture Nocturne)", values: { ...defaultFilterValues, invert: 100, hueRotate: 180, brightness: 80 } },
  { name: "Embossed (Texture Relief)", values: { ...defaultFilterValues, grayscale: 100, contrast: 200, brightness: 50 } },
];
const getMarkerIcon = (color) => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid black;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};
const CustomMarker = ({ marker, startEditing }) => {
  const markerRef = useRef(null);
  const timeoutRef = useRef(null);
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.on("popupopen", (e) => {
        const popupEl = e.popup.getElement();
        if (popupEl) {
          popupEl.addEventListener("mouseenter", () => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          });
          popupEl.addEventListener("mouseleave", () => {
            markerRef.current.closePopup();
          });
        }
      });
    }
  }, []);
  return (
    <Marker
      ref={markerRef}
      position={[marker.latitude, marker.longitude]}
      icon={getMarkerIcon(marker.color)}
      eventHandlers={{
        mouseover: (e) => e.target.openPopup(),
        mouseout: (e) => {
          timeoutRef.current = setTimeout(() => {
            e.target.closePopup();
          }, 200);
        },
      }}
    >
      <Popup>
        <h3>{marker.title || "Sans titre"}</h3>
        <p>{marker.comment || "Sans commentaire"}</p>
        {marker.photos.map((url, idx) => (
          <img key={idx} src={`http://localhost:5000${url}`} alt="" style={{ width: "100px", margin: "5px" }} />
        ))}
        {marker.videos.map((url, idx) => (
          <video key={idx} src={`http://localhost:5000${url}`} width="100" controls style={{ margin: "5px" }} />
        ))}
        <button onClick={() => startEditing(marker)}>Éditer</button>
      </Popup>
    </Marker>
  );
};
export default function TileLayerControl() {
  const [activeTile, setActiveTile] = useState(tileOptions[0]);
  const [hdEnabled, setHdEnabled] = useState(false);
  const [maxZoom, setMaxZoom] = useState(activeTile.maxZoom || 18);
  const [filterValues, setFilterValues] = useState({ ...defaultFilterValues });
  const [showLayerControl, setShowLayerControl] = useState(true);
  const [showHdSettings, setShowHdSettings] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [socketInstance, setSocketInstance] = useState(null);
  const [placingMarker, setPlacingMarker] = useState(false);
  const [showMarkerControl, setShowMarkerControl] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMarkerPos, setNewMarkerPos] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [titleInput, setTitleInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [colorInput, setColorInput] = useState("#ff0000");
  const [photosFiles, setPhotosFiles] = useState([]);
  const [videosFiles, setVideosFiles] = useState([]);
  // Synchroniser le zoom max et réinitialiser les filtres quand la couche change
  useEffect(() => {
    setMaxZoom(activeTile.maxZoom || 18);
    setFilterValues({ ...defaultFilterValues });
  }, [activeTile]);
  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocketInstance(socket);
    socket.on("allMarkers", (data) => setMarkers(data));
    socket.on("newMarker", (marker) => setMarkers((prev) => [...prev, marker]));
    socket.on("updatedMarker", (marker) =>
      setMarkers((prev) =>
        prev.map((m) => (m._id === marker._id ? marker : m))
      )
    );
    return () => {
      socket.disconnect();
    };
  }, []);
  const toggleHD = () => {
    setHdEnabled(!hdEnabled);
    setMaxZoom(!hdEnabled ? 22 : activeTile.maxZoom || 18);
  };
  const handleMaxZoomChange = (e) => {
    const zoom = parseInt(e.target.value, 10);
    setMaxZoom(zoom);
  };
  const handlePresetChange = (e) => {
    const selectedPreset = presets.find(p => p.name === e.target.value);
    if (selectedPreset) {
      setFilterValues({ ...selectedPreset.values });
    }
  };
  const updateFilterValue = (key, value) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };
  // Construire la chaîne de filtre à partir des valeurs
  const getTileFilter = () => {
    const { brightness, contrast, saturate, grayscale, sepia, hueRotate, blur, invert, opacity } = filterValues;
    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%) sepia(${sepia}%) hue-rotate(${hueRotate}deg) blur(${blur}px) invert(${invert}%) opacity(${opacity}%)`;
  };
  // Appliquer le filtre couleur et le rendu net à chaque tuile chargée
  const handleTileLoad = (e) => {
    e.tile.style.filter = getTileFilter();
    e.tile.style.imageRendering = 'crisp-edges'; // ou 'pixelated' pour un rendu plus net
  };
  useMapEvents({
    click: (e) => {
      if (placingMarker) {
        setNewMarkerPos(e.latlng);
        setShowAddModal(true);
        setPlacingMarker(false);
        setTitleInput("");
        setCommentInput("");
        setColorInput("#ff0000");
        setPhotosFiles([]);
        setVideosFiles([]);
      }
    },
  });
  const getUser = () => {
    const userString = localStorage.getItem("user");
    if (!userString) return null;
    try {
      return JSON.parse(userString);
    } catch (e) {
      console.error("Erreur parsing user from localStorage:", e);
      return null;
    }
  };
  const handleAddSubmit = async () => {
    const user = getUser();
    const formData = new FormData();
    formData.append("latitude", newMarkerPos.lat);
    formData.append("longitude", newMarkerPos.lng);
    formData.append("title", titleInput);
    formData.append("comment", commentInput);
    formData.append("color", colorInput);
    if (user) {
      formData.append("userId", user._id);
    }
    for (let file of photosFiles) {
      formData.append("photos", file);
    }
    for (let file of videosFiles) {
      formData.append("videos", file);
    }
    try {
      const res = await fetch("http://localhost:5000/markers", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setShowAddModal(false);
      } else {
        alert("Erreur lors de l'ajout du marqueur");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du marqueur");
    }
  };
  const startEditing = (marker) => {
    setCurrentMarker(marker);
    setTitleInput(marker.title || "");
    setCommentInput(marker.comment || "");
    setColorInput(marker.color || "#ff0000");
    setPhotosFiles([]);
    setVideosFiles([]);
    setShowEditModal(true);
  };
  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append("title", titleInput);
    formData.append("comment", commentInput);
    formData.append("color", colorInput);
    for (let file of photosFiles) {
      formData.append("photos", file);
    }
    for (let file of videosFiles) {
      formData.append("videos", file);
    }
    try {
      const res = await fetch(`http://localhost:5000/markers/${currentMarker._id}`, {
        method: "PATCH",
        body: formData,
      });
      if (res.ok) {
        setShowEditModal(false);
      } else {
        alert("Erreur lors de la mise à jour du marqueur");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du marqueur");
    }
  };
  const panelStyle = {
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "8px",
    zIndex: 1000,
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  };
  const toggleButtonStyle = {
    backgroundColor: "white",
    padding: "5px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    zIndex: 1000,
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1001,
  };
  const modalContentStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
  };
  return (
    <>
      <TileLayer
        key={activeTile.name}
        url={activeTile.url}
        attribution={activeTile.attribution}
        {...(activeTile.subdomains ? { subdomains: activeTile.subdomains } : {})}
        maxZoom={maxZoom}
        detectRetina={true} // Active les tuiles haute résolution sur écrans retina
        eventHandlers={{
          tileload: handleTileLoad,
        }}
      />
      {markers.map((marker) => (
        <CustomMarker key={marker._id} marker={marker} startEditing={startEditing} />
      ))}
      {/* Contrôleur des couches */}
      {showLayerControl ? (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            ...panelStyle,
          }}
        >
          <button
            onClick={() => setShowLayerControl(false)}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FaTimes />
          </button>
          <h4>
            <FaLayerGroup /> Couches
          </h4>
          {tileOptions.map((tile) => (
            <button
              key={tile.name}
              onClick={() => setActiveTile(tile)}
              style={{
                display: "block",
                margin: "5px 0",
                width: "100%",
                padding: "5px 10px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                backgroundColor:
                  activeTile.name === tile.name ? "#007bff" : "#eee",
                color: activeTile.name === tile.name ? "#fff" : "#000",
              }}
            >
              {tile.name}
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={() => setShowLayerControl(true)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            ...toggleButtonStyle,
          }}
        >
          <FaLayerGroup size={20} />
        </button>
      )}
      {/* Paramètres HD et filtres */}
      {showHdSettings ? (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            ...panelStyle,
            width: "250px", // Élargir pour les sliders
          }}
        >
          <button
            onClick={() => setShowHdSettings(false)}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FaTimes />
          </button>
          <h4><FaCog /> Paramètres HD</h4>
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
          <div style={{ marginTop: "10px" }}>
            <h4>Filtres de Texture</h4>
            <label>
              Préréglage :{" "}
              <select onChange={handlePresetChange}>
                {presets.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </label>
            <div style={{ marginTop: "10px" }}>
              <label>Brightness: {filterValues.brightness}%</label>
              <input type="range" min="0" max="200" value={filterValues.brightness} onChange={(e) => updateFilterValue('brightness', e.target.value)} />
            </div>
            <div>
              <label>Contrast: {filterValues.contrast}%</label>
              <input type="range" min="0" max="300" value={filterValues.contrast} onChange={(e) => updateFilterValue('contrast', e.target.value)} />
            </div>
            <div>
              <label>Saturate: {filterValues.saturate}%</label>
              <input type="range" min="0" max="300" value={filterValues.saturate} onChange={(e) => updateFilterValue('saturate', e.target.value)} />
            </div>
            <div>
              <label>Grayscale: {filterValues.grayscale}%</label>
              <input type="range" min="0" max="100" value={filterValues.grayscale} onChange={(e) => updateFilterValue('grayscale', e.target.value)} />
            </div>
            <div>
              <label>Sepia: {filterValues.sepia}%</label>
              <input type="range" min="0" max="100" value={filterValues.sepia} onChange={(e) => updateFilterValue('sepia', e.target.value)} />
            </div>
            <div>
              <label>Hue Rotate: {filterValues.hueRotate}deg</label>
              <input type="range" min="0" max="360" value={filterValues.hueRotate} onChange={(e) => updateFilterValue('hueRotate', e.target.value)} />
            </div>
            <div>
              <label>Blur: {filterValues.blur}px</label>
              <input type="range" min="0" max="10" step="0.1" value={filterValues.blur} onChange={(e) => updateFilterValue('blur', e.target.value)} />
            </div>
            <div>
              <label>Invert: {filterValues.invert}%</label>
              <input type="range" min="0" max="100" value={filterValues.invert} onChange={(e) => updateFilterValue('invert', e.target.value)} />
            </div>
            <div>
              <label>Opacity: {filterValues.opacity}%</label>
              <input type="range" min="0" max="100" value={filterValues.opacity} onChange={(e) => updateFilterValue('opacity', e.target.value)} />
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowHdSettings(true)}
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            ...toggleButtonStyle,
          }}
        >
          <FaCog size={20} />
        </button>
      )}
      {/* Contrôle des marqueurs */}
      {showMarkerControl ? (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            ...panelStyle,
          }}
        >
          <button
            onClick={() => setShowMarkerControl(false)}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FaTimes />
          </button>
          <h4>
            <FaMapMarkerAlt /> Marqueurs
          </h4>
          <button
            onClick={() => setPlacingMarker(true)}
            style={{
              display: "block",
              margin: "5px 0",
              width: "100%",
              padding: "5px 10px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "#fff",
            }}
          >
            Ajouter un marqueur
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowMarkerControl(true)}
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            ...toggleButtonStyle,
          }}
        >
          <FaMapMarkerAlt size={20} />
        </button>
      )}
      {showAddModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>Ajouter Marqueur</h3>
            <input
              type="text"
              placeholder="Titre"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              style={{ display: "block", margin: "10px 0" }}
            />
            <textarea
              placeholder="Commentaire"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              style={{ display: "block", margin: "10px 0" }}
            />
            <label>Couleur: </label>
            <input
              type="color"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
            />
            <label>Photos: </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setPhotosFiles(Array.from(e.target.files))}
              style={{ display: "block", margin: "10px 0" }}
            />
            <label>Vidéos: </label>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => setVideosFiles(Array.from(e.target.files))}
              style={{ display: "block", margin: "10px 0" }}
            />
            <button onClick={handleAddSubmit}>Sauvegarder</button>
            <button onClick={() => setShowAddModal(false)}>Annuler</button>
          </div>
        </div>
      )}
      {showEditModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>Éditer Marqueur</h3>
            <input
              type="text"
              placeholder="Titre"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              style={{ display: "block", margin: "10px 0" }}
            />
            <textarea
              placeholder="Commentaire"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              style={{ display: "block", margin: "10px 0" }}
            />
            <label>Couleur: </label>
            <input
              type="color"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
            />
            <label>Ajouter Photos: </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setPhotosFiles(Array.from(e.target.files))}
              style={{ display: "block", margin: "10px 0" }}
            />
            <label>Ajouter Vidéos: </label>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => setVideosFiles(Array.from(e.target.files))}
              style={{ display: "block", margin: "10px 0" }}
            />
            <button onClick={handleEditSubmit}>Sauvegarder</button>
            <button onClick={() => setShowEditModal(false)}>Annuler</button>
          </div>
        </div>
      )}
    </>
  );
}