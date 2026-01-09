import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logger } from "../logger";
import {
  loadWards,
  loadDistricts,
  getWardsGeoJSON,
  getDistrictsGeoJSON,
  getWardByCoordinates,
  getDistrictByCoordinates,
  getWardsWithStats,
} from "../services/ward-boundary-service";
import {
  getRoute,
  findNearestProblem,
  formatDistance,
  formatDuration,
} from "../services/routing-service";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/geo/districts
 * Get all district boundaries as GeoJSON
 */
router.get("/districts", async (req: Request, res: Response) => {
  try {
    const geojson = getDistrictsGeoJSON();
    res.json({
      success: true,
      data: geojson,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get district boundaries");
    res.status(500).json({ success: false, error: "Failed to get district boundaries" });
  }
});

/**
 * GET /api/geo/wards
 * Get all ward/chiefdom boundaries as GeoJSON
 */
router.get("/wards", async (req: Request, res: Response) => {
  try {
    const geojson = getWardsGeoJSON();
    res.json({
      success: true,
      data: geojson,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get ward boundaries");
    res.status(500).json({ success: false, error: "Failed to get ward boundaries" });
  }
});

/**
 * GET /api/geo/wards/stats
 * Get wards with problem statistics
 */
router.get("/wards/stats", async (req: Request, res: Response) => {
  try {
    const problems = await prisma.problem.findMany({
      where: {
        status: { not: "REJECTED" },
      },
      select: {
        latitude: true,
        longitude: true,
        upvoteCount: true,
        severityScore: true,
      },
    });

    const wardStats = await getWardsWithStats(problems);
    const wards = loadWards();

    // Combine ward info with stats
    const result = wards.map((ward) => {
      const stats = wardStats.get(ward.id) || { problemCount: 0, totalUpvotes: 0, avgSeverity: 0 };
      return {
        id: ward.id,
        name: ward.name,
        districtName: ward.districtName,
        provinceName: ward.provinceName,
        ...stats,
      };
    });

    // Sort by problem count descending
    result.sort((a, b) => b.problemCount - a.problemCount);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get ward stats");
    res.status(500).json({ success: false, error: "Failed to get ward stats" });
  }
});

/**
 * GET /api/geo/heatmap
 * Get problem coordinates and weights for heat map visualization
 */
router.get("/heatmap", async (req: Request, res: Response) => {
  try {
    const problems = await prisma.problem.findMany({
      where: {
        status: { not: "REJECTED" },
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        latitude: true,
        longitude: true,
        upvoteCount: true,
        severityScore: true,
      },
    });

    // Format for heat map: [lat, lon, intensity]
    const heatmapData = problems.map((p) => ({
      lat: p.latitude!,
      lon: p.longitude!,
      // Intensity based on upvotes and severity
      intensity: Math.min(1, (p.upvoteCount / 10 + (p.severityScore || 0) / 100) / 2),
    }));

    res.json({
      success: true,
      data: heatmapData,
      count: heatmapData.length,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get heatmap data");
    res.status(500).json({ success: false, error: "Failed to get heatmap data" });
  }
});

/**
 * GET /api/geo/locate/:lat/:lon
 * Get ward and district for a given coordinate
 */
router.get("/locate/:lat/:lon", async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.params.lat);
    const lon = parseFloat(req.params.lon);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ success: false, error: "Invalid coordinates" });
    }

    const ward = getWardByCoordinates(lat, lon);
    const district = getDistrictByCoordinates(lat, lon);

    res.json({
      success: true,
      data: {
        ward: ward
          ? { id: ward.id, name: ward.name, districtName: ward.districtName }
          : null,
        district: district
          ? { id: district.id, name: district.name, provinceName: district.provinceName }
          : null,
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to locate coordinates");
    res.status(500).json({ success: false, error: "Failed to locate coordinates" });
  }
});

/**
 * GET /api/geo/route/:fromLat/:fromLon/:problemId
 * Get route from a location to a specific problem
 */
router.get("/route/:fromLat/:fromLon/:problemId", async (req: Request, res: Response) => {
  try {
    const fromLat = parseFloat(req.params.fromLat);
    const fromLon = parseFloat(req.params.fromLon);
    const problemId = parseInt(req.params.problemId, 10);

    if (isNaN(fromLat) || isNaN(fromLon) || isNaN(problemId)) {
      return res.status(400).json({ success: false, error: "Invalid parameters" });
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: { id: true, title: true, latitude: true, longitude: true },
    });

    if (!problem || problem.latitude === null || problem.longitude === null) {
      return res.status(404).json({ success: false, error: "Problem not found or has no location" });
    }

    const route = await getRoute(fromLat, fromLon, problem.latitude, problem.longitude);

    if (!route.success) {
      return res.status(400).json({ success: false, error: route.error });
    }

    res.json({
      success: true,
      data: {
        problem: {
          id: problem.id,
          title: problem.title,
          latitude: problem.latitude,
          longitude: problem.longitude,
        },
        route: {
          distance: route.distance,
          distanceFormatted: formatDistance(route.distance),
          duration: route.duration,
          durationFormatted: formatDuration(route.duration),
          geometry: route.geometry,
        },
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to calculate route");
    res.status(500).json({ success: false, error: "Failed to calculate route" });
  }
});

/**
 * GET /api/geo/nearest/:lat/:lon
 * Find the nearest problem from a given location and return route
 */
router.get("/nearest/:lat/:lon", async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.params.lat);
    const lon = parseFloat(req.params.lon);
    const { status } = req.query;

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ success: false, error: "Invalid coordinates" });
    }

    const problems = await prisma.problem.findMany({
      where: {
        status: status ? (status as any) : { not: "REJECTED" },
        latitude: { not: null },
        longitude: { not: null },
      },
      select: { id: true, title: true, latitude: true, longitude: true },
    });

    const nearest = findNearestProblem(lat, lon, problems);

    if (!nearest) {
      return res.json({
        success: true,
        data: null,
        message: "No problems found",
      });
    }

    // Get route to nearest
    const route = await getRoute(lat, lon, nearest.lat, nearest.lon);
    const problem = problems.find((p) => p.id === nearest.id);

    res.json({
      success: true,
      data: {
        problem: {
          id: problem!.id,
          title: problem!.title,
          latitude: nearest.lat,
          longitude: nearest.lon,
          straightLineDistance: nearest.distance,
          straightLineDistanceFormatted: formatDistance(nearest.distance),
        },
        route: route.success
          ? {
              distance: route.distance,
              distanceFormatted: formatDistance(route.distance),
              duration: route.duration,
              durationFormatted: formatDuration(route.duration),
              geometry: route.geometry,
            }
          : null,
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to find nearest problem");
    res.status(500).json({ success: false, error: "Failed to find nearest problem" });
  }
});

/**
 * GET /api/geo/problems-by-ward/:wardId
 * Get problems in a specific ward
 */
router.get("/problems-by-ward/:wardId", async (req: Request, res: Response) => {
  try {
    const { wardId } = req.params;
    const wards = loadWards();
    const ward = wards.find((w) => w.id === wardId);

    if (!ward) {
      return res.status(404).json({ success: false, error: "Ward not found" });
    }

    // Get all problems with location
    const allProblems = await prisma.problem.findMany({
      where: {
        status: { not: "REJECTED" },
        latitude: { not: null },
        longitude: { not: null },
      },
      include: {
        images: { take: 1 },
      },
    });

    // Filter to problems in this ward
    const problemsInWard = allProblems.filter((p) => {
      const problemWard = getWardByCoordinates(p.latitude!, p.longitude!);
      return problemWard?.id === wardId;
    });

    res.json({
      success: true,
      data: {
        ward: {
          id: ward.id,
          name: ward.name,
          districtName: ward.districtName,
        },
        problems: problemsInWard,
        count: problemsInWard.length,
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to get problems by ward");
    res.status(500).json({ success: false, error: "Failed to get problems by ward" });
  }
});

export default router;
