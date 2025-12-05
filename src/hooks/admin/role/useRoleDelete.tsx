import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";
import Cookies from "js-cookie";

// Hook for delete role
export const useRoleDelete = () => {
    return useMutation({
        // Mutation function for delete role
        mutationFn: async (id: number) => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Send request DELETE to endpoint API
            const response = await Api.delete(`/api/admin/roles/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return response
            return response.data;
        },
    });
};
