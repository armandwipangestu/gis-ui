import React, { useEffect, useState, type FormEvent } from "react";
import { SaveAll, MoveLeft } from "lucide-react";
import AppLayout from "../../../layouts/AppLayout";
import { useNavigate, useParams } from "react-router";

// Hook TanStack Query
import { usePermissionById } from "../../../hooks/admin/permission/usePermissionById";
import { usePermissionUpdate } from "../../../hooks/admin/permission/usePermissionUpdate";

import { toast } from "react-hot-toast";

// Interface for error validation
interface ValidationErrors {
    [key: string]: string;
}

const PermissionEdit: React.FC = () => {
    // Change title page
    document.title = "Edit Permission - GIS Desa Santri";

    // Hook navigate
    const navigate = useNavigate();

    // Get params id
    const { id } = useParams();

    // State form
    const [name, setName] = useState<string>("");

    // State error validation
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Fetch detail permission
    const {
        data: permission,
        isLoading,
        isError,
    } = usePermissionById(Number(id));

    // Fill field form if data permission already exist
    useEffect(() => {
        if (permission) {
            setName(permission.name);
        }
    }, [permission]);

    // Initialize hook update
    const { mutate, isPending } = usePermissionUpdate();

    // Submit handler
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        mutate(
            {
                id: Number(id),
                name: name,
            },
            {
                onSuccess: () => {
                    // Redirect to index page
                    navigate("/admin/permissions");

                    // Notify success
                    toast.success("Permission updated successfully!", {
                        position: "top-right",
                        duration: 3000,
                    });
                },
                onError: (error: any) => {
                    // Save error validation
                    setErrors(error?.response?.data?.errors || {});
                },
            }
        );
    };

    return (
        <AppLayout>
            <div className="px-4 py-3 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                            Edit Permission
                        </h1>
                        <p className="text-sm text-slate-600 italic">
                            Form to update existing permission
                        </p>
                    </div>
                </div>

                {/* Loading / Error state simple */}
                {isLoading && (
                    <div className="bg-white rounded-xl shadow p-6 text-sm text-slate-500">
                        Loading permission...
                    </div>
                )}

                {isError && !isLoading && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                        Gagal memuat data permission.
                    </div>
                )}

                {!isLoading && !isError && (
                    <div className="bg-white rounded-xl shadow">
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Permission Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter permission name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Error message validation (Laravel usually key 'name'; but previously I use 'Name', so follow the previous to make sure safe) */}
                            {(errors.name || errors.Name) && (
                                <div
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl relative"
                                    role="alert"
                                >
                                    <span className="block sm:inline">
                                        {errors.name || errors.Name}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-start">
                                {/* Back button */}
                                <button
                                    type="button"
                                    className="px-4 py-2 flex items-center bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 mr-2"
                                    onClick={() => window.history.back()}
                                >
                                    <MoveLeft className="mr-2" size={18} />
                                    Cancel
                                </button>

                                {/* Save button */}
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="px-4 py-2 flex items-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <SaveAll className="mr-2" size={18} />
                                    {isPending ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default PermissionEdit;
