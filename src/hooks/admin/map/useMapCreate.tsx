import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { MapCreateRequest } from "../../../types/map";
import Cookies from "js-cookie";

// Custom hook for create map
export const useMapCreate = () => {
    return useMutation({
        // Mutation function for create map
        mutationFn: async (data: MapCreateRequest) => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Create FormData
            const formData = new FormData();

            // File image (optional)
            if (data.image) {
                formData.append("image", data.image as File);
            }

            // Required field
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("address", data.address);
            formData.append("latitude", data.latitude); // send string according to backend
            formData.append("longitude", data.longitude); // send string according to backend
            formData.append("category_id", String(data.category_id));

            // Field optional
            if (data.geometry) {
                // Send as JSON string (according to my type)
                formData.append("geometry", data.geometry);
            }

            if (data.status) {
                formData.append("status", data.status); // 'active' | 'inactive'
            }

            // Send request POST to endpoint create map
            const response = await Api.post("/api/admin/maps", formData, {
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
