import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { CategoryUpdateRequest } from "../../../types/category";
import Cookies from "js-cookie";

// Hook for update category
export const useCategoryUpdate = () => {
    return useMutation({
        // Mutation function for update category
        mutationFn: async (data: CategoryUpdateRequest) => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Create FormData
            const formData = new FormData();
            if (data.image) {
                formData.append("image", data.image as File);
            }
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("color", data.color);

            // Send request update to API
            const response = await Api.put(
                `/api/admin/categories/${data.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // Return data response
            return response.data;
        },
    });
};
