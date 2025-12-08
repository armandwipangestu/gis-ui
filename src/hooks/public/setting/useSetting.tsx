import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { Setting } from "../../../types/setting";

// Hook useSetting for get data setting
export const useSetting = () => {
    return useQuery<Setting, Error>({
        // Query key for caching
        queryKey: ["public-setting"],

        // Query function
        queryFn: async () => {
            // Request data setting public from API (without token)
            const response = await Api.get(`/api/public/settings`);

            // Return data setting
            return response.data.data as Setting;
        },
    });
};
