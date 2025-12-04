import { useQuery } from "@tanstack/react-query";

import Api from "../../../services/api";

import type { DashboardResponse } from "../../../types/dashboard";

import Cookies from "js-cookie";

// --- Hook React Query
export const useDashboard = () => {
    return useQuery<DashboardResponse>({
        // Query key that includes parameters for proper caching
        queryKey: ["dashboard"],

        // Query function
        queryFn: async () => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Get dashboard from API
            const response = await Api.get("/api/admin/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return the entire response data
            return response.data.data;
        },
    });
};
