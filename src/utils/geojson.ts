export function safeParseJSON<T = any>(text: string): T | null {
    if (!text || !text.trim()) return null;
    try {
        return JSON.parse(text) as T;
    } catch {
        return null;
    }
}

// Normalizer: recieve any type (string|object|array|Feature|FeatureCollection)
// -> return Geometry valid or null
export function toGeometryOrNull(input: any): any | null {
    if (!input) return null;

    // If string JSON -> parse first
    if (typeof input === "string") {
        const parsed = safeParseJSON(input);
        return toGeometryOrNull(parsed);
    }

    // [] from API -> nothing geometry
    if (Array.isArray(input)) {
        return null;
    }

    // Feature -> get geometry
    if (input.type === "Feature") {
        return input.geometry ?? null;
    }

    // FeatureCollection
    // - empty -> null
    // - 1 item -> geometry first
    // - a lot & all polygon-ish -> merge to MultiPolygon
    if (input.type === "FeatureCollection") {
        const feats = Array.isArray(input.features) ? input.features : [];
        if (!feats.length) return null;
        if (feats.length === 1) return toGeometryOrNull(feats[0]);

        const coords: any[] = [];
        let allPolygonish = true;

        for (const f of feats) {
            const g = f?.geometry;
            if (!g || !g.type) continue;

            if (g.type === "Polygon") {
                coords.push(g.coordinates);
            } else if (g.type === "MultiPolygon") {
                coords.push(...g.coordinates);
            } else {
                allPolygonish = false;
                break;
            }
        }

        if (allPolygonish && coords.length) {
            return {
                type: "MultiPolygon",
                coordinates: coords,
            };
        }

        return feats[0]?.geometry ?? null;
    }

    // Geometry directly
    if (input.type && typeof input.type === "string") {
        return input;
    }

    return null;
}
