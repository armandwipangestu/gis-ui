import { type FC, useState } from "react";

import { useNavigate } from "react-router";

import { useAuthStore } from "../../stores/auth";

import AppLayout from "../../layouts/AppLayout";

interface ValidationErrors {
    [key: string]: string;
}

const Login: FC = () => {
    // Set title page
    document.title = "Login - GIS Desa Santri";

    // Initialize navigate
    const navigate = useNavigate();

    // State for form login
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Get function login from useAuthStore
    const { login } = useAuthStore();

    // Function handleSubmit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Set loading true
        setIsLoading(true);

        // Call function login from useAuthStore
        await login({ username, password })
            .then(() => {
                // Set loading false
                setIsLoading(false);

                // Redirect to dashboard
                navigate("/admin/dashboard", { replace: true });
            })
            .catch((error) => {
                // Set error from response to state errors
                setErrors(
                    error.response?.data?.errors || { Error: "Login failed" }
                );

                // Set loading false
                setIsLoading(false);
            });
    };

    return (
        <AppLayout>
            {/* Main Content */}
            <div className="relative container mx-auto px-4 py-12 mt-30">
                <div className="max-w-md mx-auto">
                    {/* Login Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2">
                                Masuk ke Sistem
                            </h2>
                            <p className="italic">
                                Sistem Informasi Geografis Desa Santri
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                                        ${
                                            errors.Username
                                                ? "border-red-500 focus:ring-red-200"
                                                : "border-blue-200"
                                        }`}
                                    placeholder="Masukkan username"
                                />
                                {errors.Username && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.Username}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                                        ${
                                            errors.Password
                                                ? "border-red-500 focus:ring-red-200"
                                                : "border-blue-200"
                                        }`}
                                    placeholder="Masukkan password"
                                />
                                {errors.Password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.Password}
                                    </p>
                                )}
                            </div>

                            {/* Error Message */}
                            {errors.Error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-700 text-sm">
                                        Username atau password salah
                                    </p>
                                </div>
                            )}

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 border-blue-300 rounded focus:ring-emerald-500"
                                    />
                                    <span className="text-sm">Ingat saya</span>
                                </label>

                                <a
                                    href="#"
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Lupa password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <span>Masuk</span>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8">
                        <p className="text-sm">
                            © {new Date().getFullYear()} Desa Santri Kab.
                            Jombang
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Login;
