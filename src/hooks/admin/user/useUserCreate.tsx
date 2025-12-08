import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { UserCreateRequest } from "../../../types/user";
import Cookies from "js-cookie";

// Custom hook for create user
export const useUserCreate = () => {
    return useMutation({
        // Function to send data to API
        mutationFn: async (data: UserCreateRequest) => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Send request POST to endpoint create user
            const response = await Api.post("/api/admin/users", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return data response
            return response.data;
        },
    });
};
