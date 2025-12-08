import { Search } from "lucide-react";

interface TableEmptyRowProps {
    colSpan: number;
    text: string;
    subText?: string;
}

export default function TableEmptyRow({
    colSpan,
    text,
    subText,
}: TableEmptyRowProps) {
    return (
        <tr>
            <td colSpan={colSpan} className="px-6 py-8 text-center">
                <div className="flex flex-col items-center justify-center">
                    <Search className="text-gray-400 mb-2" size={24} />
                    <p className="text-gray-500 font-medium">{text}</p>
                    {subText && (
                        <p className="text-gray-400 text-xs mt-1 italic">
                            {subText}
                        </p>
                    )}
                </div>
            </td>
        </tr>
    );
}
