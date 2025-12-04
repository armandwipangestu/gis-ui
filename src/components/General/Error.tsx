import type { FC } from "react";
import { TriangleAlert } from "lucide-react";

const Error: FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-2xl shadow">
            <TriangleAlert className="text-red-500 mb-3" size={24} />
            <div className="text-red-600 font-medium mb-2">
                Failed to Load Data
            </div>
            <div className="text-gray-600 text-sm text-center max-w-md">
                An error occured while loading data. Please try again.
            </div>
        </div>
    );
};

export default Error;
