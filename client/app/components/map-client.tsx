import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, LatLngExpression, divIcon, point, LatLng } from "leaflet";
import { Problem } from "@/lib/types";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const SOURCE_COLORS: Record<string, string> = {
  whatsapp_share: "#25D366",
  text_extracted: "#0091ff",
  manual: "#f5a623",
  default: "#888888",
};

const SELECTED_COLOR = "#e5484d";

function createMarkerIcon(
  locationSource: string | null,
  verified: boolean,
  isSelected: boolean
): Icon {
  const color = isSelected
    ? SELECTED_COLOR
    : SOURCE_COLORS[locationSource || "default"] || SOURCE_COLORS.default;
  const size = isSelected ? 32 : 24;
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="${size}" height="${size * 1.33}">
      <path fill="${color}" stroke="${isSelected ? "#fff" : "none"}" stroke-width="2" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z"/>
      <circle fill="${verified ? "#fff" : "#000"}" cx="12" cy="12" r="4"/>
    </svg>
  `;
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgContent)}`,
    iconSize: [size, size * 1.33],
    iconAnchor: [size / 2, size * 1.33],
    popupAnchor: [0, -size * 1.33],
  });
}

function createClusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount();
  let size = 40;
  let sizeClass = "cluster-icon-small";

  if (count >= 10) {
    size = 50;
    sizeClass = "cluster-icon-medium";
  }
  if (count >= 25) {
    size = 60;
    sizeClass = "cluster-icon-large";
  }

  return divIcon({
    html: `<div class="cluster-icon ${sizeClass}" style="width:${size}px;height:${size}px;">
      <span>${count}</span>
    </div>`,
    className: "custom-cluster-icon",
    iconSize: point(size, size, true),
  });
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

function createVerificationIcon(index: number) {
  return divIcon({
    html: `<div style="background-color: #10b981; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
      ${index + 1}
    </div>`,
    className: "verification-icon",
    iconSize: point(24, 24),
  });
}

function VerificationVisualizer({ problem }: { problem: Problem }) {
  if (!problem.verifications || problem.verifications.length === 0) return null;

  const positions: [number, number][] = problem.verifications.map(v => [v.latitude, v.longitude]);
  
  // Calculate max distance to determine accuracy
  let maxDistance = 0;
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dist = calculateDistance(positions[i][0], positions[i][1], positions[j][0], positions[j][1]);
      if (dist > maxDistance) maxDistance = dist;
    }
  }

  // Also verify against reported location if available
  if (problem.latitude && problem.longitude) {
    for (const pos of positions) {
      const dist = calculateDistance(problem.latitude, problem.longitude, pos[0], pos[1]);
    }
  }

  const isAccurate = maxDistance < 50; // 50 meters threshold
  const accuracyColor = isAccurate ? "#10b981" : "#f59e0b"; // Green if accurate, amber if spread out

  return (
    <>
      {problem.verifications.map((v, i) => (
        <Marker
          key={`ver-${v.id}`}
          position={[v.latitude, v.longitude]}
          icon={createVerificationIcon(i)}
          zIndexOffset={2000}
        >
          <Popup>
            <div className="p-1">
              <p className="font-medium text-xs text-gray-900 mb-1">
                Verification #{i + 1}
              </p>
              <p className="text-[10px] text-gray-500">
                {new Date(v.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-1">
                 {v.imageUrls.length > 0 && (
                    <img 
                      src={v.imageUrls[0]} 
                      className="w-full h-16 object-cover rounded border border-gray-200" 
                      alt="Verification" 
                    />
                 )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Lines connecting verifications */}
      <Polyline
        positions={[...positions, positions[0]]} // Close the loop if > 2 points, otherwise just a line
        pathOptions={{ color: accuracyColor, weight: 2, dashArray: '5, 5' }}
      />
      
      {/* Line to original reported location if available */}
      {problem.latitude && problem.longitude && (
        positions.map((pos, i) => (
          <Polyline
            key={`line-to-origin-${i}`}
            positions={[[problem.latitude!, problem.longitude!], pos]}
            pathOptions={{ color: '#6b7280', weight: 1, opacity: 0.5 }}
          />
        ))
      )}
      
      {/* Accuracy Label - positioned at centroid */}
      {positions.length > 1 && (
        <Popup position={[
          positions.reduce((sum, p) => sum + p[0], 0) / positions.length,
          positions.reduce((sum, p) => sum + p[1], 0) / positions.length
        ]} closeButton={false} autoClose={false} closeOnClick={false}>
           <div className="text-center">
             <span className={`text-xs font-bold ${isAccurate ? 'text-green-600' : 'text-amber-600'}`}>
               {isAccurate ? 'Accurate' : 'Spread out'}
             </span>
             <br/>
             <span className="text-[9px] text-gray-500">
               Max spread: {Math.round(maxDistance)}m
             </span>
           </div>
        </Popup>
      )}
    </>
  );
}

interface MapCenterControllerProps {
  centerOnProblem?: Problem | null;
}

// Helper function to get position for a problem (either primary or verification centroid)
function getProblemPosition(problem: Problem): [number, number] | null {
  if (problem.latitude !== null && problem.longitude !== null) {
    return [problem.latitude, problem.longitude];
  }
  
  if (problem.verifications && problem.verifications.length > 0) {
    const avgLat = problem.verifications.reduce((sum, v) => sum + v.latitude, 0) / problem.verifications.length;
    const avgLon = problem.verifications.reduce((sum, v) => sum + v.longitude, 0) / problem.verifications.length;
    return [avgLat, avgLon];
  }
  
  return null;
}

function MapCenterController({ centerOnProblem }: MapCenterControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (centerOnProblem) {
      const position = getProblemPosition(centerOnProblem);
      if (position) {
        map.flyTo(position, 16, {
          duration: 0.8,
        });
      }
    }
  }, [centerOnProblem, map]);

  return null;
}

interface MapClientProps {
  problems: Problem[];
  onSelectProblem?: (id: number) => void;
  selectedProblemId?: number | null;
  centerOnProblem?: Problem | null;
}

export default function MapClient({
  problems,
  onSelectProblem,
  selectedProblemId,
  centerOnProblem,
}: MapClientProps) {
  // Get all problems that have coordinates (either primary or from verifications)
  const problemsWithPositions = problems
    .map(p => ({ problem: p, position: getProblemPosition(p) }))
    .filter(({ position }) => position !== null) as Array<{ problem: Problem; position: [number, number] }>;

  const defaultCenter: LatLngExpression =
    problemsWithPositions.length > 0
      ? problemsWithPositions[0].position
      : [8.7128, -11.006];

  const selectedProblemWithVerifications = problems.find(
    p => p.id === selectedProblemId && p.verifications && p.verifications.length > 0
  );

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      className="w-full h-full"
      style={{ background: "#0a0a0a" }}
    >
      <TileLayer
        attribution="CARTO"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapCenterController centerOnProblem={centerOnProblem} />

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterIcon}
        maxClusterRadius={60}
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
        zoomToBoundsOnClick
      >
        {problemsWithPositions.map(({ problem, position }) => {
          const isSelected = selectedProblemId === problem.id;
          return (
            <Marker
              key={problem.id}
              position={position}
              icon={createMarkerIcon(
                problem.locationSource,
                problem.locationVerified,
                isSelected
              )}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{ click: () => onSelectProblem?.(problem.id) }}
            >
              <Popup>
                <div className="p-1">
                  <p className="font-medium text-sm text-gray-900">
                    {problem.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {problem.rawMessage}
                  </p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    {problem.upvoteCount} votes
                  </p>
                  
                  {problem.images && problem.images.length > 0 && (
                    <div className="mt-2">
                      <img
                        src={problem.images[0].url}
                        alt="Problem"
                        className="w-full h-24 object-cover rounded-md"
                      />
                    </div>
                  )}
                  {problem.verificationCount > 0 && (
                     <div className="mt-2 pt-2 border-t border-gray-100">
                       <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                         <span className="w-2 h-2 rounded-full bg-green-500"></span>
                         {problem.verificationCount} verifications
                       </p>
                     </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
      
      {selectedProblemWithVerifications && (
        <VerificationVisualizer problem={selectedProblemWithVerifications} />
      )}
    </MapContainer>
  );
}
