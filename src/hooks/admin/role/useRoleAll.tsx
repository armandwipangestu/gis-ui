import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { Role } from "../../../types/role";
import Cookies from "js-cookie";

// Hook useRolesAll with return correct type
export const useRolesAll = () => {
    return useQuery<Role[], Error>({
        // Query key for caching
        queryKey: ["roles-all"],

        // Query function
        queryFn: async () => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Send request GET to endpoint API
            const response = await Api.get("/api/admin/roles/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return data from response API
            return response.data.data;
        },
    });
};
