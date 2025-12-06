import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { UsersResponse } from "../../../types/user";
import type { Params } from "../../../types/params";
import Cookies from "js-cookie";

// Hook useUsers with support pagination
export const useUsers = ({ page, search }: Params) => {
    return useQuery<UsersResponse, Error>({
        // Query key that includes parameter page and search
        queryKey: ["users", page, search],

        // Function for take data from API
        queryFn: async () => {
            // Get token from cookie
            const token = Cookies.get("token");

            // Send request to API endpoint with pagination and search
            const response = await Api.get(
                `/api/admin/users?page=${page}&search=${search}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Return data user (already in pagination format)
            return response.data.data;
        },
    });
};
