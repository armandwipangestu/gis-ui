import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { Setting } from "../../../types/setting";
import Cookies from "js-cookie";

// Hook useSetting for take data setting
export const useSetting = () => {
    return useQuery<Setting, Error>({
        // Query key for caching
        queryKey: ["setting"],

        // Query function
        queryFn: async () => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Request data setting for API (endpoint admin, need token)
            const response = await Api.get(`/api/admin/settings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return data setting
            return response.data.data as Setting;
        },
    });
};
