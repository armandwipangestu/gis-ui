import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";

// Type GeometryType based on GeoJSON spec
export type GeometryType = "Point" | "LineString" | "Polygon" | "MultiPolygon";

interface Props {
    value: any | null;
    onChange: (geomtery: any | null, map?: L.Map) => void;
    type: GeometryType; // 'Point' | 'LineString' | 'Polygon' | 'MultiPolygon'
    allowMulti?: boolean; // true => Multi*, false => single
    autoFit?: "never" | "onMount" | "always";
}

interface MultiGeometryProps {
    features: any[];
    type: GeometryType;
    allowMulti: boolean;
}

/** ----------------------------
 * Small helper & constant
 * -----------------------------
 */

// baseLine: all mode image shutdown then enable based on "type"
const DRAW_DISABLED_BASE = {
    polygon: false,
    polyline: false,
    marker: false,
    rectanle: false,
    circle: false,
    circlemarker: false,
} as const;

// Create option draw based on "type" that requested
function buildDrawOptions(type: GeometryType) {
    const draw: any = { ...DRAW_DISABLED_BASE };

    if (type === "Polygon" || type === "MultiPolygon") {
        draw.polygon = {
            allowInteraction: false,
            showAre: true,
        };
    } else if (type === "LineString") {
        draw.polyline = {};
    } else {
        // Default to marker for Point
        draw.marker = {};
    }

    return draw;
}

// Shape Multi* geometry if exist >1 feature, still follow original logic
function toMultiGeometry({ features, type, allowMulti }: MultiGeometryProps) {
    // If type MultiPolygon or allowMulti active and total feature > 1
    if ((type === "MultiPolygon" || allowMulti) && features.length > 1) {
        const coords = features.map((f: any) => f.geometry.coordinates);

        // Maintain real mapping for LineString, Point, in addition MultiPolygon
        if (type === "LineString") {
            return { type: "MultiLineString", coordinates: coords };
        }

        if (type === "Point") {
            return { type: "MultiPoint", coordinates: coords };
        }

        return { type: "MultiPolygon", coordinates: coords };
    }

    // Single feature
    return features[0]?.geometry ?? null;
}

// Fit viewport to bounds features-group (with padding 10%)
function fitToFeatureGroup(map: L.Map, fg: L.FeatureGroup) {
    const bounds = fg.getBounds();
    if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.1));
        return true;
    }

    return false;
}

export function GeometryEditor({
    value,
    onChange,
    type,
    allowMulti = false,
    autoFit = "onMount",
}: Props) {
    const map = useMap();

    // FeatureGroup save layer result image/edit
    const fgRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

    // Save instance control draw so that can easly deleted when unmount
    const drawCtlRef = useRef<any>(null);

    // Flag so that autoFit only do one time when onMount (if requested)
    const fittedRef = useRef(false);

    // Initialize draw control + event listeners
    useEffect(() => {
        const fg = fgRef.current;
        map.addLayer(fg);

        // Prepare option based on type
        const draw = buildDrawOptions(type);

        // Install control leaflet-draw (edit/remove active on the same featureGroup)
        drawCtlRef.current = new (L as any).Control.Draw({
            edit: { featureGroup: fg, remove: true },
            draw,
        });
        map.addControl(drawCtlRef.current);

        // Utilize for craft GeoJSON from layer on featureGroup
        const updateGeometry = () => {
            const fc: any = fg.toGeoJSON();

            // If empty -> send null (reset)
            if (!fc.features.length) {
                onChange(null, map);
                return;
            }

            // Multi/single follow logic that already exist
            const next = toMultiGeometry({
                features: fc.features,
                type,
                allowMulti,
            });
            onChange(next, map);
        };

        // When new layer created
        const onCreated = (e: any) => {
            const layer = e.layer;
            fg.addLayer(layer);

            // If not multi, makesure only the last layer remains
            if (!(type === "MultiPolygon" || allowMulti)) {
                fg.eachLayer((l: any) => {
                    if (l !== layer) {
                        fg.removeLayer(l);
                    }
                });
            }

            updateGeometry();
        };

        // Register important event from leaflet-draw
        const CREATED = (L as any).Draw.Event.CREATED;
        const EDITED = (L as any).Draw.Event.EDITED;
        const DELETED = (L as any).Draw.Event.DELETED;

        map.on(CREATED, onCreated);
        map.on(EDITED, updateGeometry);
        map.on(DELETED, updateGeometry);

        // Cleanup when unmount or prop changed
        return () => {
            map.off(CREATED, onCreated);
            map.off(EDITED, updateGeometry);
            map.off(DELETED, updateGeometry);
            if (drawCtlRef.current) {
                map.removeControl(drawCtlRef.current);
            }
            map.removeLayer(fg);
        };
    }, [map, type, allowMulti, onChange]);

    // Synchronize from prop `value` -> render layer on map + autofit
    useEffect(() => {
        const fg = fgRef.current;

        // Clean old layer
        fg.clearLayers();
        if (!value) return;

        try {
            // Render geometry from prop `value`
            const layer = L.geoJSON({
                type: "Feature",
                properties: {},
                geometry: value,
            } as any);

            layer.eachLayer((l: any) => fg.addLayer(l));

            // Determine is need auto-fit
            const shouldFit =
                autoFit === "always" ||
                (autoFit === "onMount" && !fittedRef.current);

            if (shouldFit && fitToFeatureGroup(map, fg)) {
                fittedRef.current = true;
            } else if (value.type === "Point") {
                // Fallback for Point if bounds not valid
                const [lng, lat] = value.coordinates;
                map.setView([lat, lng], 16);
            }
        } catch {
            // ignore if geojson is invalid
        }
    }, [value, map, autoFit]);

    return null;
}

// Show guide layer (read-only) at above map
export function GuideGeometry({ geometry }: { geometry: any | null }) {
    const map = useMap();

    // Style guide create constant to make easily recognizable
    const GUIDE_STYLE = {
        weight: 2,
        color: "#2563eb",
        fillColor: "#93c5fd",
        fillOpacity: 0.15,
    } as const;

    useEffect(() => {
        if (!geometry) return;

        const layer = L.geoJSON(geometry as any, { style: GUIDE_STYLE as any });
        layer.addTo(map);

        return () => {
            map.removeLayer(layer);
        };
    }, [geometry, map]);

    return null;
}
