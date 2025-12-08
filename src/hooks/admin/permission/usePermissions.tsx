import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { PermissionsResponse } from "../../../types/permission";
import type { Params } from "../../../types/params";
import Cookies from "js-cookie";

// Hook usePermissions with return type and parameter pagination
export const usePermissions = ({ page, search }: Params) => {
    return useQuery<PermissionsResponse, Error>({
        // query key that includes parameter page and search
        queryKey: ["permissions", page, search],

        // Function for fetch data from API
        queryFn: async () => {
            // Get token from cookie
            const token = Cookies.get("token");

            // Send request to API endpoint with pagination and search
            const response = await Api.get(
                `/api/admin/permissions?page=${page}&search=${search}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Return data permission (already in pagination format)
            return response.data.data;
        },
    });
};
