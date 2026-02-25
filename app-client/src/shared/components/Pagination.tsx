import { getPaginationPages } from "../../shared/utils/pagination";

type PaginationProps = {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({
    currentPage,
    lastPage,
    onPageChange,
}: PaginationProps) {
    if (lastPage <= 1) return null;

    return (
        <div className="flex items-center justify-between p-4 border-t text-sm">
            <span className="text-gray-500">
                Page {currentPage} / {lastPage}
            </span>

            <div className="flex items-center gap-1">
                {/* First */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(1)}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                >
                    «
                </button>

                {/* Prev */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                >
                    ‹
                </button>

                {/* Page numbers */}
                {getPaginationPages(currentPage, lastPage).map((page, idx) =>
                    page === "..." ? (
                        <span
                            key={`dots-${idx}`}
                            className="px-2 text-gray-400"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1 border rounded
                                ${page === currentPage
                                    ? "bg-slate-900 text-white"
                                    : "hover:bg-gray-100"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    disabled={currentPage === lastPage}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                >
                    ›
                </button>

                {/* Last */}
                <button
                    disabled={currentPage === lastPage}
                    onClick={() => onPageChange(lastPage)}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                >
                    »
                </button>
            </div>
        </div>
    );
}
