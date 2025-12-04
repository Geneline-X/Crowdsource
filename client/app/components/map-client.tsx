"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, LatLngExpression, divIcon, point } from "leaflet";
import { Problem } from "@/lib/types";
import "leaflet/dist/leaflet.css";

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

interface MapCenterControllerProps {
  centerOnProblem?: Problem | null;
}

function MapCenterController({ centerOnProblem }: MapCenterControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (centerOnProblem && centerOnProblem.latitude && centerOnProblem.longitude) {
      map.flyTo([centerOnProblem.latitude, centerOnProblem.longitude], 16, {
        duration: 0.8,
      });
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
  const validProblems = problems.filter(
    (p) => p.latitude !== null && p.longitude !== null
  );

  const defaultCenter: LatLngExpression =
    validProblems.length > 0
      ? [validProblems[0].latitude!, validProblems[0].longitude!]
      : [40.7128, -74.006];

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
        {validProblems.map((problem) => {
          const isSelected = selectedProblemId === problem.id;
          return (
            <Marker
              key={problem.id}
              position={[problem.latitude!, problem.longitude!]}
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
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
