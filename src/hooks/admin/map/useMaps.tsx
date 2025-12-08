import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { MapsResponse } from "../../../types/map";
import type { Params } from "../../../types/params";
import Cookies from "js-cookie";

// Hook useMaps with return correct type
export const useMaps = ({ page, search }: Params) => {
    return useQuery<MapsResponse, Error>({
        // Query key that includes parameter for correct caching
        queryKey: ["maps", page, search],

        // Query function
        queryFn: async () => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Get categories from API
            const response = await Api.get(
                `/api/admin/maps?page=${page}&search=${search}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Return the entire response data (not just data.data)
            return response.data.data;
        },
    });
};
