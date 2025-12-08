import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { PermissionUpdateRequest } from "../../../types/permission";
import Cookies from "js-cookie";

// Hook for update permission
export const usePermissionUpdate = () => {
    return useMutation({
        // Mutation function for update permission
        mutationFn: async (data: PermissionUpdateRequest) => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Send request update to API
            const response = await Api.put(
                `/api/admin/permissions/${data.id}`,
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
