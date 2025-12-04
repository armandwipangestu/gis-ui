import { Routes, Route, Navigate } from "react-router";

import { useAuthStore } from "../stores/auth";

import Login from "../views/auth/login";

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
        </Routes>
    );
}
