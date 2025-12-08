import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { Permission } from "../../../types/permission";
import Cookies from "js-cookie";

// Hook usePermissionById with parameter id and return type Permission
export const usePermissionById = (id: number) => {
    return useQuery<Permission, Error>({
        // Query key, adjust with ID permission for caching
        queryKey: ["permission", id],

        // Query function
        queryFn: async () => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Get permission based on id from API
            const response = await Api.get(`/api/admin/permissions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return data
            return response.data.data as Permission;
        },
    });
};
