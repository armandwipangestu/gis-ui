import type { FC } from "react";
import { Loader } from "lucide-react";

const Loading: FC = () => {
    return (
        <div className="flex-flex-col items-center justify-center py-12">
            <Loader className="animate-spin text-blue-600 mb-3" size={35} />
            <p className="text-gray-600">Loading Data...</p>
        </div>
    );
};

export default Loading;
