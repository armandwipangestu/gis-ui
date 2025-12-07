import React, { useEffect, useMemo, useState, type FormEvent } from "react";
import { SaveAll, MoveLeft } from "lucide-react";
import AppLayout from "../../../layouts/AppLayout";
import { useNavigate } from "react-router";
import { useMapCreate } from "../../../hooks/admin/map/useMapCreate";
import { useCategoriesAll } from "../../../hooks/admin/category/useCategoriesAll";
import { useMapConfiguration } from "../../../hooks/admin/map/useMapConfiguration";
import { toGeometryOrNull } from "../../../utils/geojson";
import { useSetting } from "../../../hooks/admin/setting/useSetting";
import { MapWithGeometryEditor } from "../../../components/Admin/Map/MapWithGeometryEditor";
import { toast } from "react-hot-toast";

// Interface for validation errors
interface ValidationErrors {
    [key: string]: string;
}

// Feature types for dropdown
type FeatureType = "Point" | "Polygon" | "LineString" | "MultiPolygon";

const MapCreate: React.FC = () => {
    // Change title page
    document.title = "Create Map - GIS Desa Santri";

    // Hook useNavigate
    const navigate = useNavigate();

    // State for store data map (non-map)
    const [image, setImage] = useState<File | null>(null);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [status, setStatus] = useState<"active" | "inactive">("active");

    // Additional dropdown: TYPE geometry/map
    const [featureType, setFeatureType] = useState<FeatureType>("Point");

    // Categories
    const [categoryId, setCategoryId] = useState<number>(0);

    // State for store error validation
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Map configuration used custom hook (single source of truth)
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

    // Initialize useMapCreate hook
    const { mutate, isPending } = useMapCreate();

    // Get all categories for dropdown
    const {
        data: categories,
        isLoading: catLoading,
        isError: catError,
    } = useCategoriesAll();

    // Get setting id 1 for default map configuration & guide polygon
    const { data: setting } = useSetting();

    // allowMulti automate true if MultiPolygon, else false
    const allowMulti = featureType === "MultiPolygon";

    // Default category when data ready
    useEffect(() => {
        if (
            !catLoading &&
            !catError &&
            Array.isArray(categories) &&
            categories.length > 0
        ) {
            setCategoryId((prev) => prev || Number(categories[0]?.id) || 0);
        }
    }, [catLoading, catError, categories]);

    // Reset geometry when change FeatureType (most safe)
    useEffect(() => {
        setGeometry("");
    }, [featureType, setGeometry]);

    // Function for handle submit form
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        mutate(
            {
                image,
                name,
                description,
                address,
                // Send lat/lng from hook to make sure consistent
                latitude: mapCenterLat,
                longitude: mapCenterLng,
                geometry: geometry ? geometry : undefined,
                status,
                category_id: Number(categoryId),
            },
            {
                onSuccess: () => {
                    // Redirect to page maps index
                    navigate("/admin/maps");

                    // Show toast success
                    toast.success("Map created successfully", {
                        position: "top-right",
                        duration: 3000,
                    });
                },
                onError: (error: any) => {
                    // Set validation errors
                    setErrors(error?.response?.data?.errors || {});
                },
            }
        );
    };

    // Handle changed geometry from map editor
    const handleGeometryChange = (g: any | null) => {
        if (!g) {
            setGeometry("");
            return;
        }

        // Save as JSON String
        setGeometry(JSON.stringify(g));

        // If type Point, synchronize lat/lng to form (use state hook)
        if (g?.type === "Point" && Array.isArray(g.coordinates)) {
            const [lng, lat] = g.coordinates;
            setMapCenterLat(lat.toFixed(5));
            setMapCenterLng(lng.toFixed(5));
        }
    };

    // Center map from hook
    const mapCenter = getMapCenter();
    // Geometry for editor (object from string)
    const userGeometryObj = useMemo(() => {
        return toGeometryOrNull(geometry);
    }, [geometry]);

    // Guide geometry = object untuk MapWithGeometryEditor (read from setting village_boundary)
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
                            Create Map
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 italic">
                            Form to create a new map record (Point / LineString
                            / Polygon / MultiPolygon).
                        </p>
                    </div>
                </div>

                {/* ====== NEW LAYOUT: left form, right map ====== */}
                <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                    {/* LEFT: FORM CARD */}
                    <div className="bg-white rounded-xl shadow">
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Image */}
                            <div>
                                <label
                                    htmlFor="image"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Image
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={(e) =>
                                        setImage(e.target.files?.[0] || null)
                                    }
                                    placeholder="image.png"
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
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter map name"
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
                                    placeholder="Enter map description"
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

                            {/* Address (textarea) */}
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
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter address / location"
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

                            {/* Category & Type side by side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Category */}
                                <div>
                                    <label
                                        htmlFor="category"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Category
                                    </label>
                                    <select
                                        value={categoryId || ""}
                                        id="category"
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
                                                {Array.isArray(categories) &&
                                                    categories.map(
                                                        (cat: any) => (
                                                            <option
                                                                key={cat.id}
                                                                value={cat.id}
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

                                {/* Type geometry/map */}
                                <div>
                                    <label
                                        htmlFor="type"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Type
                                    </label>
                                    <select
                                        value={featureType}
                                        id="type"
                                        onChange={(e) =>
                                            setFeatureType(
                                                e.target.value as FeatureType
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Point">Point</option>
                                        <option value="Polygon">Polygon</option>
                                        <option value="LineString">
                                            LineString
                                        </option>
                                        <option value="MultiPolygon">
                                            MultiPolygon
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Map center use hook */}
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
                                        placeholder="-7.59167"
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
                                        placeholder="112.25833"
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

                            {/* Status */}
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
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
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
                                    {isPending ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT: MAP CARD (sticky) */}
                    <div className="relative">
                        <div className="sticky top-28">
                            <div className="bg-white rounded-xl shadow p-4">
                                {/* Tools */}
                                <div className="flex items-center gap-2 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => handleUseCurrentView()}
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
                                    allowMulti={allowMulti}
                                    autoFit="always"
                                    onGeometryChange={handleGeometryChange}
                                    mapRef={mapRef}
                                    guideGeometry={guideGeometry}
                                />

                                {/* Raw Geometry (GeoJSON) */}
                                <label
                                    htmlFor="geometry"
                                    className="block text-sm font-medium text-gray-700 mt-4 mb-2"
                                >
                                    Raw Geometry (GeoJSON)
                                </label>
                                <textarea
                                    value={geometry}
                                    id="geometry"
                                    onChange={(e) =>
                                        setGeometry(e.target.value)
                                    }
                                    placeholder='{"type":"Point","coordinates":[112.25,-7.59]}'
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
                {/* ====== /NEW LAYOUT ====== */}
            </div>
        </AppLayout>
    );
};

export default MapCreate;
