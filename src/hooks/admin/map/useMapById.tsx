import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { Map } from "../../../types/map";
import Cookies from "js-cookie";

// Hook useMapById with parameter id and return type Map
export const useMapById = (id: number) => {
    return useQuery<Map, Error>({
        // Query key, based on with ID map for caching
        queryKey: ["map", id],

        // Query function
        queryFn: async () => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Request data map based on ID from API
            const response = await Api.get(`/api/admin/maps/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return data map
            return response.data.data as Map;
        },
    });
};
