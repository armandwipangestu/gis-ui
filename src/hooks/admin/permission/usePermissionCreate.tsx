import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { PermissionCreateRequest } from "../../../types/permission";
import Cookies from "js-cookie";

export const usePermissionCreate = () => {
    return useMutation({
        // mutation for create permission
        mutationFn: async (data: PermissionCreateRequest) => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Send request for create new permission
            const response = await Api.post("/api/admin/permissions", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return response data
            return response.data;
        },
    });
};
