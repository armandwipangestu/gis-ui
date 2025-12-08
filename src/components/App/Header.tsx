import { type FC, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
// import icon from lucide-react (icon UI for menu and button)
import {
    House,
    Folder,
    MapPlus,
    Settings2,
    Users,
    Key,
    Shield,
    User,
    LogIn,
    LogOut,
} from "lucide-react";
// import useAuthStore (Zustand store for authentication)
import { useAuthStore } from "../../stores/auth";
// import hook navigation & link from react router
import { useNavigate, Link, useLocation } from "react-router";
// import useSidebarStore (Zustand store for toggle sidebar)
import { useSidebarStore } from "../../stores/sidebar";

interface MenuPosProps {
    left: number;
    top: number;
    width: number;
}

const Header: FC = () => {
    // Get state isAuthenticated from useAuthStore
    const isAuthenticated = useAuthStore((state) => state.token !== "");

    // Get function toggle from useSidebarStore
    const toggleSidebar = useSidebarStore((s) => s.toggle);

    // State for adjust dropdown user menu
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const [menuPos, setMenuPos] = useState<MenuPosProps>({
        left: 0,
        top: 0,
        width: 192,
    });
    const btnRef = useRef<HTMLButtonElement | null>(null);

    // Count position dropdown precision at bottom button
    const updateMenuPos = () => {
        const btn = btnRef.current;
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        setMenuPos({
            left: Math.round(r.left + window.scrollX),
            top: Math.round(r.bottom + window.scrollY + 8), // +8px gap
            width: Math.max(192, Math.round(r.width)), // minimal 192px
        });
    };

    // Update position dropdown when open
    // Update the panel position immediately after the DOM layout is determined when the dropdown is opened (to prevent flickering)
    useLayoutEffect(() => {
        if (openUserMenu) updateMenuPos();
    }, [openUserMenu]);

    // Get current location from useLocation
    const location = useLocation();

    // TRUE if path location at /admin/*
    const isAdminRoute = location.pathname.startsWith("/admin/");

    // Check if path active include on some menu
    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    // desctruct logout from useAuthStore
    const { logout } = useAuthStore();

    // Initialize navigate
    const navigate = useNavigate();

    // Function logout
    const logoutHandler = async () => {
        // Call logout function
        await logout();

        // Back to login page
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <div className="px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 sm:gap-6">
                    {/* Button hamburger for toggle sidebar on mobile */}
                    {!isAdminRoute && (
                        <button
                            type="button"
                            onClick={toggleSidebar}
                            aria-label="Toggle sidebar"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 lg:hidden"
                        >
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M3 6h18M3 12h18M3 18h18" />
                            </svg>
                        </button>
                    )}

                    {/* Brand + Title */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 sm:gap-4"
                    >
                        <div className="relative flex items-center gap-3 sm:gap-4">
                            <div className="relative flex h-13 w-13 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg sm:h-12 sm:w-12">
                                <svg
                                    className="h-7 w-7 text-white sm:h-6 sm:w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <div className="hidden sm:flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                                        SIG Desa
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-xs text-slate-500 font-medium line-clamp-1">
                                        Eksplorasi Desa secara interaktif
                                        melalui peta GIS.
                                    </span>
                                </div>
                                <h1 className="text-base sm:text-2xl font-bold text-slate-900 line-clamp-1">
                                    GIS Desa Santri
                                </h1>
                            </div>
                        </div>
                    </Link>

                    {/* spacer */}
                    <div className="ml-auto flex items-center gap-3">
                        {!isAuthenticated ? (
                            <Link
                                to="/login"
                                className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                            >
                                <LogIn className="mr-2 h-5 w-5" />
                                Sign In
                            </Link>
                        ) : (
                            <button
                                onClick={logoutHandler}
                                className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                            >
                                <LogOut className="mr-2 h-5 w-5" />
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isAuthenticated && isAdminRoute && (
                <>
                    {/* === NAVBAR AT BOTTOM HEADER */}
                    <nav className="border-t border-slate-200/80 bg-white/90 relative z-50">
                        <div className="px-4 sm:px-6 lg:px-8 py-2">
                            <div className="flex items-stretch gap-1">
                                {/* All link + button dropdown is at ONE row scroll-x */}
                                <div className="flex items-stretch gap-1 overflow-x-auto overflow-y-visible no-scrollbar">
                                    <Link
                                        to="/admin/dashboard"
                                        className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                                            isActive("/admin/dashboard")
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-slate-700 "
                                        } hover:bg-blue-50 hover:text-blue-700 transition`}
                                    >
                                        <House className="mr-2 h-5 w-5" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/admin/categories"
                                        className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                                            isActive("/admin/categories")
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-slate-700 "
                                        } hover:bg-blue-50 hover:text-blue-700 transition`}
                                    >
                                        <Folder className="mr-2 h-5 w-5" />
                                        Categories
                                    </Link>
                                    <Link
                                        to="/admin/maps"
                                        className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                                            isActive("/admin/maps")
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-slate-700 "
                                        } hover:bg-blue-50 hover:text-blue-700 transition`}
                                    >
                                        <MapPlus className="mr-2 h-5 w-5" />
                                        Maps
                                    </Link>
                                    <Link
                                        to="/admin/settings"
                                        className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                                            isActive("/admin/settings")
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-slate-700 "
                                        } hover:bg-blue-50 hover:text-blue-700 transition`}
                                    >
                                        <Settings2 className="mr-2 h-5 w-5" />
                                        Settings
                                    </Link>

                                    {/* The dropdown trigger is here (aligned), the panel is ported to the body. */}
                                    <button
                                        ref={btnRef}
                                        type="button"
                                        onClick={() =>
                                            setOpenUserMenu((v) => !v)
                                        }
                                        className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold ${
                                            isActive("/admin/permissions") ||
                                            isActive("/admin/roles") ||
                                            isActive("/admin/users")
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-slate-700 "
                                        } hover:bg-blue-50 hover:text-blue-700 transition`}
                                        aria-haspopup="menu"
                                        aria-expanded={openUserMenu}
                                    >
                                        <Users className="mr-2 h-5 w-5" />
                                        Users Management
                                        <svg
                                            className={`ml-2 h-4 w-4 transition-transform ${
                                                openUserMenu ? "rotate-180" : ""
                                            }`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>
                    {/* === END NAVBAR === */}

                    {/* Portal for dropdown panels so they are not clipped by overflow */}
                    {openUserMenu &&
                        createPortal(
                            <div
                                role="menu"
                                aria-label="Users Management"
                                className="fixed z-[1000] rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5 overflow-hidden"
                                style={{
                                    left: menuPos.left,
                                    top: menuPos.top,
                                    width: menuPos.width,
                                }}
                            >
                                <Link
                                    to="/admin/permissions"
                                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                >
                                    <Key className="inline-block mr-2 h-4 w-4" />
                                    Permissions
                                </Link>
                                <Link
                                    to="/admin/roles"
                                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                >
                                    <Shield className="inline-block mr-2 h-4 w-4" />
                                    Roles
                                </Link>
                                <Link
                                    to="/admin/users"
                                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                >
                                    <User className="inline-block mr-2 h-4 w-4" />
                                    Users
                                </Link>
                            </div>,
                            document.body
                        )}
                </>
            )}
        </header>
    );
};

export default Header;
