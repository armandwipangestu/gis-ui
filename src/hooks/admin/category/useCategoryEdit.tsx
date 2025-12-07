import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { Category } from "../../../types/category";
import Cookies from "js-cookie";

// Hook useCategoryById with parameter id and return type category
export const useCategoryById = (id: number) => {
    return useQuery<Category, Error>({
        // Query key, adjust with id category for caching
        queryKey: ["category", id],

        // Query Function
        queryFn: async () => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Request data category based on id from API
            const response = await Api.get(`/api/admin/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return data category
            return response.data.data as Category;
        },
    });
};
