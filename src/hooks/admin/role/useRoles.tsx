import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { RolesResponse } from "../../../types/role";
import type { Params } from "../../../types/params";
import Cookies from "js-cookie";

// Hook useRoles with support pagination
export const useRoles = ({ page, search }: Params) => {
    return useQuery<RolesResponse, Error>({
        // Query key that includes parameter page and search
        queryKey: ["roles", page, search],

        // Function for get data from API
        queryFn: async () => {
            // Get token from cookie
            const token = Cookies.get("token");

            // Send request to API endpoint with pagination and search
            const response = await Api.get(
                `/api/admin/roles?page=${page}&search=${search}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Return data role (already paginate format)
            return response.data.data;
        },
    });
};
