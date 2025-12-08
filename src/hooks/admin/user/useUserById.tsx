import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { User } from "../../../types/user";
import Cookies from "js-cookie";

// Hook useUserById for take data user based on id
export const useUserById = (id: number) => {
    return useQuery<User, Error>({
        // Query key for caching based on id
        queryKey: ["user", id],

        // Query function
        queryFn: async () => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Request data user based on id from API
            const response = await Api.get(`/api/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return data user, includes relationship roles
            return response.data.data as User;
        },
    });
};
