import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface HeatMapLayerProps {
  points: Array<{ lat: number; lon: number; intensity?: number }>;
  radius?: number;
  blur?: number;
  maxZoom?: number;
  max?: number;
}

export function HeatMapLayer({
  points,
  radius = 25,
  blur = 15,
  maxZoom = 18,
  max = 1.0,
}: HeatMapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    // Convert points to heat layer format: [lat, lng, intensity]
    const heatData: [number, number, number][] = points.map((p) => [
      p.lat,
      p.lon,
      p.intensity ?? 0.5,
    ]);

    // Create heat layer with custom options
    const heatLayer = (L as any).heatLayer(heatData, {
      radius,
      blur,
      maxZoom,
      max,
      gradient: {
        0.0: "#00ff00", // Green (low)
        0.25: "#7fff00", // Yellow-green
        0.5: "#ffff00", // Yellow
        0.75: "#ff7f00", // Orange
        1.0: "#ff0000", // Red (high)
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, radius, blur, maxZoom, max]);

  return null;
}
