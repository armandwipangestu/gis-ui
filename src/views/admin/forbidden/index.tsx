import React from "react";
import { Ban, MoveLeft } from "lucide-react";
import AppLayout from "../../../layouts/AppLayout";
import { useNavigate } from "react-router";

const Forbidden: React.FC = () => {
    const navigate = useNavigate();

    return (
        <AppLayout>
            <div className="px-4 py-3 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
                    <div className="bg-red-100 p-6 rounded-full mb-6">
                        <Ban className="text-red-600" size={60} />
                    </div>

                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        403 - Forbidden
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                        You don't have permission to access this page. Please
                        contact your administrator if you believe this is an
                        error.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 flex items-center justify-center bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200"
                        >
                            <MoveLeft className="mr-2" size={18} />
                            Go Back
                        </button>

                        <button
                            onClick={() => navigate("/admin/dashboard")}
                            className="px-6 py-3 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Forbidden;
