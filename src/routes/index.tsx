import { Routes, Route, Navigate } from "react-router";

import { useAuthStore } from "../stores/auth";

import Login from "../views/auth/login";
import Dashboard from "../views/admin/dashboard";
import Forbidden from "../views/admin/forbidden";
import Permissions from "../views/admin/permissions";
import PermissionCreate from "../views/admin/permissions/create";
import PermissionEdit from "../views/admin/permissions/edit";
import Roles from "../views/admin/roles";
import RoleCreate from "../views/admin/roles/create";

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

            {/* Route "/admin/forbidden" */}
            <Route
                path="/admin/forbidden"
                element={
                    isAuthenticated ? (
                        <Forbidden />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />

            {/* Route "/admin/permissions" */}
            <Route
                path="/admin/permissions"
                element={
                    isAuthenticated ? (
                        <Permissions />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />

            {/* Route "/admin/permissions/create" */}
            <Route
                path="/admin/permissions/create"
                element={
                    isAuthenticated ? (
                        <PermissionCreate />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />

            {/* Route "/admin/permission/edit/:id" */}
            <Route
                path="/admin/permissions/edit/:id"
                element={
                    isAuthenticated ? (
                        <PermissionEdit />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />

            {/* Route "/admin/roles" */}
            <Route
                path="/admin/roles"
                element={
                    isAuthenticated ? (
                        <Roles />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />

            {/* Route "/admin/roles/create" */}
            <Route
                path="/admin/roles/create"
                element={
                    isAuthenticated ? (
                        <RoleCreate />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
        </Routes>
    );
}
