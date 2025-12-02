import axios, { AxiosError, type AxiosResponse } from "axios";

import Cookies from "js-cookie";

// Create instance Axios
const Api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Add interceptor for response
Api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        // Skip interceptor for login
        const excludeEndpoints = ["/login"];
        const shouldSkip = excludeEndpoints.some((endpoint) =>
            error.config?.url?.includes(endpoint)
        );

        // If skip, return error
        if (shouldSkip) return Promise.reject(error);

        // If error 401, remove token, user, and permissions
        if (error.response?.status === 401) {
            // Remove token, user, and permissions
            Cookies.remove("token");
            Cookies.remove("user");
            Cookies.remove("permissions");

            // Redirect to login page
            window.location.href = "/login";
        } else if (error.response?.status === 403) {
            // Redirect to page forbidden
            window.location.href = "/admin/forbidden";
        } else {
            // If error not 401, return error
            return Promise.reject(error);
        }
    }
);

export default Api;
