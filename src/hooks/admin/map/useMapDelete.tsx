import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";
import Cookies from "js-cookie";

// Hook for delete map
export const useMapDelete = () => {
    return useMutation({
        // Mutation function for delete map
        mutationFn: async (id: number) => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Send request DELETE to endpoint API
            const response = await Api.delete(`/api/admin/maps/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return response
            return response.data;
        },
    });
};
