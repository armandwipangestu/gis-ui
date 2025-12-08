import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { Permission } from "../../../types/permission";
import Cookies from "js-cookie";

// Hook usePermissionsAll with return correct type
export const usePermissionsAll = () => {
    return useQuery<Permission[], Error>({
        // Query key for caching
        queryKey: ["permissions-all"],
        // Query function
        queryFn: async () => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Send request GET to endpoint API
            const response = await Api.get("/api/admin/permissions/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return data from response API
            return response.data.data;
        },
    });
};
