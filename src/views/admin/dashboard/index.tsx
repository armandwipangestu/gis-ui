import React from "react";

import AppLayout from "../../../layouts/AppLayout";

const Dashboard: React.FC = () => {
    return (
        <AppLayout>
            <div className="px-4 py-3 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="text-2xl font-bold text-gray-800">
                        Dashboard
                    </div>
                    <p className="text-gray-500">
                        Ringkasan cepat aktivitas dan data GIS Desa.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
