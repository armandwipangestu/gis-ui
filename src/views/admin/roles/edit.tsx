import React, { useEffect, useState, type FormEvent } from "react";
import { SaveAll, MoveLeft } from "lucide-react";
import AppLayout from "../../../layouts/AppLayout";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";

// Import hooks useRoleById, useRoleUpdate, usePermissionsAll
import { useRoleById } from "../../../hooks/admin/role/useRoleById";
import { useRoleUpdate } from "../../../hooks/admin/role/useRoleUpdate";
import { usePermissionsAll } from "../../../hooks/admin/permission/usePermissionsAll";

// Interface for error validation
interface ValidationErrors {
    [key: string]: string;
}

const RoleEdit: React.FC = () => {
    // Change title page
    document.title = "Edit Role - GIS Desa Santri";

    // Navigate hook
    const navigate = useNavigate();

    // Get id from parameter URL
    const { id } = useParams();
    const roleId = Number(id);

    // State for form
    const [name, setName] = useState("");
    const [permissionIds, setPermissionIds] = useState<number[]>([]);
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Fetch role defail by id
    const { data: role } = useRoleById(roleId);

    // Fetch all permissions
    const { data: permissions } = usePermissionsAll();

    // Mutation update role
    const { mutate, isPending } = useRoleUpdate();

    // Group permissions by prefix
    const groupedPermissions = permissions?.reduce((groups, permission) => {
        const [group] = permission.name.split("-");
        if (!groups[group]) groups[group] = [];
        groups[group].push(permission);

        return groups;
    }, {} as Record<string, typeof permissions>);

    // Populate state from fetched role
    useEffect(() => {
        if (role) {
            setName(role.name);
            setPermissionIds((role.permissions ?? []).map((p) => p.id));
        }
    }, [role]);

    // Handle checkbox toggle
    const handleCheckboxChange = (id: number) => {
        setPermissionIds((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    // Handle form submit
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        mutate(
            {
                id: roleId,
                name,
                permission_ids: permissionIds,
            },
            {
                onSuccess: () => {
                    toast.success("Role updated successfully!", {
                        position: "top-right",
                    });
                    navigate("/admin/roles");
                },
                onError: (error: any) => {
                    setErrors(error.response?.data?.errors || {});
                },
            }
        );
    };

    return (
        <AppLayout>
            <div className="px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Edit Role
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 italic">
                            Update the selected role.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Role Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter role name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.Name && (
                                <div
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl relative"
                                    role="alert"
                                >
                                    <span className="block sm:inline">
                                        {errors.Name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Permissions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Permissions
                            </label>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {groupedPermissions &&
                                        Object.entries(groupedPermissions).map(
                                            ([group, perms]) => (
                                                <div
                                                    key={group}
                                                    className="bg-gray-100 p-4 border border-gray-100 shadow-sm rounded-2xl"
                                                >
                                                    <h2 className="font-semibold text-lg mb-2 capitalize border-b border-gray-300 py-2 pt-0">
                                                        {group}
                                                    </h2>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {perms.map((perm) => (
                                                            <label
                                                                key={perm.id}
                                                                className="flex items-center space-x-2"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    value={
                                                                        perm.id
                                                                    }
                                                                    checked={permissionIds.includes(
                                                                        perm.id
                                                                    )}
                                                                    onChange={() =>
                                                                        handleCheckboxChange(
                                                                            perm.id
                                                                        )
                                                                    }
                                                                />
                                                                <span>
                                                                    {perm.name}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                </div>
                            </div>
                            {errors.permission_ids && (
                                <p className="text-sm text-red-600 mt-2">
                                    {errors.permission_ids}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-start">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-4 py-2 flex items-center bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 mr-2"
                            >
                                <MoveLeft className="mr-2" size={18} />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-4 py-2 flex items-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                            >
                                <SaveAll className="mr-2" size={18} />
                                {isPending ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default RoleEdit;
