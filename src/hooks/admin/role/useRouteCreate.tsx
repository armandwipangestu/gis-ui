import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { RoleCreateRequest } from "../../../types/role";
import Cookies from "js-cookie";

// Custom hook for create role
export const useRoleCreate = () => {
    return useMutation({
        // Function that send data to API
        mutationFn: async (data: RoleCreateRequest) => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Send request POST to endpoint created role
            const response = await Api.post("/api/admin/roles", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return data response
            return response.data;
        },
    });
};
