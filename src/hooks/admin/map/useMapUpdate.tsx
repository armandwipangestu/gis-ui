import { useMutation } from "@tanstack/react-query";
import Api from "../../../services/api";
import type { MapUpdateRequest } from "../../../types/map";
import Cookies from "js-cookie";

// Hook for update map
export const useMapUpdate = () => {
    return useMutation({
        // Mutation function for update map
        mutationFn: async (data: MapUpdateRequest) => {
            // Get token from cookies
            const token = Cookies.get("token");

            // Create FormData
            const formData = new FormData();

            // Image optional, only send if new file exist
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

            // Send request update to API
            const response = await Api.put(
                `/api/admin/maps/${data.id}`,
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
