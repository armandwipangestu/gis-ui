import React, { useState, type FormEvent } from "react";
import { SaveAll, MoveLeft } from "lucide-react";
import AppLayout from "../../../layouts/AppLayout";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useCategoryCreate } from "../../../hooks/admin/category/useCategoryCreate";

// Interface for validation errors
interface ValidationErrors {
    [key: string]: string;
}

const CategoryCreate: React.FC = () => {
    // Change title page
    document.title = "Create Category - GIS Desa Santri";

    // Hook useNavigate
    const navigate = useNavigate();

    // State for store data category
    const [image, setImage] = useState<File | null>(null);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [color, setColor] = useState<string>("");

    // State for store error validation
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Initialize useCategoryCreate hook
    const { mutate, isPending } = useCategoryCreate();

    // Initialize for handle submit form
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        mutate(
            {
                image,
                name,
                description,
                color,
            },
            {
                onSuccess: () => {
                    // Redirect to category page after success
                    navigate("/admin/categories");

                    // Notification success
                    toast.success("Category created successfully!", {
                        position: "top-right",
                        duration: 3000,
                    });
                },
                onError: (error: any) => {
                    // Assign error to variable
                    setErrors(error.response.data.errors || {});
                },
            }
        );
    };

    return (
        <AppLayout>
            <div className="px-4 py-3 sm:px-6 lg:px-8">
                {/* Header with Add Button */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Create Category
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 italic">
                            Form to create a new category.
                        </p>
                    </div>
                </div>

                {/* Form for creating category */}
                <div className="bg-white rounded-xl shadow">
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Image */}
                        <div>
                            <label
                                htmlFor="image"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Image
                            </label>
                            <input
                                type="file"
                                id="image"
                                onChange={(e) =>
                                    setImage(e.target.files?.[0] || null)
                                }
                                placeholder="image.png"
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {errors.Image && (
                            <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl relative"
                                role="alert"
                            >
                                <span className="block sm:inline">
                                    {errors.Image}
                                </span>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="category_name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Category Name
                            </label>
                            <input
                                type="text"
                                id="category_name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter category name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
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

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Description
                            </label>
                            <textarea
                                value={description}
                                id="description"
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter category description"
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {errors.Description && (
                            <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl relative"
                                role="alert"
                            >
                                <span className="block sm:inline">
                                    {errors.Description}
                                </span>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="color"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Color
                            </label>
                            <input
                                type="color"
                                id="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-40 h-15 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {errors.Color && (
                            <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl relative"
                                role="alert"
                            >
                                <span className="block sm:inline">
                                    {errors.Color}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-star">
                            {/* Button to cancel and go back */}
                            <button
                                type="button"
                                className="px-4 py-2 flex items-center bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 mr-2"
                                onClick={() => window.history.back()}
                            >
                                <MoveLeft className="mr-2" size={18} />
                                Cancel
                            </button>
                            {/* Button to save category */}
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

export default CategoryCreate;
