import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { RoleUpdateRequest } from "../../../types/role";
import Cookies from "js-cookie";

// Hook for update role
export const useRoleUpdate = () => {
    return useMutation({
        // Mutation function for update role
        mutationFn: async (data: RoleUpdateRequest) => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Send request update to API
            const response = await Api.put(
                `/api/admin/roles/${data.id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Return data response
            return response.data;
        },
    });
};
