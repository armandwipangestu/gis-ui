import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { CategoriesResponse } from "../../../types/category";
import type { Params } from "../../../types/params";
import Cookies from "js-cookie";

// Hook useCategories with return correct type
export const useCategories = ({ page, search }: Params) => {
    return useQuery<CategoriesResponse, Error>({
        // Query key that includes parameter for correct caching
        queryKey: ["categories", page, search],

        // Query function
        queryFn: async () => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Get categories from API
            const response = await Api.get(
                `/api/admin/categories?page=${page}&search=${search}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Return the entire response data (not just data.data)
            return response.data.data;
        },
    });
};
