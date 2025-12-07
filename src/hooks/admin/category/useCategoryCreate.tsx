import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { CategoryCreateRequest } from "../../../types/category";
import Cookies from "js-cookie";

// Custom hook for create category
export const useCategoryCreate = () => {
    return useMutation({
        // Mutation function for create category
        mutationFn: async (data: CategoryCreateRequest) => {
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

            // Send request POST to endpoint create category
            const response = await Api.post(`/api/admin/categories`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            // Return data response
            return response.data;
        },
    });
};
