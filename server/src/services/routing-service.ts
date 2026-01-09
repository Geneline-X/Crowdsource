import { logger } from "../logger";

export interface RouteResult {
  success: boolean;
  distance: number; // meters
  duration: number; // seconds
  geometry: [number, number][]; // Array of [lat, lon] coordinates for the route
  error?: string;
}

/**
 * Get walking/driving route using OSRM public API
 * OSRM uses [lon, lat] format, but we convert to [lat, lon] for Leaflet
 */
export async function getRoute(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number,
  profile: "driving" | "walking" | "cycling" = "driving"
): Promise<RouteResult> {
  try {
    // OSRM API uses lon,lat format
    const url = `https://router.project-osrm.org/route/v1/${profile}/${fromLon},${fromLat};${toLon},${toLat}?overview=full&geometries=geojson`;

    logger.info({ from: [fromLat, fromLon], to: [toLat, toLon], profile }, "Fetching route from OSRM");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      throw new Error(data.message || "No route found");
    }

    const route = data.routes[0];
    
    // Convert coordinates from [lon, lat] to [lat, lon] for Leaflet
    const geometry: [number, number][] = route.geometry.coordinates.map(
      (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
    );

    logger.info(
      { distance: route.distance, duration: route.duration },
      "Route calculated successfully"
    );

    return {
      success: true,
      distance: route.distance,
      duration: route.duration,
      geometry,
    };
  } catch (error) {
    logger.error({ error }, "Failed to get route from OSRM");
    return {
      success: false,
      distance: 0,
      duration: 0,
      geometry: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Find the nearest problem from a given location
 */
export function findNearestProblem(
  fromLat: number,
  fromLon: number,
  problems: Array<{ id: number; latitude: number | null; longitude: number | null }>
): { id: number; distance: number; lat: number; lon: number } | null {
  let nearest: { id: number; distance: number; lat: number; lon: number } | null = null;

  for (const problem of problems) {
    if (problem.latitude === null || problem.longitude === null) continue;

    const distance = calculateHaversineDistance(
      fromLat,
      fromLon,
      problem.latitude,
      problem.longitude
    );

    if (nearest === null || distance < nearest.distance) {
      nearest = {
        id: problem.id,
        distance,
        lat: problem.latitude,
        lon: problem.longitude,
      };
    }
  }

  return nearest;
}

/**
 * Calculate Haversine distance between two points in meters
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)} sec`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)} min`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    return `${hours}h ${mins}min`;
  }
}

/**
 * Format distance in human-readable format
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  } else {
    return `${(meters / 1000).toFixed(1)} km`;
  }
}
