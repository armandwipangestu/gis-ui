import React from "react";
import { MapPin } from "lucide-react";

// CategoryItem props interface
interface CategoryItemProps {
    category: any;
    isActive: boolean;
    searchTerm: string;
    selectedIds: number[];
    onToggle: (categoryId: number) => void;
    onSearchChange: (term: string) => void;
    onItemToggle: (mapId: number, checked: boolean) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
    category,
    isActive,
    searchTerm,
    selectedIds,
    onToggle,
    onSearchChange,
    onItemToggle,
}) => {
    // Get maps from category and count total
    const maps: any[] = Array.isArray(category?.maps) ? category.maps : [];
    const count = maps.length;

    // Filter maps based on searchTerm if isActive
    const filteredMaps =
        isActive && searchTerm.trim()
            ? maps.filter((m) => {
                  const hay = [m?.name, m?.description, m?.address, m?.slug]
                      .filter(Boolean)
                      .join(" ")
                      .toLowerCase();

                  return hay.includes(searchTerm.trim().toLowerCase());
              })
            : maps;

    // Check if all maps in category selected
    const allCheckedInCat =
        isActive &&
        filteredMaps.length > 0 &&
        filteredMaps.every((m) => {
            return selectedIds.includes(Number(m.id));
        });

    // Helper function for classNames
    const cx = (...parts: Array<string | false | null | undefined>) => {
        return parts.filter(Boolean).join(" ");
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs transition-all">
            <button
                type="button"
                onClick={() => onToggle(category.id)}
                className={cx(
                    "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors",
                    isActive
                        ? category?.color
                            ? "bg-gradient-to-r from-blue-600 to-[var(--cat)] text-white shadow"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                )}
                style={
                    isActive && category?.color
                        ? ({ "--cat": category.color } as React.CSSProperties)
                        : undefined
                }
            >
                <div className="flex items-center gap-3">
                    <img
                        src={`${
                            import.meta.env.VITE_BASE_URL
                        }/uploads/categories/${category.image}`}
                        alt={category.name || "Icon"}
                        className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-100 object-cover p-1"
                    />
                    <span
                        className={cx(
                            "h-2 w-2 rounded-full",
                            isActive ? "bg-white" : "bg-blue-500"
                        )}
                        style={
                            !isActive && category?.color
                                ? { backgroundColor: category.color }
                                : undefined
                        }
                    />
                    <span className="text-sm font-semibold">
                        {category.name}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={cx(
                            "text-xs font-medium px-2 py-0.5 rounded-full",
                            isActive
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-slate-600"
                        )}
                    >
                        {count}
                    </span>
                    <svg
                        className={cx(
                            "h-4 w-4 transition-transform",
                            isActive
                                ? "rotate-180 text-white"
                                : "text-slate-400"
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </button>

            <div
                className={cx(
                    "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
                    isActive ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="bg-white p-4">
                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative">
                            <svg
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="search"
                                value={isActive ? searchTerm : ""}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder={`Cari di ${category.name}...`}
                                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Select All */}
                    {isActive && filteredMaps.length > 0 && (
                        <label className="mb-4 flex cursor-pointer items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 transition-colors hover:bg-blue-100">
                            <input
                                type="checkbox"
                                checked={allCheckedInCat}
                                onChange={(e) => {
                                    filteredMaps.forEach((m) =>
                                        onItemToggle(
                                            Number(m.id),
                                            e.target.checked
                                        )
                                    );
                                }}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                                Tampilkan semua di kategori ini
                            </span>
                        </label>
                    )}

                    {/* Map List */}
                    {isActive && (
                        <>
                            {filteredMaps.length === 0 ? (
                                <div className="py-6 text-center">
                                    <svg
                                        className="mx-auto mb-3 h-12 w-12 text-slate-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1"
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <p className="text-sm text-slate-500">
                                        {searchTerm.trim()
                                            ? "Tidak ada hasil."
                                            : "Belum ada data."}
                                    </p>
                                </div>
                            ) : (
                                <div className="max-h-96 space-y-3 overflow-y-auto">
                                    {filteredMaps.map((m) => {
                                        const idNum = Number(m.id);
                                        const checked =
                                            selectedIds.includes(idNum);
                                        return (
                                            <label
                                                key={m.id}
                                                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 hover:border-blue-300 hover:shadow-sm transition"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={(e) =>
                                                        onItemToggle(
                                                            idNum,
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div className="min-w-0">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
                                                            {category.name}
                                                        </span>
                                                        {checked && (
                                                            <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                                                                Ditampilkan
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-sm font-semibold leading-tight text-slate-900">
                                                        {m.name}
                                                    </h3>
                                                    {m.address && (
                                                        <div className="mt-2 line-clamp-2 text-xs text-slate-600">
                                                            <MapPin
                                                                className="inline-block"
                                                                size={14}
                                                            />{" "}
                                                            {m.address}
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
