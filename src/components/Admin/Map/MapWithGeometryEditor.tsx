import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { GeometryEditor } from "./GeometryEditor";
import { RecenterOnProps } from "./RecenterOnProps";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface AutoFitProps {
    geometry: any | null;
    guideGeometry: any | null;
    mode: "never" | "onMount" | "always";
}

interface GuideGeometryProps {
    geometry: any | null;
    style?: L.PathOptions;
}

// Count bounds from GeoJSON Geometry / Feature / FeatureCollection
function boundsFromGeometry(g: any | null): L.LatLngBounds | null {
    if (!g) return null;
    try {
        const layer = L.geoJSON(
            g.type ? ({ type: "Feature", geometry: g } as any) : (g as any)
        );
        const b = layer.getBounds();
        return b.isValid() ? b : null;
    } catch {
        return null;
    }
}

// AutoFit will call fitBounds to union(bounds(geometry), bounds(guideGeometry))
function AutoFit({ geometry, guideGeometry, mode }: AutoFitProps) {
    const map = useMap();

    // ONCE when mount
    useEffect(() => {
        if (mode !== "onMount") return;
        const b1 = boundsFromGeometry(geometry);
        const b2 = boundsFromGeometry(guideGeometry);
        const union = b1 && b2 ? b1.extend(b2) : b1 ?? b2;
        if (union) map.fitBounds(union.pad(0.1));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Every props changed (mode 'always')
    useEffect(() => {
        if (mode !== "always") return;
        const b1 = boundsFromGeometry(geometry);
        const b2 = boundsFromGeometry(guideGeometry);
        const union = b1 && b2 ? b1.extend(b2) : b1 ?? b2;
        if (union) map.fitBounds(union.pad(0.1));
    }, [geometry, guideGeometry, mode, map]);

    return null;
}

// Layer non-editable for guideline limit
function GuideGeometry({ geometry, style }: GuideGeometryProps) {
    const map = useMap();

    useEffect(() => {
        if (!geometry) return;

        const layer = L.geoJSON(geometry as any, {
            style: {
                color: "#2563eb",
                weight: 2,
                fillColor: "#93c5fd",
                fillOpacity: 0.15,
                ...style,
            },
        });

        layer.addTo(map);
        return () => {
            map.removeLayer(layer);
        };
    }, [geometry, style, map]);

    return null;
}

interface MapWithGeometryEditorProps {
    center: [number, number]; // center map (lat, lng)
    zoom: number; // first level zoom
    geometry: any | null; // GeoJSON Geometry that currently edited
    featureType: "Point" | "Polygon" | "LineString" | "MultiPolygon";
    allowMulti: boolean; // true -> allow Multi*
    autoFit?: "never" | "onMount" | "always"; // behavior auto-fit
    onGeometryChange: (geometry: any | null) => void; // callback when geometry changed
    mapRef?: React.RefObject<LeafletMap | null>; // access instance map (optional)
    className?: string; // styling container
    height?: string; // height container (default 500px)
    guideGeometry?: any | null; // geometry guidline (optional)
    guideStyle?: L.PathOptions; // style guidline (optional)
    // Force remount MapContainer
    containerKey?: string | number; // force re-mount MapContainer
}

export function MapWithGeometryEditor({
    center,
    zoom,
    geometry,
    featureType,
    allowMulti,
    autoFit = "never",
    onGeometryChange,
    mapRef,
    className = "",
    height = "500px",
    guideGeometry,
    guideStyle,
    containerKey, // NEW
}: MapWithGeometryEditorProps) {
    return (
        <div
            className={`overflow-hidden rounded-lg border border-gray-200 ${className}`}
            style={{ height }}
        >
            <MapContainer
                key={containerKey ?? "map-default"}
                ref={mapRef}
                center={center}
                zoom={zoom}
                className="h-full w-full"
                style={{ height: "100%", width: "100%" }}
            >
                {/* basemap OSM */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Follow changed center/zoom from props (without animation) */}
                <RecenterOnProps center={center} zoom={zoom} />

                {guideGeometry && (
                    // Overlay guideline (optional, read-only)
                    <GuideGeometry
                        geometry={guideGeometry}
                        style={guideStyle}
                    />
                )}

                {/* Main Editor (image/edit/delete user side) */}
                <GeometryEditor
                    value={geometry}
                    onChange={onGeometryChange}
                    type={featureType}
                    allowMulti={allowMulti}
                    autoFit={autoFit}
                />

                {/* Always put AutoFit last, so consider count all layer on top */}
                <AutoFit
                    geometry={geometry}
                    guideGeometry={guideGeometry}
                    mode={autoFit}
                />
            </MapContainer>
        </div>
    );
}
