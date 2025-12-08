import React, { useState, type FormEvent } from "react";
import { SaveAll, MoveLeft } from "lucide-react";
import AppLayout from "../../../layouts/AppLayout";
import { useNavigate } from "react-router";
import { usePermissionCreate } from "../../../hooks/admin/permission/usePermissionCreate";
import { toast } from "react-hot-toast";

// Interface for validation error
interface ValidationErrors {
    [key: string]: string;
}

const PermissionCreate: React.FC = () => {
    // Change title page
    document.title = "Create Permission - GIS Desa Santri";

    // Hook useNavigate
    const navigate = useNavigate();

    // State for store data permission
    const [name, setName] = useState<string>("");

    // State for store error validation
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Initialize hook usePermissionCreate
    const { mutate, isPending } = usePermissionCreate();

    // Function for handle submit form
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        mutate(
            {
                name: name,
            },
            {
                onSuccess: () => {
                    // Redirect to permissions page after success
                    navigate("/admin/permissions");

                    // Notify success
                    toast.success("Permission created successfully!", {
                        position: "top-right",
                        duration: 3000,
                    });
                },
                onError: (error: any) => {
                    // Save error validation if exist
                    setErrors(error.response?.data?.errors || {});
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
                            Create Permission
                        </h1>
                        <p className="text-sm text-slate-600 italic">
                            Form to create new permission
                        </p>
                    </div>
                </div>

                {/* Form for create permission */}
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

                        {/* Show error message validation */}
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

                        <div className="flex justify-start">
                            {/* Back Button */}
                            <button
                                type="button"
                                className="px-4 py-2 flex items-center bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 mr-2"
                                onClick={() => window.history.back()}
                            >
                                <MoveLeft className="mr-2" size={18} />
                                Cancel
                            </button>

                            {/* Save Button */}
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

export default PermissionCreate;
