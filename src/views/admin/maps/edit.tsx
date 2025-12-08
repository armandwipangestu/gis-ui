import React, { useEffect, useMemo, useState, type FormEvent } from "react";
import { SaveAll, MoveLeft } from "lucide-react";
import AppLayout from "../../../layouts/AppLayout";
import { useNavigate, useParams } from "react-router";
import { useMapById } from "../../../hooks/admin/map/useMapById";
import { useMapUpdate } from "../../../hooks/admin/map/useMapUpdate";
import { useCategoriesAll } from "../../../hooks/admin/category/useCategoriesAll";
import { useMapConfiguration } from "../../../hooks/admin/map/useMapConfiguration";
import { toGeometryOrNull } from "../../../utils/geojson";
import { useSetting } from "../../../hooks/admin/setting/useSetting";
import { MapWithGeometryEditor } from "../../../components/Admin/Map/MapWithGeometryEditor";
import { toast } from "react-hot-toast";

interface ValidationErrors {
    [key: string]: string;
}

// Type feature for dropdown (optional)
type FeatureType = "Point" | "Polygon" | "LineString" | "MultiPolygon";

const MapEdit: React.FC = () => {
    // Change title page
    document.title = "Edit Map - GIS Desa Santri";

    // Route helpers
    const navigate = useNavigate();
    const { id } = useParams(); // route is /admin/maps/edit/:id -> extract :id
    const numericId = Number(id);

    // Form state (non-map)
    const [image, setImage] = useState<File | null>(null); // optional new image
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [status, setStatus] = useState<"active" | "inactive">("active");
    const [categoryId, setCategoryId] = useState<number>(0);

    // Feature type (follow geometry when prefill)
    const [featureType, setFeatureType] = useState<FeatureType>("Point");

    // Errors
    const [errors, setErrors] = useState<ValidationErrors>({});

    const {
        mapCenterLat,
        mapCenterLng,
        geometry,
        mapRef,
        setMapCenterLat,
        setMapCenterLng,
        setGeometry,
        handleUseCurrentView,
        handleResetGeometry,
        getMapCenter,
    } = useMapConfiguration();

    // Hooks fetch by id + update
    const { data: mapData, isLoading, isError } = useMapById(numericId);
    const { mutate, isPending } = useMapUpdate();

    // categories dropdown
    const {
        data: categories,
        isLoading: catLoading,
        isError: catError,
    } = useCategoriesAll();

    // Setting (zoom + guide boundary)
    const { data: setting } = useSetting();

    // PREFILL: fill form & map state when data ready
    useEffect(() => {
        if (!mapData) return;

        setName(mapData.name ?? "");
        setDescription(mapData.description ?? "");
        setAddress(mapData.address ?? "");
        setStatus((mapData.status as "active" | "inactive") ?? "active");
        setCategoryId(Number(mapData.category_id ?? 0));

        // Center lat/lng as string
        setMapCenterLat(String(mapData.latitude ?? ""));
        setMapCenterLng(String(mapData.longitude ?? ""));

        // Geometry to JSON string
        try {
            if (mapData.geometry) {
                setGeometry(
                    typeof mapData.geometry === "string"
                        ? mapData.geometry
                        : JSON.stringify(mapData.geometry)
                );
            } else {
                setGeometry("");
            }
        } catch {
            setGeometry("");
        }

        // Define featureType from geometry
        const g = toGeometryOrNull(
            typeof mapData.geometry === "string"
                ? mapData.geometry
                : mapData.geometry
                ? JSON.stringify(mapData.geometry)
                : ""
        );
        if (
            g?.type === "Point" ||
            g?.type === "LineString" ||
            g?.type === "Polygon" ||
            g?.type === "MultiPolygon"
        ) {
            setFeatureType(g.type as FeatureType);
        } else {
            setFeatureType("Point");
        }
    }, [mapData, setMapCenterLat, setMapCenterLng, setGeometry]);

    // SUBMIT: update map
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        setErrors({}); // reset error

        mutate(
            {
                id: numericId,
                image, // optional
                name,
                description,
                address,
                latitude: mapCenterLat,
                longitude: mapCenterLng,
                geometry: geometry ? geometry : undefined,
                status,
                category_id: Number(categoryId),
            },
            {
                onSuccess: () => {
                    navigate("/admin/maps");
                    toast.success("Map updated successfully!", {
                        position: "top-right",
                        duration: 3000,
                    });
                },
                onError: (error: any) => {
                    setErrors(error?.response?.data?.errors || {});
                },
            }
        );
    };

    // Synchronize editor -> form
    const handleGeometryChange = (g: any | null) => {
        if (!g) {
            setGeometry("");
            return;
        }
        setGeometry(JSON.stringify(g));

        // auto-sync lat/lng if Point
        if (g?.type === "Point" && Array.isArray(g.coordinates)) {
            const [lng, lat] = g.coordinates;
            setMapCenterLat(lat.toFixed(5));
            setMapCenterLng(lng.toFixed(5));
        }
    };

    // Value for map
    const mapCenter = getMapCenter();
    const userGeometryObj = useMemo(
        () => toGeometryOrNull(geometry),
        [geometry]
    );
    const guideGeometry = useMemo(() => {
        const vb = setting?.village_boundary;
        return toGeometryOrNull(
            typeof vb === "string" ? vb : vb ? JSON.stringify(vb) : ""
        );
    }, [setting]);

    return (
        <AppLayout>
            <div className="px-4 py-3 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Edit Map
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 italic">
                            Update map record (Point / LineString / Polygon /
                            MultiPolygon).
                        </p>
                    </div>
                </div>

                {/* Loading & Error first */}
                {isLoading && (
                    <div className="bg-white rounded-xl shadow p-6 text-sm text-slate-500">
                        Loading map...
                    </div>
                )}
                {isError && !isLoading && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                        Gagal memuat data map.
                    </div>
                )}

                {/* Success state */}
                {!isLoading && !isError && (
                    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                        {/* LEFT: FORM */}
                        <div className="bg-white rounded-xl shadow">
                            <form
                                onSubmit={handleSubmit}
                                className="p-6 space-y-5"
                            >
                                {/* Image (optional) */}
                                <div>
                                    <label
                                        htmlFor="image"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Image (optional)
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        onChange={(e) =>
                                            setImage(
                                                e.target.files?.[0] || null
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {errors.Image && (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 -mt-2 rounded-xl"
                                        role="alert"
                                    >
                                        <span className="block sm:inline">
                                            {errors.Image}
                                        </span>
                                    </div>
                                )}

                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {errors.Name && (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 -mt-2 rounded-xl"
                                        role="alert"
                                    >
                                        <span className="block sm:inline">
                                            {errors.Name}
                                        </span>
                                    </div>
                                )}

                                {/* Description */}
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        value={description}
                                        id="description"
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {errors.Description && (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 -mt-2 rounded-xl"
                                        role="alert"
                                    >
                                        <span className="block sm:inline">
                                            {errors.Description}
                                        </span>
                                    </div>
                                )}

                                {/* Address */}
                                <div>
                                    <label
                                        htmlFor="address"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Address
                                    </label>
                                    <textarea
                                        value={address}
                                        id="address"
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {errors.Address && (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 -mt-2 rounded-xl"
                                        role="alert"
                                    >
                                        <span className="block sm:inline">
                                            {errors.Address}
                                        </span>
                                    </div>
                                )}

                                {/* Category & Status */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label
                                            htmlFor="category_id"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Category
                                        </label>
                                        <select
                                            value={categoryId || ""}
                                            id="category_id"
                                            onChange={(e) =>
                                                setCategoryId(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={catLoading || catError}
                                        >
                                            {catLoading && (
                                                <option value="">
                                                    Loading categories...
                                                </option>
                                            )}
                                            {catError && (
                                                <option value="">
                                                    Failed to load categories
                                                </option>
                                            )}
                                            {!catLoading && !catError && (
                                                <>
                                                    <option value="" disabled>
                                                        Pilih kategori
                                                    </option>
                                                    {Array.isArray(
                                                        categories
                                                    ) &&
                                                        categories.map(
                                                            (cat: any) => (
                                                                <option
                                                                    key={cat.id}
                                                                    value={
                                                                        cat.id
                                                                    }
                                                                >
                                                                    {cat.name}
                                                                </option>
                                                            )
                                                        )}
                                                </>
                                            )}
                                        </select>
                                        {errors.CategoryId && (
                                            <div
                                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 -mt-2 rounded-xl"
                                                role="alert"
                                            >
                                                <span className="block sm:inline">
                                                    {errors.CategoryId}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="status"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Status
                                        </label>
                                        <select
                                            value={status}
                                            id="status"
                                            onChange={(e) =>
                                                setStatus(
                                                    e.target.value as
                                                        | "active"
                                                        | "inactive"
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="inactive">
                                                Inactive
                                            </option>
                                        </select>
                                        {errors.Status && (
                                            <div
                                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 -mt-2 rounded-xl"
                                                role="alert"
                                            >
                                                <span className="block sm:inline">
                                                    {errors.Status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Center (lat/lng) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label
                                            htmlFor="latitude"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Latitude
                                        </label>
                                        <input
                                            type="text"
                                            id="latitude"
                                            value={mapCenterLat}
                                            onChange={(e) =>
                                                setMapCenterLat(e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.Latitude && (
                                            <div
                                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 -mt-2 rounded-xl"
                                                role="alert"
                                            >
                                                <span className="block sm:inline">
                                                    {errors.Latitude}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="longitude"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Longitude
                                        </label>
                                        <input
                                            type="text"
                                            id="longitude"
                                            value={mapCenterLng}
                                            onChange={(e) =>
                                                setMapCenterLng(e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.Longitude && (
                                            <div
                                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 -mt-2 rounded-xl"
                                                role="alert"
                                            >
                                                <span className="block sm:inline">
                                                    {errors.Longitude}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-start pt-2">
                                    <button
                                        type="button"
                                        className="px-4 py-2 flex items-center bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 mr-2"
                                        onClick={() => window.history.back()}
                                    >
                                        <MoveLeft className="mr-2" size={18} />
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="px-4 py-2 flex items-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        <SaveAll className="mr-2" size={18} />
                                        {isPending ? "Updating..." : "Update"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* RIGHT: MAP (sticky) */}
                        <div className="relative">
                            <div className="sticky top-28">
                                <div className="bg-white rounded-xl shadow p-4">
                                    {/* Tools */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleUseCurrentView()
                                            }
                                            className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 hover:bg-slate-50"
                                        >
                                            Use Current View
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleResetGeometry}
                                            className="px-3 py-1.5 text-sm rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50"
                                        >
                                            Reset Geometry
                                        </button>
                                    </div>

                                    {/* Map */}
                                    <MapWithGeometryEditor
                                        center={mapCenter}
                                        zoom={setting?.map_zoom || 16}
                                        geometry={userGeometryObj}
                                        featureType={featureType}
                                        allowMulti={
                                            featureType === "MultiPolygon"
                                        }
                                        autoFit="always"
                                        onGeometryChange={handleGeometryChange}
                                        mapRef={mapRef}
                                        guideGeometry={guideGeometry}
                                    />

                                    {/* Raw Geometry */}
                                    <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
                                        Raw Geometry (GeoJSON)
                                    </label>
                                    <textarea
                                        value={geometry}
                                        onChange={(e) =>
                                            setGeometry(e.target.value)
                                        }
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.Geometry && (
                                        <div
                                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl"
                                            role="alert"
                                        >
                                            <span className="block sm:inline">
                                                {errors.Geometry}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default MapEdit;
