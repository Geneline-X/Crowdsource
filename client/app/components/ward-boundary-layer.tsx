import { useEffect, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";

interface WardBoundaryLayerProps {
  visible: boolean;
  onWardClick?: (wardId: string, wardName: string) => void;
  highlightWardId?: string | null;
}

interface WardFeature {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    districtName: string;
    provinceName: string;
  };
  geometry: any;
}

interface WardGeoJSON {
  type: "FeatureCollection";
  features: WardFeature[];
}

export function WardBoundaryLayer({
  visible,
  onWardClick,
  highlightWardId,
}: WardBoundaryLayerProps) {
  const map = useMap();
  const [wardData, setWardData] = useState<WardGeoJSON | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible || wardData) return;

    const fetchWards = async () => {
      setLoading(true);
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
        const response = await fetch(`${serverUrl}/api/geo/districts`);
        
        // Check if response is OK before parsing
        if (!response.ok) {
          console.error("Failed to fetch ward boundaries:", response.status, response.statusText);
          return;
        }
        
        // Check content type to ensure it's JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Response is not JSON:", contentType);
          return;
        }
        
        const result = await response.json();
        if (result.success) {
          setWardData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch ward boundaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWards();
  }, [visible, wardData]);

  if (!visible || !wardData) {
    return null;
  }

  const getStyle = (feature: any) => {
    const isHighlighted = highlightWardId === feature.properties.id;
    return {
      color: isHighlighted ? "#3b82f6" : "#6b7280",
      weight: isHighlighted ? 3 : 1,
      fillColor: isHighlighted ? "#3b82f6" : "#374151",
      fillOpacity: isHighlighted ? 0.3 : 0.1,
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    
    // Bind popup with ward info
    layer.bindPopup(`
      <div class="p-2">
        <p class="font-bold text-sm">${props.name}</p>
        <p class="text-xs text-gray-500">${props.provinceName || props.districtName || ''}</p>
      </div>
    `);

    // Add click handler
    layer.on("click", () => {
      onWardClick?.(props.id, props.name);
    });

    // Highlight on hover
    layer.on("mouseover", () => {
      (layer as any).setStyle({
        fillOpacity: 0.3,
        weight: 2,
      });
    });

    layer.on("mouseout", () => {
      (layer as any).setStyle(getStyle(feature));
    });
  };

  return (
    <GeoJSON
      key={highlightWardId || "default"}
      data={wardData as any}
      style={getStyle}
      onEachFeature={onEachFeature}
    />
  );
}
