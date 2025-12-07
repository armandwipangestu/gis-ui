import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { Category } from "../../../types/category";
import Cookies from "js-cookie";

// Hook useCategoriesAll with return correct type
export const useCategoriesAll = () => {
    return useQuery<Category[], Error>({
        // Query key for caching
        queryKey: ["categories-all"],

        // Query function
        queryFn: async () => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Get categories from API
            const response = await Api.get("/api/admin/categories/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return the entire response data (array Category[])
            return response.data.data;
        },
    });
};
