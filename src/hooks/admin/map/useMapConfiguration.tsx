import { useState, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";

// Constanta default center & zoom
export const DEFAULT_CENTER: [number, number] = [-7.546839, 112.23307];
export const DEFAULT_ZOOM = 12;

interface MapConfigurationProps {
    centerLat?: string;
    centerLng?: string;
    zoom?: number;
    geometry?: string;
}

// Hook for configuration map (center, zoom, geometry)
export function useMapConfiguration(initialConfig?: MapConfigurationProps) {
    // Center & Zoom
    const [mapCenterLat, setMapCenterLat] = useState<string>(
        initialConfig?.centerLat || ""
    );
    const [mapCenterLng, setMapCenterLng] = useState<string>(
        initialConfig?.centerLng || ""
    );
    const [mapZoom, setMapZoom] = useState<number>(
        initialConfig?.zoom || DEFAULT_ZOOM
    );

    // Geometry (JSON string). Still read villageBoundary if still used in old caller
    const [geometry, setGeometry] = useState<string>(
        initialConfig?.geometry ?? ""
    );

    // Map instance ref
    const mapRef = useRef<LeafletMap | null>(null);

    // Get current view from map (center + zoom) -> fill to state
    const handleUseCurrentView = (map: LeafletMap | null = mapRef.current) => {
        if (!map) return;
        const center = map.getCenter();
        const zoom = map.getZoom();
        setMapCenterLat(center.lat.toFixed(5));
        setMapCenterLng(center.lng.toFixed(5));
        setMapZoom(zoom);
    };

    // Reset geometry to empty
    const handleResetGeometry = () => {
        setGeometry("");
    };

    // Calculate center tuple ready used to <MapContainer />
    const getMapCenter = (): [number, number] => {
        const lat = mapCenterLat.trim() === "" ? NaN : parseFloat(mapCenterLat);
        const lng = mapCenterLng.trim() === "" ? NaN : parseFloat(mapCenterLng);
        return Number.isFinite(lat) && Number.isFinite(lng)
            ? [lat, lng]
            : DEFAULT_CENTER;
    };

    // Reset all to initialConfig
    const resetAll = () => {
        setMapCenterLat(initialConfig?.centerLat || "");
        setMapCenterLng(initialConfig?.centerLng || "");
        setMapZoom(initialConfig?.zoom || DEFAULT_ZOOM);
        setGeometry(initialConfig?.geometry || "");
    };

    return {
        // state
        mapCenterLat,
        mapCenterLng,
        mapZoom,
        geometry,
        mapRef,

        // Setters
        setMapCenterLat,
        setMapCenterLng,
        setMapZoom,
        setGeometry,

        // Actions
        handleUseCurrentView,
        handleResetGeometry,
        getMapCenter,

        // Helper
        resetAll,
    };
}
