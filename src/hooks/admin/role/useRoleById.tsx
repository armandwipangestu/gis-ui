import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { Role } from "../../../types/role";
import Cookies from "js-cookie";

// Hook useRoleById for get data role based on id
export const useRoleById = (id: number) => {
    return useQuery<Role, Error>({
        // Query key for caching based on id
        queryKey: ["role", id],

        // Query function
        queryFn: async () => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Request data role based on id from API
            const response = await Api.get(`/api/admin/roles/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return data role, includes the relationship permissions
            return response.data.data as Role;
        },
    });
};
