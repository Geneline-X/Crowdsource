import { Polyline, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";

interface RouteOverlayProps {
  fromLat: number;
  fromLon: number;
  problemId: number;
  problemTitle: string;
  onClose: () => void;
}

interface RouteData {
  distance: number;
  distanceFormatted: string;
  duration: number;
  durationFormatted: string;
  geometry: [number, number][];
}

export function RouteOverlay({
  fromLat,
  fromLon,
  problemId,
  problemTitle,
  onClose,
}: RouteOverlayProps) {
  const map = useMap();
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
        const response = await fetch(
          `${serverUrl}/api/geo/route/${fromLat}/${fromLon}/${problemId}`
        );
        const result = await response.json();
        
        if (result.success) {
          setRoute(result.data.route);
          
          // Fit map to route bounds
          if (result.data.route.geometry.length > 0) {
            const bounds = result.data.route.geometry.reduce(
              (acc: any, coord: [number, number]) => {
                return acc.extend(coord);
              },
              map.getBounds()
            );
            map.fitBounds(bounds, { padding: [50, 50] });
          }
        } else {
          setError(result.error || "Failed to get route");
        }
      } catch (err) {
        setError("Failed to fetch route");
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [fromLat, fromLon, problemId, map]);

  if (loading) {
    return null;
  }

  if (error || !route) {
    return null;
  }

  const positions: LatLngExpression[] = route.geometry;
  const midIndex = Math.floor(positions.length / 2);
  const midPoint = positions[midIndex];

  return (
    <>
      <Polyline
        positions={positions}
        pathOptions={{
          color: "#3b82f6",
          weight: 5,
          opacity: 0.8,
        }}
      />
      <Popup position={midPoint} closeButton={false}>
        <div className="p-2 min-w-[150px]">
          <p className="font-bold text-sm mb-1 truncate">{problemTitle}</p>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span>{route.distanceFormatted}</span>
            <span>{route.durationFormatted}</span>
          </div>
          <button
            onClick={onClose}
            className="mt-2 w-full text-xs bg-gray-100 hover:bg-gray-200 py-1 px-2 rounded"
          >
            Close Route
          </button>
        </div>
      </Popup>
    </>
  );
}
