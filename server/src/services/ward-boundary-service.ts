import { readFileSync } from "fs";
import { join } from "path";
import { logger } from "../logger";

// GeoJSON types
interface GeoJSONFeature {
  type: "Feature";
  properties: Record<string, any>;
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export interface Ward {
  id: string;
  name: string;
  districtName: string;
  provinceName: string;
  geometry: GeoJSONFeature["geometry"];
}

export interface District {
  id: string;
  name: string;
  provinceName: string;
  geometry: GeoJSONFeature["geometry"];
}

export interface WardWithStats extends Ward {
  problemCount: number;
  totalUpvotes: number;
  avgSeverity: number;
}

// Cache for loaded GeoJSON data
let districtsCache: District[] | null = null;
let wardsCache: Ward[] | null = null;

/**
 * Load district boundaries from GeoJSON (Admin Level 2)
 */
export function loadDistricts(): District[] {
  if (districtsCache) return districtsCache;

  try {
    const filePath = join(process.cwd(), "data", "sle_admin2.geojson");
    const data = readFileSync(filePath, "utf-8");
    const geojson: GeoJSONFeatureCollection = JSON.parse(data);

    districtsCache = geojson.features.map((feature) => ({
      id: feature.properties.adm2_pcode || feature.properties.ADM2_PCODE || String(feature.properties.id),
      name: feature.properties.adm2_name || feature.properties.ADM2_EN || "Unknown",
      provinceName: feature.properties.adm1_name || feature.properties.ADM1_EN || "Unknown",
      geometry: feature.geometry,
    }));

    logger.info({ count: districtsCache.length }, "Loaded district boundaries");
    return districtsCache;
  } catch (error) {
    logger.error({ error }, "Failed to load district boundaries");
    return [];
  }
}

/**
 * Load chiefdom boundaries from GeoJSON (Admin Level 3)
 * Using chiefdoms as "wards" for granular visualization
 */
export function loadWards(): Ward[] {
  if (wardsCache) return wardsCache;

  try {
    const filePath = join(process.cwd(), "data", "sle_admin3.geojson");
    const data = readFileSync(filePath, "utf-8");
    const geojson: GeoJSONFeatureCollection = JSON.parse(data);

    wardsCache = geojson.features.map((feature) => ({
      id: feature.properties.adm3_pcode || feature.properties.ADM3_PCODE || String(feature.properties.id),
      name: feature.properties.adm3_name || feature.properties.ADM3_EN || "Unknown",
      districtName: feature.properties.adm2_name || feature.properties.ADM2_EN || "Unknown",
      provinceName: feature.properties.adm1_name || feature.properties.ADM1_EN || "Unknown",
      geometry: feature.geometry,
    }));

    logger.info({ count: wardsCache.length }, "Loaded ward/chiefdom boundaries");
    return wardsCache;
  } catch (error) {
    logger.error({ error }, "Failed to load ward boundaries");
    return [];
  }
}

/**
 * Check if a point is inside a polygon using ray casting algorithm
 */
function isPointInPolygon(lat: number, lon: number, polygon: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    if (
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Check if a point is inside a geometry (handles both Polygon and MultiPolygon)
 */
function isPointInGeometry(
  lat: number,
  lon: number,
  geometry: GeoJSONFeature["geometry"]
): boolean {
  if (geometry.type === "Polygon") {
    // Polygon: coordinates is [ring1, ring2, ...], ring1 is outer ring
    return isPointInPolygon(lat, lon, geometry.coordinates[0] as number[][]);
  } else if (geometry.type === "MultiPolygon") {
    // MultiPolygon: coordinates is [polygon1, polygon2, ...]
    for (const polygon of geometry.coordinates as number[][][][]) {
      if (isPointInPolygon(lat, lon, polygon[0])) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Get the ward that contains a given coordinate
 */
export function getWardByCoordinates(lat: number, lon: number): Ward | null {
  const wards = loadWards();
  
  for (const ward of wards) {
    if (isPointInGeometry(lat, lon, ward.geometry)) {
      return ward;
    }
  }
  return null;
}

/**
 * Get the district that contains a given coordinate
 */
export function getDistrictByCoordinates(lat: number, lon: number): District | null {
  const districts = loadDistricts();
  
  for (const district of districts) {
    if (isPointInGeometry(lat, lon, district.geometry)) {
      return district;
    }
  }
  return null;
}

/**
 * Get all wards as GeoJSON FeatureCollection
 */
export function getWardsGeoJSON(): GeoJSONFeatureCollection {
  const wards = loadWards();
  return {
    type: "FeatureCollection",
    features: wards.map((ward) => ({
      type: "Feature" as const,
      properties: {
        id: ward.id,
        name: ward.name,
        districtName: ward.districtName,
        provinceName: ward.provinceName,
      },
      geometry: ward.geometry,
    })),
  };
}

/**
 * Get all districts as GeoJSON FeatureCollection
 */
export function getDistrictsGeoJSON(): GeoJSONFeatureCollection {
  const districts = loadDistricts();
  return {
    type: "FeatureCollection",
    features: districts.map((district) => ({
      type: "Feature" as const,
      properties: {
        id: district.id,
        name: district.name,
        provinceName: district.provinceName,
      },
      geometry: district.geometry,
    })),
  };
}

/**
 * Get wards with problem statistics
 */
export async function getWardsWithStats(
  problems: Array<{ latitude: number | null; longitude: number | null; upvoteCount: number; severityScore: number }>
): Promise<Map<string, { problemCount: number; totalUpvotes: number; avgSeverity: number }>> {
  const wards = loadWards();
  const wardStats = new Map<string, { problemCount: number; totalUpvotes: number; severitySum: number }>();

  // Initialize stats for all wards
  for (const ward of wards) {
    wardStats.set(ward.id, { problemCount: 0, totalUpvotes: 0, severitySum: 0 });
  }

  // Count problems per ward
  for (const problem of problems) {
    if (problem.latitude === null || problem.longitude === null) continue;

    const ward = getWardByCoordinates(problem.latitude, problem.longitude);
    if (ward) {
      const stats = wardStats.get(ward.id)!;
      stats.problemCount++;
      stats.totalUpvotes += problem.upvoteCount;
      stats.severitySum += problem.severityScore || 0;
    }
  }

  // Calculate averages
  const result = new Map<string, { problemCount: number; totalUpvotes: number; avgSeverity: number }>();
  for (const [wardId, stats] of wardStats) {
    result.set(wardId, {
      problemCount: stats.problemCount,
      totalUpvotes: stats.totalUpvotes,
      avgSeverity: stats.problemCount > 0 ? stats.severitySum / stats.problemCount : 0,
    });
  }

  return result;
}

/**
 * Clear caches (useful for testing or hot reloading)
 */
export function clearBoundaryCache(): void {
  districtsCache = null;
  wardsCache = null;
}
