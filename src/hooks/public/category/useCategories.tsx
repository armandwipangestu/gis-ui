import { useQuery } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { Category } from "../../../types/category";

// Hook useCategories with return correct type
export const useCategories = () => {
    return useQuery<Category[], Error>({
        // Query key for caching
        queryKey: ["public-categories"],

        // Query function
        queryFn: async () => {
            // Get response from API (public endpoint, without token)
            const response = await Api.get(`/api/public/categories`);

            // Return entire response data (array Category[])
            return response.data.data;
        },
    });
};
