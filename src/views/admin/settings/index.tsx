import React, { useEffect, useState, type FormEvent } from "react";
import { SaveAll, MoveLeft } from "lucide-react";
import AppLayout from "../../../layouts/AppLayout";
import { useNavigate } from "react-router";
import { useSetting } from "../../../hooks/admin/setting/useSetting";
import { useSettingUpdate } from "../../../hooks/admin/setting/useSettingUpdate";
import { toast } from "react-hot-toast";
import {
    useMapConfiguration,
    DEFAULT_ZOOM,
} from "../../../hooks/admin/map/useMapConfiguration";
import { toGeometryOrNull, safeParseJSON } from "../../../utils/geojson";
import { MapWithGeometryEditor } from "../../../components/Admin/Map/MapWithGeometryEditor";

interface ValidationErrors {
    [key: string]: string;
}

const Settings: React.FC = () => {
    // Change title page
    document.title = "Edit Setting - GIS Desa Santri";

    // Initialize useNavigate
    const navigate = useNavigate();

    // State form (still like default)
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [clientError, setClientError] = useState<string>("");

    // Map configuration used custom hook
    const {
        mapCenterLat,
        mapCenterLng,
        mapZoom,
        geometry,
        mapRef,
        setMapCenterLat,
        setMapCenterLng,
        setMapZoom,
        setGeometry,
        handleUseCurrentView,
        handleResetGeometry,
        getMapCenter,
    } = useMapConfiguration();

    // Fetch data
    const { data: setting, isLoading, isError } = useSetting();

    // Set initial values
    useEffect(() => {
        if (!setting) return;
        setTitle(setting.title ?? "");
        setDescription(setting.description ?? "");
        setMapCenterLat(String(setting.map_center_lat ?? ""));
        setMapCenterLng(String(setting.map_center_lng ?? ""));
        setMapZoom(Number(setting.map_zoom ?? DEFAULT_ZOOM));

        const vb = setting.village_boundary;
        try {
            if (typeof vb === "string") {
                setGeometry(vb);
            } else if (vb && typeof vb === "object") {
                setGeometry(JSON.stringify(vb, null, 2));
            } else {
                setGeometry("");
            }
        } catch {
            setGeometry(String(vb ?? ""));
        }
    }, [setting]);

    // Validation
    const validateClient = () => {
        if (!geometry.trim()) return true;
        if (safeParseJSON(geometry) === null) {
            setClientError("Geometry harus berupa JSON yang valid.");
            return false;
        }

        return true;
    };

    // Hook for update setting
    const { mutate, isPending } = useSettingUpdate();

    // Submit handler
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Clear errors
        setErrors({});

        // Clear client error
        setClientError("");

        if (!validateClient()) return;

        mutate(
            {
                title,
                description,
                map_center_lat: mapCenterLat,
                map_center_lng: mapCenterLng,
                map_zoom: mapZoom,
                village_boundary: geometry,
            },
            {
                onSuccess: () => {
                    navigate("/admin/settings");
                    toast.success("Setting updated successfully!", {
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

    const mapCenter = getMapCenter();
    const boundaryGeometry = toGeometryOrNull(geometry);

    return (
        <AppLayout>
            <div className="px-4 py-3 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                            Edit Setting
                        </h1>
                        <p className="text-sm text-slate-600 italic">
                            Form to update site & map configuration
                        </p>
                    </div>
                </div>

                {/* Loading / Error */}
                {isLoading && (
                    <div className="bg-white rounded-xl shadow p-6 text-sm text-slate-500">
                        Loading setting...
                    </div>
                )}
                {isError && !isLoading && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                        Gagal memuat data setting.
                    </div>
                )}

                {!isLoading && !isError && (
                    <div className="bg-white rounded-xl shadow">
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Title - Still like default */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Judul aplikasi / website"
                                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.title
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                />
                            </div>
                            {/* Show error message validation */}
                            {errors.Title && (
                                <div
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl relative"
                                    role="alert"
                                >
                                    <span className="block sm:inline">
                                        {errors.Title}
                                    </span>
                                </div>
                            )}

                            {/* Description - still like default */}
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
                                    placeholder="Deskripsi singkat"
                                    rows={3}
                                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.description
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                />
                            </div>

                            {/* Show error message validation */}
                            {errors.Description && (
                                <div
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl relative"
                                    role="alert"
                                >
                                    <span className="block sm:inline">
                                        {errors.Description}
                                    </span>
                                </div>
                            )}

                            {/* Map Center - still like default */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label
                                        htmlFor="map_center_lat"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Map Center Lat
                                    </label>
                                    <input
                                        type="number"
                                        id="map_center_lat"
                                        step="any"
                                        value={mapCenterLat}
                                        onChange={(e) =>
                                            setMapCenterLat(e.target.value)
                                        }
                                        placeholder="-7.59167"
                                        className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.map_center_lat
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {/* Show error message validation */}
                                    {errors.MapCenterLat && (
                                        <div
                                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl relative"
                                            role="alert"
                                        >
                                            <span className="block sm:inline">
                                                {errors.MapCenterLat}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="map_center_lng"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Map Center Lng
                                    </label>
                                    <input
                                        type="number"
                                        id="map_center_lng"
                                        step="any"
                                        value={mapCenterLng}
                                        onChange={(e) =>
                                            setMapCenterLng(e.target.value)
                                        }
                                        placeholder="112.25833"
                                        className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.map_center_lng
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {/* Show error message validation */}
                                    {errors.MapCenterLng && (
                                        <div
                                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl relative"
                                            role="alert"
                                        >
                                            <span className="block sm:inline">
                                                {errors.MapCenterLng}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="map_zoom"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Map Zoom
                                    </label>
                                    <input
                                        type="number"
                                        id="map_zoom"
                                        min={0}
                                        max={22}
                                        value={mapZoom}
                                        onChange={(e) =>
                                            setMapZoom(Number(e.target.value))
                                        }
                                        placeholder="17"
                                        className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.map_zoom
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {/* Show error message validation */}
                                    {errors.MapZoom && (
                                        <div
                                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl relative"
                                            role="alert"
                                        >
                                            <span className="block sm:inline">
                                                {errors.MapZoom}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Map + Boundary tools - use new component */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
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
                                        Reset Boundary
                                    </button>
                                </div>

                                <MapWithGeometryEditor
                                    center={mapCenter}
                                    zoom={mapZoom}
                                    geometry={boundaryGeometry}
                                    featureType="Polygon"
                                    allowMulti={false}
                                    autoFit="never"
                                    onGeometryChange={(geometry) => {
                                        if (!geometry) {
                                            setGeometry("");
                                        } else {
                                            setGeometry(
                                                JSON.stringify(geometry)
                                            );
                                        }
                                    }}
                                    mapRef={mapRef}
                                />

                                {/* Error JSON client */}
                                {clientError && (
                                    <p className="text-xs text-red-600">
                                        {clientError}
                                    </p>
                                )}
                            </div>
                            {/* Show error message validation */}
                            {errors.VillageBoundary && (
                                <div
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl relative"
                                    role="alert"
                                >
                                    <span className="block sm:inline">
                                        {errors.VillageBoundary}
                                    </span>
                                </div>
                            )}

                            {/* Form Actions - still like default */}
                            <div className="flex justify-start">
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
                )}
            </div>
        </AppLayout>
    );
};

export default Settings;
