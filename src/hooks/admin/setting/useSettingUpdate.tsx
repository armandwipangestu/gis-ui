import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { SettingUpdateRequest } from "../../../types/setting";
import Cookies from "js-cookie";

// Hook for update setting
export const useSettingUpdate = () => {
    return useMutation({
        // Mutation function for update permission
        mutationFn: async (data: SettingUpdateRequest) => {
            // Get token for cookies
            const token = Cookies.get("token");

            // Send request update to API
            const response = await Api.put(`/api/admin/settings`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return data response
            return response.data;
        },
    });
};
