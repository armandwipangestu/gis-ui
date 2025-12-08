import React from "react";
import { CategoryItem } from "../Public/Category/CategoryItem";

// Sidebar props interface
interface SidebarProps {
    isOpen: boolean;
    categories: any[];
    activeCategoryId: number | null;
    searchTerm: string;
    selectedIds: number[];
    allChecked: boolean;
    onCategoryToggle: (categoryId: number) => void;
    onSearchChange: (term: string) => void;
    onItemToggle: (mapId: number, checked: boolean) => void;
    onToggleAll: (checked: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    categories,
    activeCategoryId,
    searchTerm,
    selectedIds,
    allChecked,
    onCategoryToggle,
    onSearchChange,
    onItemToggle,
    onToggleAll,
}) => {
    return (
        <aside
            className={[
                "z-40 bg-white border-r border-slate-200",
                "fixed inset-y-0 left-0 w-80 shadow-lg transition-transform duration-300 lg:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full",
                "lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] lg:translate-x-0 lg:w-96 lg:overflow-y-auto",
            ].join(" ")}
        >
            <div className="flex h-full flex-col">
                <div className="flex-1 overflow-hidden">
                    <div className="h-full max-h-full overflow-y-auto px-4 py-6 mt-20 sm:px-6 lg:mt-0">
                        {/* Header */}
                        <div className="mb-4 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700">
                                    Kategori
                                </h2>
                            </div>
                            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={(e) =>
                                        onToggleAll(e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                Tampilkan semua
                            </label>
                        </div>

                        {/* Category List */}
                        <div className="space-y-3">
                            {categories.map((category) => (
                                <CategoryItem
                                    key={category.id}
                                    category={category}
                                    isActive={activeCategoryId === category.id}
                                    searchTerm={searchTerm}
                                    selectedIds={selectedIds}
                                    onToggle={onCategoryToggle}
                                    onSearchChange={onSearchChange}
                                    onItemToggle={onItemToggle}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 bg-white p-4">
                    <div className="text-xs text-slate-500">
                        © {new Date().getFullYear()} GIS Desa Santri
                    </div>
                </div>
            </div>
        </aside>
    );
};
