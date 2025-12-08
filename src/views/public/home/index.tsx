import React from "react";
import AppLayout from "../../../layouts/AppLayout";

const HomePage: React.FC = () => {
    // Change title page
    document.title = "GIS Desa Santri - Sistem Informasi Geografis Desa Santri";

    return (
        <AppLayout>
            <div className="justify-center items-center flex h-full">
                <h1 className="text-3xl font-bold underline mt-30">
                    Welcome to the Home Page!
                </h1>
            </div>
        </AppLayout>
    );
};

export default HomePage;
