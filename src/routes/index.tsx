import { Routes, Route, Navigate } from "react-router";

import { useAuthStore } from "../stores/auth";

import Login from "../views/auth/login";
import Dashboard from "../views/admin/dashboard";

export default function AppRoutes() {
    // Get state isAuthenticated from useAuthStore
    const isAuthenticated = useAuthStore((state) => state.token !== "");

    return (
        <Routes>
            {/* Route "/login" */}
            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        <Navigate to="/admin/dashboard" replace />
                    ) : (
                        <Login />
                    )
                }
            />

            {/* Route "/admin/dashboard" */}
            <Route
                path="/admin/dashboard"
                element={
                    isAuthenticated ? (
                        <Dashboard />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
        </Routes>
    );
}
