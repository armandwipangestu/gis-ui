import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import hasAnyPermission from "../../../utils/permissions";
import AppLayout from "../../../layouts/AppLayout";
import { useRoles } from "../../../hooks/admin/role/useRoles";
import TableEmptyRow from "../../../components/General/TableEmptyRow";
import Pagination from "../../../components/General/Pagination";
import Loading from "../../../components/General/Loading";
import Error from "../../../components/General/Error";

// Import hook for delete role
import { useRoleDelete } from "../../../hooks/admin/role/useRoleDelete";

// Import query client TanStack Query
import { useQueryClient } from "@tanstack/react-query";

// Import toast dari react-hot-toast for notification
import toast from "react-hot-toast";

const Roles: React.FC = () => {
    // Change title page
    document.title = "Roles - GIS Desa Santri";

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

    // Get data roles from hook
    const { data, isLoading, isError } = useRoles({
        page,
        search: submittedSearch,
    });

    // Update query string from url when search or page changed
    useEffect(() => {
        const params: Record<string, string> = {};
        if (submittedSearch) params.search = submittedSearch;
        if (page > 1) params.page = String(page);

        setSearchParams(params);
    }, [submittedSearch, page]);

    // Initialize useQueryClient
    const queryClient = useQueryClient();

    // Use hook useRoleDelete to delete role
    const { mutate, isPending } = useRoleDelete();

    // Function for handle deletion role
    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this role?")) {
            mutate(id, {
                onSuccess: () => {
                    // Invalidate list roles
                    queryClient.invalidateQueries({ queryKey: ["roles"] });

                    // Reset page to 1
                    setPage(1);

                    // Notification success
                    toast.success("Role deleted successfully!", {
                        position: "top-right",
                        duration: 3000,
                    });
                },
                onError: (error: Error) => {
                    alert(`Failed to delete role: ${error.message}`);
                },
            });
        }
    };

    return (
        <AppLayout>
            <div className="px-4 py-3 sm:px-6 lg:px-8">
                {/* Header Actions */}
                <div className="mb-6 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                            Roles
                        </h1>
                        <p className="text-sm text-slate-600 italic">
                            Manage roles.
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
                            placeholder="Search roles..."
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {hasAnyPermission(["roles-create"]) && (
                            <Link
                                to="/admin/roles/create"
                                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Role
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
                                        <th className="py-3 px-4">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Permissions Count
                                        </th>
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
                                        data.data.map((role: any) => (
                                            <tr
                                                key={role.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {role.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {role.permissions?.length ||
                                                        0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {new Date(
                                                        role.created_at
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
                                                            "roles-edit",
                                                        ]) && (
                                                            <Link
                                                                to={`/admin/roles/edit/${role.id}`}
                                                                className="text-blue-500 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Pencil
                                                                    size={18}
                                                                />
                                                            </Link>
                                                        )}

                                                        {hasAnyPermission([
                                                            "roles-delete",
                                                        ]) && (
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        role.id
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
                                            colSpan={3}
                                            text="No Roles Found"
                                            subText={
                                                searchTerm
                                                    ? "Try with Other Keywords"
                                                    : "Add New Role"
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

export default Roles;
