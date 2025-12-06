import React, { useEffect, useState, type FormEvent } from "react";
import { SaveAll, MoveLeft } from "lucide-react";
import AppLayout from "../../../layouts/AppLayout";
import { useNavigate, useParams } from "react-router";
import { useUserById } from "../../../hooks/admin/user/useUserById";
import { useUserUpdate } from "../../../hooks/admin/user/useUserUpdate";
import { useRolesAll } from "../../../hooks/admin/role/useRoleAll";
import { toast } from "react-hot-toast";

// Interface for error validation
interface ValidationErrors {
    [key: string]: string;
}

const UserEdit: React.FC = () => {
    // Change title page
    document.title = "Edit User - GIS Desa Santri";

    // use navigate hook
    const navigate = useNavigate();

    // Get id from parameter url
    const { id } = useParams();
    const userId = Number(id);

    // Form state
    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [roleIds, setRoleIds] = useState<number[]>([]);

    // Error state
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Fetch roles
    const { data: roles } = useRolesAll();

    // Fetch user by id
    const { data: user } = useUserById(userId);

    // Mutation update user
    const { mutate, isPending } = useUserUpdate();

    // Fill form from data user
    useEffect(() => {
        if (user) {
            setName(user.name);
            setUsername(user.username);
            setEmail(user.email);
            setRoleIds(user.roles ? user.roles.map((role) => role.id) : []);
        }
    }, [user]);

    // Handle submit
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        mutate(
            {
                id: userId,
                name,
                username,
                email,
                password,
                role_ids: roleIds,
            },
            {
                onSuccess: () => {
                    toast.success("User updated successfully!", {
                        position: "top-right",
                        duration: 3000,
                    });
                    navigate("/admin/users");
                },
                onError: (error: any) => {
                    setErrors(error.response?.data?.errors || {});
                },
            }
        );
    };

    // Handle checkbox
    const handleCheckboxChange = (id: number) => {
        setRoleIds((prev) => {
            return prev.includes(id)
                ? prev.filter((rid) => rid !== id)
                : [...prev, id];
        });
    };

    return (
        <AppLayout>
            <div className="px-4 py-3 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Edit User
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 italic">
                            Form to update an existing user.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter full name"
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

                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.Username ||
                                (errors.Uni_users_username && (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl relative"
                                        role="alert"
                                    >
                                        <span className="block sm:inline">
                                            {errors.Username ||
                                                "Username already exists"}
                                        </span>
                                    </div>
                                ))}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.Email ||
                                (errors.Uni_users_email && (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl relative"
                                        role="alert"
                                    >
                                        <span className="block sm:inline">
                                            {errors.Email ||
                                                "Email already exists"}
                                        </span>
                                    </div>
                                ))}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Leave blank to keep current password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.Password && (
                                <div
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded-xl relative"
                                    role="alert"
                                >
                                    <span className="block sm:inline">
                                        {errors.Password}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Roles */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assign Roles
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {roles?.map((role) => (
                                    <label
                                        key={role.id}
                                        id={`role_id_${role.id}`}
                                        className="flex items-center space-x-2 bg-gray-100 p-3 rounded-xl border hover:bg-gray-100 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            id={`role_id_${role.id}`}
                                            value={role.id}
                                            checked={roleIds.includes(role.id)}
                                            onChange={() =>
                                                handleCheckboxChange(role.id)
                                            }
                                        />
                                        <span className="text-sm text-gray-700">
                                            {role.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
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
                                {isPending ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default UserEdit;
