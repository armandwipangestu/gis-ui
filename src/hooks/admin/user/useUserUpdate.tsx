import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { UserUpdateRequest } from "../../../types/user";
import Cookies from "js-cookie";

// Hook for update user
export const useUserUpdate = () => {
    return useMutation({
        // Mutation function for update user
        mutationFn: async (data: UserUpdateRequest) => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Send request update to API
            const response = await Api.put(
                `/api/admin/users/${data.id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Send data response
            return response.data;
        },
    });
};
