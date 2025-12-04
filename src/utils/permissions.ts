import Cookies from "js-cookie";

// Function to check if user has one of permission that requested
export default function hasAnyPermission(permissions: string[]): boolean {
    // Get all permissions from cookies
    const allPermisions = JSON.parse(
        Cookies.get("permissions") || "{}"
    ) as Record<string, boolean>; // cast object that key is string and value is boolean, ex: `{'users-index': true}`

    // Check if one of permission is available
    return permissions.some((permission) => allPermisions[permission]);
}
