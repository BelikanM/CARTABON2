import { TileLayer } from "react-leaflet";
import { useMemo } from "react";

/**
 * Sous-composant pour gérer une tuile avec paramètres avancés (HD + nettoyage en temps réel).
 */
export default function EnhancedTileLayer({ tile }) {
  const tileProps = useMemo(
    () => ({
      url: tile.url,
      attribution: tile.attribution,
      subdomains: tile.subdomains || "abc",
      maxZoom: tile.maxZoom || 20,
      maxNativeZoom: tile.maxNativeZoom || undefined,
      // 🔥 10 paramètres pour améliorer le rendu et le "nettoyage"
      updateWhenIdle: false, // force update en mouvement
      updateWhenZooming: true,
      keepBuffer: 2, // conserve uniquement 2 couches hors écran
      detectRetina: true, // HD sur écrans Retina
      crossOrigin: true, // active CORS
      reuseTiles: true, // réutilise les anciennes tuiles (moins de mémoire)
      unloadInvisibleTiles: true, // supprime celles hors écran
      errorTileUrl:
        "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg", // tuile de secours
      opacity: 0.95, // légère transparence pour éviter artefacts
      zIndex: 1, // couche toujours au-dessus du fond
    }),
    [tile]
  );

  return <TileLayer key={tile.name} {...tileProps} />;
}
