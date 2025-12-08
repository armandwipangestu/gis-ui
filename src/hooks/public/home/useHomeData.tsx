import { useMemo, useState, useCallback } from "react";
import { useSetting } from "../setting/useSetting";
import { useCategories } from "../category/useCategories";
import {
    DEFAULT_CENTER,
    DEFAULT_ZOOM,
} from "../../admin/map/useMapConfiguration";

export const useHomeData = () => {
    // Desctructuring data from custom hooks
    const { data: setting } = useSetting();
    const { data: categories } = useCategories();

    // State management
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Check center from setting
    const center = useMemo<[number, number]>(() => {
        const lat = Number(setting?.map_center_lat);
        const lng = Number(setting?.map_center_lng);

        return Number.isFinite(lat) && Number.isFinite(lng)
            ? [lat, lng]
            : DEFAULT_CENTER;
    }, [setting]);

    // Check zoom from setting
    const zoom = useMemo<number>(() => {
        const z = Number(setting?.map_zoom);

        return Number.isFinite(z) ? z : DEFAULT_ZOOM;
    }, [setting]);

    // Check guideGeometry from setting
    const guideGeometry = useMemo(() => {
        const vb = (setting as any)?.village_boundary;

        if (!vb) {
            return null;
        }

        if (typeof vb === "string") {
            try {
                return JSON.parse(vb);
            } catch {
                return null;
            }
        }

        return vb;
    }, [setting]);

    // Collection all map ids
    const allMapIds = useMemo<number[]>(() => {
        const out: number[] = [];
        (categories ?? []).forEach((cat: any) => {
            (cat?.maps ?? []).forEach((m: any) => {
                if (Number.isFinite(Number(m?.id))) {
                    out.push(Number(m.id));
                }
            });
        });

        return out;
    }, [categories]);

    // Check if all map ids selected
    const allChecked = useMemo(() => {
        if (allMapIds.length === 0) {
            return false;
        }

        const everySelected = allMapIds.every((id) => {
            return selectedIds.includes(id);
        });

        return everySelected;
    }, [allMapIds, selectedIds]);

    // Create feature collection from selectedIds
    const selectedCollection = useMemo(() => {
        const features: any[] = [];
        (categories ?? []).forEach((cat: any) => {
            (cat?.maps ?? []).forEach((m: any) => {
                if (!selectedIds.includes(Number(m?.id))) {
                    return;
                }

                const raw = m?.geometry;
                if (!raw) {
                    return;
                }

                let geom: any = null;
                if (typeof raw === "string") {
                    try {
                        geom = JSON.parse(raw);
                    } catch {
                        geom = null;
                    }
                } else if (typeof raw === "object") {
                    geom = raw;
                }

                if (!geom || !geom.type) {
                    return;
                }

                features.push({
                    type: "Feature",
                    geometry: geom,
                    properties: {
                        id: Number(m.id),
                        name: m.name,
                        address: m.address,
                        image: m.image,
                        category: {
                            id: cat.id,
                            name: cat.name,
                            color: cat.color,
                        },
                    },
                });
            });
        });

        return {
            type: "FeaturedCollection",
            features,
        };
    }, [categories, selectedIds]);

    // Function for toggle all map ids
    const toggleAll = useCallback(
        (checked: boolean) => {
            setSelectedIds(checked ? allMapIds : []);
        },
        [allMapIds]
    );

    // Function for toggle one map id
    const toggleOne = useCallback((mapId: number, checked: boolean) => {
        setSelectedIds((prev) => {
            const set = new Set(prev);
            if (checked) {
                set.add(mapId);
            } else {
                set.delete(mapId);
            }

            return Array.from(set);
        });
    }, []);

    // Function for handle feature click at map
    const handleFeatureClick = useCallback((feature: any) => {
        if (!feature || !feature.properties) {
            return;
        }
        // Handle feature click logic
    }, []);

    // Function for handle toggle category
    const handleCategoryToggle = useCallback((categoryId: number) => {
        setActiveCategoryId((prev) => {
            return prev === categoryId ? null : categoryId;
        });
        setSearchTerm(""); // Reset search term when category changed
    }, []);

    return {
        // State
        activeCategoryId,
        searchTerm,
        selectedIds,

        // Data
        categories: categories ?? [],
        center,
        zoom,
        guideGeometry,
        allChecked,
        selectedCollection,

        // Actions
        setActiveCategoryId,
        setSearchTerm,
        toggleAll,
        toggleOne,
        handleFeatureClick,
        handleCategoryToggle,
    };
};
