import React from "react";
import AppLayout from "../../../layouts/AppLayout";
import { useSidebarStore } from "../../../stores/sidebar";
import { useSidebarBreakpointSync } from "../../../hooks/public/sidebar/useSidebarBreakpointSync";
import { useHomeData } from "../../../hooks/public/home/useHomeData";
import { Sidebar } from "../../../components/App/Sidebar";
import { MapViewer } from "../../../components/Public/Map/MapViewer";

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
        // map data
        center,
        zoom,
        selectedCollection,
        guideGeometry,
        handleFeatureClick,
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
                <section className="relative z-10 lg:h-[calc(100vh-72px)] lg:overflow-hidden">
                    <div className="pointer-events-none absolute top-3 right-3 z-[1000] rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-lg backdrop-blur">
                        {selectedCollection.features.length} fitur ditampilkan
                    </div>

                    <div className="h-[calc(100vh-72px)] w-full">
                        <MapViewer
                            center={center}
                            zoom={zoom}
                            geometry={selectedCollection}
                            guideGeometry={guideGeometry}
                            autoFit={
                                selectedCollection.features.length
                                    ? "always"
                                    : "never"
                            }
                            height="100%"
                            containerKey={`${center[0]}-${center[1]}-${zoom}-${selectedCollection.features.length}`}
                            onFeatureClick={handleFeatureClick}
                        />
                    </div>
                </section>
            </main>
        </AppLayout>
    );
};

export default HomePage;
