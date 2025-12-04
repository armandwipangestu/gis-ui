// Import React
import React from "react";

// Import component layout
import AppLayout from "../../../layouts/AppLayout";

// import Link from react-router (based on setup project)
import { Link } from "react-router";

// import icons
import {
    SquareArrowOutUpRight,
    Plus,
    Settings2,
    Users,
    Layers,
    CheckCircle2,
    PauseCircle,
    FolderOpen,
    AlertCircle,
} from "lucide-react";

// import hook useDashboard
import { useDashboard } from "../../../hooks/admin/dashboard/useDashboard";

const StatSkeleton: React.FC = () => (
    <div className="rounded-2xl border border-slate-300/70 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
        <div className="h-3 w-28 bg-slate-200 rounded" />
        <div className="mt-3 h-7 w-20 bg-slate-200 rounded" />
    </div>
);

const Dashboard: React.FC = () => {
    // Set page title
    document.title = "Dashboard - GIS Desa Santri";

    // Data dashboard
    const { data, isLoading, isError } = useDashboard();

    // `??` nullish coealescing to make render not error when data still loading
    const categoriesCount = data?.categories_count ?? 0;
    const mapsCount = data?.maps_count ?? 0;
    const activeMapsCount = data?.active_maps_count ?? 0;
    const inactiveMapsCount = data?.inactive_maps_count ?? 0;

    const activePct =
        mapsCount > 0 ? Math.round((activeMapsCount / mapsCount) * 100) : 0;

    return (
        <AppLayout>
            <div className="px-4 py-3 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                Dashboard
                            </h2>
                            <p className="text-[13px] text-slate-700">
                                Ringkasan cepat aktivitas dan data GIS Desa.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                to="/"
                                target="_blank"
                                className="inline-flex items-center rounded-xl px-4 sm:px-5 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
                            >
                                Buka Maps
                                <SquareArrowOutUpRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Error state */}
                {isError && (
                    <div className="mb-6 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-rose-800 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 mt-0.5" />
                        <div>
                            <p className="font-semibold">
                                Gagal memuat data dashboard
                            </p>
                            <p className="text-sm opacity-90">
                                Silakan muat ulang halaman ini beberapa saat
                                lagi.
                            </p>
                        </div>
                    </div>
                )}

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {isLoading ? (
                        <>
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                            <StatSkeleton />
                        </>
                    ) : (
                        <>
                            {/* Total Category */}
                            <div className="rounded-2xl border border-slate-300/70 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-[12px] font-medium text-slate-700">
                                            Total Kategori
                                        </div>
                                        <div className="mt-2 text-3xl leading-none font-extrabold text-slate-900 tracking-tight">
                                            {categoriesCount}
                                        </div>
                                    </div>
                                    <div className="shrink-0 rounded-xl bg-indigo-100 text-indigo-700 p-2.5">
                                        <FolderOpen className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Total Layer Maps */}
                            <div className="rounded-2xl border border-slate-300/70 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-[12px] font-medium text-slate-700">
                                            Total Layer Maps
                                        </div>
                                        <div className="mt-2 text-3xl leading-none font-extrabold text-slate-900 tracking-tight">
                                            {mapsCount}
                                        </div>
                                    </div>
                                    <div className="shrink-0 rounded-xl bg-blue-100 text-blue-700 p-2.5">
                                        <Layers className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Maps Aktif */}
                            <div className="rounded-2xl border border-slate-300/70 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
                                <div className="flex items-center justify-between">
                                    <div className="w-full">
                                        <div className="text-[12px] font-medium text-slate-700">
                                            Maps Aktif
                                        </div>
                                        <div className="mt-2 text-3xl leading-none font-extrabold text-slate-900 tracking-tight">
                                            {activeMapsCount}
                                        </div>
                                        {/* tiny progress */}
                                        <div className="mt-4">
                                            <div className="h-2 w-full rounded-full bg-slate-100">
                                                <div
                                                    className="h-2 rounded-full bg-emerald-600 transition-[width] duration-500"
                                                    style={{
                                                        width: `${activePct}%`,
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-1.5 text-[12px] text-slate-700">
                                                {activePct}% dari total maps
                                            </div>
                                        </div>
                                    </div>
                                    <div className="shrink-0 rounded-xl bg-emerald-100 text-emerald-700 p-2.5 ml-4">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Maps Inactive */}
                            <div className="rounded-2xl border border-slate-300/70 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-[12px] font-medium text-slate-700">
                                            Maps Tidak Aktif
                                        </div>
                                        <div className="mt-2 text-3xl leading-none font-extrabold text-slate-900 tracking-tight">
                                            {inactiveMapsCount}
                                        </div>
                                    </div>
                                    <div className="shrink-0 rounded-xl bg-amber-100 text-amber-700 p-2.5">
                                        <PauseCircle className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT: Quick actions */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-2xl border border-slate-300/70 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Quick Actions
                                </h3>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                    Shortcut
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    to="/admin/maps/create"
                                    className="group inline-flex items-center justify-start rounded-xl border border-slate-300/70 px-3 py-2 text-[13px] font-semibold text-slate-800 hover:bg-slate-50 transition"
                                >
                                    <span className="mr-2 grid place-items-center rounded-lg bg-blue-50 text-blue-700 p-1.5 group-hover:bg-blue-100">
                                        <Plus className="h-4 w-4" />
                                    </span>
                                    Add Maps
                                </Link>

                                <Link
                                    to="/admin/categories/create"
                                    className="group inline-flex items-center justify-start rounded-xl border border-slate-300/70 px-3 py-2 text-[13px] font-semibold text-slate-800 hover:bg-slate-50 transition"
                                >
                                    <span className="mr-2 grid place-items-center rounded-lg bg-indigo-50 text-indigo-700 p-1.5 group-hover:bg-indigo-100">
                                        <Plus className="h-4 w-4" />
                                    </span>
                                    Add Category
                                </Link>

                                <Link
                                    to="/admin/users"
                                    className="group inline-flex items-center justify-start rounded-xl border border-slate-300/70 px-3 py-2 text-[13px] font-semibold text-slate-800 hover:bg-slate-50 transition"
                                >
                                    <span className="mr-2 grid place-items-center rounded-lg bg-slate-100 text-slate-800 p-1.5 group-hover:bg-slate-200">
                                        <Users className="h-4 w-4" />
                                    </span>
                                    Manage Users
                                </Link>

                                <Link
                                    to="/admin/settings"
                                    className="group inline-flex items-center justify-start rounded-xl border border-slate-300/70 px-3 py-2 text-[13px] font-semibold text-slate-800 hover:bg-slate-50 transition"
                                >
                                    <span className="mr-2 grid place-items-center rounded-lg bg-emerald-50 text-emerald-700 p-1.5 group-hover:bg-emerald-100">
                                        <Settings2 className="h-4 w-4" />
                                    </span>
                                    Settings
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-2xl border border-slate-300/70 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Sekilas Ringkasan
                                    </h3>
                                    <p className="text-[13px] text-slate-800 mt-1">
                                        {isLoading
                                            ? "Menghitung statistik…"
                                            : `Ada ${mapsCount} layer peta; ${activeMapsCount} aktif (${activePct}%).`}
                                    </p>
                                </div>
                                <div className="hidden sm:block rounded-xl bg-slate-50 p-3 border border-slate-200">
                                    <Layers className="h-6 w-6 text-slate-800" />
                                </div>
                            </div>

                            {/* Inline badges */}
                            {!isLoading && (
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 px-2.5 py-1 text-xs font-semibold border border-emerald-200">
                                        Aktif: {activeMapsCount}
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-800 px-2.5 py-1 text-xs font-semibold border border-amber-200">
                                        Nonaktif: {inactiveMapsCount}
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-slate-50 text-slate-800 px-2.5 py-1 text-xs font-semibold border border-slate-200">
                                        Kategori: {categoriesCount}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* CTA to register maps */}
                        <div className="rounded-2xl border border-slate-300/70 bg-white p-4 flex items-center justify-between shadow-[0_1px_0_rgba(15,23,42,0.04)]">
                            <div>
                                <p className="text-[13px] text-slate-700">
                                    Kelola data peta
                                </p>
                                <h4 className="text-base font-bold text-slate-900">
                                    Lihat semua layer maps
                                </h4>
                            </div>
                            <Link
                                to="/admin/maps"
                                className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
                            >
                                Buka Daftar
                                <SquareArrowOutUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
