import React from "react";
import AppLayout from "../../../layouts/AppLayout";
import { useSidebarStore } from "../../../stores/sidebar";
import { useSidebarBreakpointSync } from "../../../hooks/public/sidebar/useSidebarBreakpointSync";
import { useHomeData } from "../../../hooks/public/home/useHomeData";
import { Sidebar } from "../../../components/App/Sidebar";

const HomePage: React.FC = () => {
    // Change title page
    document.title = "GIS Desa Santri - Sistem Informasi Geografis Desa Santri";

    // Synchronize sidebar with breakpoint
    useSidebarBreakpointSync();

    // Get state isOpen from useSidebarStore
    const isOpen = useSidebarStore((s) => s.isOpen);

    // Get data and function from useHomePageData
    const {
        categories,
        activeCategoryId,
        handleCategoryToggle,
        searchTerm,
        selectedIds,
        allChecked,
        setSearchTerm,
        toggleAll,
        toggleOne,
    } = useHomeData();

    return (
        <AppLayout>
            <main
                className="relative lg:grid min-h-[calc(100vh-72px)]"
                style={{ gridTemplateColumns: isOpen ? "24rem 1fr" : "0 1fr" }}
            >
                {/* Overlay mobile */}
                {isOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
                        onClick={() => useSidebarStore.getState().close()}
                    />
                )}

                {/* Sidebar */}
                <Sidebar
                    isOpen={isOpen}
                    categories={categories}
                    activeCategoryId={activeCategoryId}
                    searchTerm={searchTerm}
                    selectedIds={selectedIds}
                    allChecked={allChecked}
                    onCategoryToggle={handleCategoryToggle}
                    onSearchChange={setSearchTerm}
                    onItemToggle={toggleOne}
                    onToggleAll={toggleAll}
                />

                {/* Map Section */}
            </main>
        </AppLayout>
    );
};

export default HomePage;
