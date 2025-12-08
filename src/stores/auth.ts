import { create } from "zustand";

import Api from "../services/api";

import type { AuthState, LoginResponse, Permissions } from "../types/auth";

import Cookies from "js-cookie";

export const useAuthStore = create<AuthState>((set) => ({
    // Initialize state user, token, and permissions from cookies
    user: Cookies.get("user")
        ? JSON.parse(Cookies.get("user") as string)
        : null,
    token: Cookies.get("token") || "",
    permissions: Cookies.get("permissions")
        ? JSON.parse(Cookies.get("permissions") as string)
        : {},
    // Function for login
    login: async (credentials) => {
        // Fetch data from API
        const response = await Api.post<LoginResponse>(
            "/api/login",
            credentials
        );
        const { data } = response.data;

        // Assign data to user, token, and permisions
        const user = {
            id: data.id,
            name: data.name,
            username: data.username,
            email: data.email,
            created_at: data.created_at,
            updated_at: data.updated_at,
        };

        // assign data to token and permissions
        const token: string = data.token;
        const permissions: Permissions = data.permissions || {};

        // Set state
        set({ user, token, permissions });

        // Save to cookies
        Cookies.set("user", JSON.stringify(user));
        Cookies.set("token", token);
        Cookies.set("permissions", JSON.stringify(permissions));
    },
    // Function for logout
    logout: () => {
        // Set state to null and empty token and permissions
        set({ user: null, token: "", permissions: {} });

        // Delete cookies
        Cookies.remove("user");
        Cookies.remove("token");
        Cookies.remove("permissions");
    },
}));
