import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import hasAnyPermission from "../../../utils/permissions";
import AppLayout from "../../../layouts/AppLayout";
import { useCategories } from "../../../hooks/admin/category/useCategories";
import TableEmptyRow from "../../../components/General/TableEmptyRow";
import Pagination from "../../../components/General/Pagination";
import Loading from "../../../components/General/Loading";
import Error from "../../../components/General/Error";
import { useCategoryDelete } from "../../../hooks/admin/category/useCategoryDelete";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Categories: React.FC = () => {
    // Change title page
    document.title = "Categories - GIS Desa Santri";

    // Get query string from URL
    const [searchParams, setSearchParams] = useSearchParams();

    // Get query 'search' and 'page' from URL
    const initialSearch = searchParams.get("search") || "";
    const initialPage = parseInt(searchParams.get("page") || "1", 10);

    // State for search and page
    const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
    const [submittedSearch, setSubmittedSearch] =
        useState<string>(initialSearch);
    const [page, setPage] = useState<number>(initialPage);

    // Get data categories from hook
    const { data, isLoading, isError } = useCategories({
        page,
        search: submittedSearch,
    });

    // Update query string from URL when search or page changed
    useEffect(() => {
        const params: Record<string, string> = {};
        if (submittedSearch) {
            params.search = submittedSearch;
        }

        if (page > 1) {
            params.page = String(page);
        }

        setSearchParams(params);
    }, [submittedSearch, page]);

    // TanStack Query client
    const queryClient = useQueryClient();

    // Hook delete category
    const { mutate, isPending } = useCategoryDelete();

    // Delete category
    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this category?")) {
            mutate(id, {
                onSuccess: () => {
                    // Refresh list
                    queryClient.invalidateQueries({ queryKey: ["categories"] });

                    // Back to page 1 (optional)
                    setPage(1);

                    // Toast success
                    toast.success("Category deleted successfully!", {
                        position: "top-right",
                        duration: 3000,
                    });
                },
                onError: (error: Error) => {
                    alert(`Failed to delete category: ${error.message}`);
                },
            });
        }
    };

    return (
        <AppLayout>
            <div className="px-4 py-3 sm:px-6 lg:px-8">
                {/* Header Actions */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                            Categories
                        </h1>
                        <p className="text-sm text-slate-600 italic">
                            Manage categories.
                        </p>
                    </div>
                </div>

                {/* Toolbar: Search + Add */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setPage(1);
                                    setSubmittedSearch(searchTerm);
                                }
                            }}
                            placeholder="Search categories..."
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {hasAnyPermission(["categories-create"]) && (
                            <Link
                                to="/admin/categories/create"
                                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Category
                            </Link>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && <Loading />}

                {/* Error State */}
                {isError && <Error />}

                {/* Success State */}
                {!isLoading && !isError && (
                    <>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-500 border-b border-slate-200">
                                        <th className="py-3 px-4">Image</th>
                                        <th className="py-3 px-4">Name</th>
                                        <th className="py-3 px-4">
                                            Created At
                                        </th>
                                        <th className="py-3 px-4 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="align-top">
                                    {data?.data && data.data.length > 0 ? (
                                        data.data.map((category: any) => (
                                            <tr
                                                key={category.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {category.image ? (
                                                        <img
                                                            src={`${
                                                                import.meta.env
                                                                    .VITE_BASE_URL
                                                            }/uploads/categories/${
                                                                category.image
                                                            }`}
                                                            alt={category.name}
                                                            className="w-20 h-14 object-cover rounded-xl p-2 bg-blue-50"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-gray-400">
                                                            N/A
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {category.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {new Date(
                                                        category.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "2-digit",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-3">
                                                        {hasAnyPermission([
                                                            "categories-edit",
                                                        ]) && (
                                                            <Link
                                                                to={`/admin/categories/edit/${category.id}`}
                                                                className="text-blue-500 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Pencil
                                                                    size={18}
                                                                />
                                                            </Link>
                                                        )}

                                                        {hasAnyPermission([
                                                            "categories-delete",
                                                        ]) && (
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        category.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    isPending
                                                                }
                                                                className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2
                                                                    size={18}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <TableEmptyRow
                                            colSpan={5}
                                            text="No Categories Found"
                                            subText={
                                                searchTerm
                                                    ? "Try with Other Keywords"
                                                    : "Add New Category"
                                            }
                                        />
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {data?.data && data.data.length > 0 && (
                            <div className="px-6 pb-5 border-t border-gray-100 bg-gray-100">
                                <Pagination
                                    currentPage={data.current_page}
                                    totalPages={data.last_page}
                                    onPageChange={(newPage) => setPage(newPage)}
                                    position="right"
                                    maxVisiblePages={5}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
};

export default Categories;
