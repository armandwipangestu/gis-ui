import React, { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
// Import stylesheet leaflet (without leaflet-draw because not editing)
import "leaflet/dist/leaflet.css";

// Count bounds from GeoJSON Geometry / Feature / FeatureCollection
function boundsFromGeometry(g: any | null): L.LatLngBounds | null {
    if (!g) {
        return null;
    }
    try {
        // If input is Geometry, wrap as Feature
        const layer = L.geoJSON(
            g?.type && g.type !== "Feature" && g.type !== "FeatureCollection"
                ? ({ type: "Feature", geometry: g } as any)
                : (g as any)
        );

        const b = layer.getBounds();
        return b.isValid() ? b : null;
    } catch {
        return null;
    }
}

// Small component for setView if props center/zoom changed
function RecenterOnProps({
    center,
    zoom,
}: {
    center: [number, number];
    zoom: number;
}) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);

    return null;
}

// AutoFit => fitBounds(union(bounds(geometry), bounds(guideGeometry)))
function AutoFit({
    geometry,
    guideGeometry,
    mode,
}: {
    geometry: any | null;
    guideGeometry: any | null;
    mode: "never" | "onMount" | "always";
}) {
    const map = useMap();

    // Once when mount
    useEffect(() => {
        if (mode !== "onMount") {
            return;
        }

        const b1 = boundsFromGeometry(geometry);
        const b2 = boundsFromGeometry(guideGeometry);
        const union = b1 && b2 ? b1.extend(b2) : b1 ?? b2;
        if (union) {
            map.fitBounds(union.pad(0.1));
        }
    }, []);

    // Every props changed (mode 'always)
    useEffect(() => {
        if (mode !== "always") {
            return;
        }

        const b1 = boundsFromGeometry(geometry);
        const b2 = boundsFromGeometry(guideGeometry);
        const union = b1 && b2 ? b1.extend(b2) : b1 ?? b2;
        if (union) {
            map.fitBounds(union.pad(0.1));
        }
    }, [geometry, guideGeometry, mode, map]);

    return null;
}

// Layer non-editable for guideline limit (ex. village boundary)
function GuideGeometry({
    geometry,
    style,
}: {
    geometry: any | null;
    style?: L.PathOptions;
}) {
    const map = useMap();

    useEffect(() => {
        if (!geometry) {
            return;
        }

        const layer = L.geoJSON(
            geometry?.type &&
                geometry.type !== "Feature" &&
                geometry.type !== "FeatureCollection"
                ? ({ type: "Feature", geometry } as any)
                : (geometry as any),
            {
                style: {
                    color: "#2563eb",
                    weight: 2,
                    fillColor: "#93c5fd",
                    fillOpacity: 0.15,
                    ...style,
                },
            }
        );

        layer.addTo(map);

        return () => {
            map.removeLayer(layer);
        };
    }, [geometry, style, map]);

    return null;
}

// Layer non-editable for show main geometry
function ReadonlyGeometryLayer({
    geometry,
    style,
    pointAsCircle = true,
    onFeatureClick,
}: {
    geometry: any | null;
    style?: L.PathOptions;
    pointAsCircle?: boolean;
    onFeatureClick?: (
        feature: any,
        latlng?: { lat: number; lng: number }
    ) => void;
}) {
    const map = useMap();

    useEffect(() => {
        if (!geometry) {
            return;
        }

        const geojson =
            geometry?.type &&
            geometry.type !== "Feature" &&
            geometry.type !== "FeatureCollection"
                ? ({ type: "Feature", geometry } as any)
                : (geometry as any);

        // Helper get color category per feature
        const getCatColor = (feature?: any): string => {
            return feature?.properties?.category?.color || "#0ea5e9";
        };

        const layer = L.geoJSON(geojson, {
            style: (feature: any): L.PathOptions => {
                const c = getCatColor(feature);
                return {
                    color: c, // stroke
                    weight: 2,
                    opacity: 0.9,
                    fillColor: c, // fill following category.color
                    fillOpacity: 0.25,
                    ...style,
                };
            },
            pointToLayer: (feature: any, latlng) => {
                if (!pointAsCircle) {
                    return L.marker(latlng); // default marker (can't fill the color)
                }
                const c = getCatColor(feature);
                return L.circleMarker(latlng, {
                    radius: 8,
                    color: c, // stroke
                    weight: 2,
                    fillColor: c, // fill
                    fillOpacity: 0.9,
                });
            },
            // === NEW: install handler per feature ===
            onEachFeature: (feature, lyr) => {
                // Click -> passing to callback page
                (lyr as any).on?.("click", (e: any) => {
                    const ll = e?.latlng
                        ? { lat: e.latlng.lat, lng: e.latlng.lng }
                        : undefined;
                    onFeatureClick?.(feature, ll);
                });

                // OPTIONAL: at the same time popup default Leaflet (can be delete if not need)
                const p: any = feature?.properties ?? {};
                const c = getCatColor?.(feature) ?? "#0ea5e9";

                // Get destination: coordinat -> "lat, lng", fallback to address / name
                const coords = (() => {
                    if (
                        typeof p?.lat === "number" &&
                        typeof p?.lng === "number"
                    ) {
                        return [p.lng, p.lat] as [number, number];
                    }

                    const g = feature?.geometry;

                    if (
                        g?.type === "Point" &&
                        Array.isArray(g.coordinates) &&
                        g.coordinates.length >= 2
                    ) {
                        return [
                            Number(g.coordinates[0]),
                            Number(g.coordinates[1]),
                        ] as [number, number];
                    }

                    return null;
                })();

                const destQuery = coords
                    ? `${coords[1]},${coords[0]}`
                    : p?.address || p?.name || "";
                const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=&destination=${encodeURIComponent(
                    destQuery
                )}`;

                const html = `
                    <div style="min-width:200px;max-width:260px">
                        <!-- Badge category -->
                        <span style="
                        display:inline-flex;align-items:center;gap:6px;
                        padding:2px 8px;border:1px solid ${c};
                        color:${c};font-weight:700;font-size:11px;line-height:1;
                        border-radius:9999px;background:#fff;
                        ">
                        <span style="width:8px;height:8px;border-radius:9999px;background:${c};display:inline-block"></span>
                        ${p?.category?.name ?? "Tanpa kategori"}
                        </span>

                        ${
                            p?.image
                                ? `
                            <div style="height:96px;overflow:hidden;border-radius:8px;margin:10px 0 8px;background:#f1f5f9;">
                            <img src="${
                                import.meta.env.VITE_BASE_URL
                            }/uploads/maps/${p.image}"
                                style="width:100%;height:100%;object-fit:cover;display:block;" />
                            </div>
                        `
                                : ""
                        }

                        <div style="font-weight:700;margin-top:4px;color:#0f172a;">
                        ${p?.name ?? "Tanpa nama"}
                        </div>

                        ${
                            p?.address
                                ? `<div style="font-size:12px;color:#475569;margin-top:6px">${p.address}</div>`
                                : ""
                        }

                        <!-- Button Open Route -->
                        <div style="margin-top:10px">
                        <a href="${gmapsUrl}" target="_blank" rel="noopener"
                            style="
                            display:inline-flex;align-items:center;gap:8px;
                            padding:8px 10px;border-radius:10px;
                            background:${c};color:#fff;text-decoration:none;
                            box-shadow:0 4px 12px rgba(2,8,23,.15);
                            font-size:12px;font-weight:700;
                            ">
                            Petunjuk Arah
                            </a>
                        </div>
                    </div>
                `;
                (lyr as any).bindPopup?.(html, {
                    maxWidth: 280,
                    closeButton: true,
                });
            },
        });

        layer.addTo(map);

        return () => {
            map.removeLayer(layer);
        };
    }, [geometry, style, pointAsCircle, onFeatureClick, map]);

    return null;
}

export interface MapViewerProps extends PropsWithChildren {
    // Center start map
    center: [number, number];
    // Zoom start map
    zoom: number;
    // Geometry main that will be show (Geometry / Feature / FeatureCollection)
    geometry?: any | null;
    // Geometry guideline (ex. village boundary)
    guideGeometry?: any | null;
    // Auto-Fit behavior
    autoFit?: "never" | "onMount" | "always";
    // Ref map (optional)
    mapRef?: React.RefObject<LeafletMap | null>;
    // Class wrapper
    className?: string;
    // height wrapper
    height?: string;
    // Style custom for main geometry
    geometryStyle?: L.PathOptions;
    // Style custom for guideline (limit)
    guideStyle?: L.PathOptions;
    // Force remount MapContainer (workaround cache state)
    containerKey?: string | number;
    // Use circleMarker for point (default true)
    pointAsCircle?: boolean;
    // Callback when feature is clicked (feature, latlng)
    onFeatureClick?: (
        feature: any,
        latlng?: { lat: number; lng: number }
    ) => void;
}

export function MapViewer({
    center,
    zoom,
    geometry = null,
    guideGeometry = null,
    autoFit = "never",
    mapRef,
    className = "",
    height = "500px",
    children,
    geometryStyle,
    guideStyle,
    containerKey,
    pointAsCircle = true,
    onFeatureClick,
}: MapViewerProps) {
    return (
        <div
            className={`overflow-hidden rounded-lg border border-gray-200 ${className}`}
            style={{ height }}
        >
            <MapContainer
                key={containerKey ?? "map-viewer"}
                ref={mapRef}
                center={center}
                zoom={zoom}
                className="h-full w-full"
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Recenter if center/zoom changed */}
                <RecenterOnProps center={center} zoom={zoom} />

                {/* Guide / village boundary */}
                {guideGeometry && (
                    <GuideGeometry
                        geometry={guideGeometry}
                        style={guideStyle}
                    />
                )}

                {/* Geometry main (read-only) */}
                {geometry && (
                    <ReadonlyGeometryLayer
                        geometry={geometry}
                        style={geometryStyle}
                        pointAsCircle={pointAsCircle}
                        onFeatureClick={onFeatureClick}
                    />
                )}

                {children}

                {/* AutoFit last for consider all layer */}
                <AutoFit
                    geometry={geometry}
                    guideGeometry={guideGeometry}
                    mode={autoFit}
                />
            </MapContainer>
        </div>
    );
}
