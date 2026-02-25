export type PaginationItem = number | "...";

export function getPaginationPages(
    currentPage: number,
    lastPage: number,
    maxVisible = 2
): PaginationItem[] {
    if (lastPage <= maxVisible) {
        return Array.from({ length: lastPage }, (_, i) => i + 1);
    }

    const pages: PaginationItem[] = [];
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(2, currentPage - half);
    let end = Math.min(lastPage - 1, currentPage + half);

    if (currentPage <= half) {
        start = 2;
        end = maxVisible - 1;
    }

    if (currentPage >= lastPage - half) {
        start = lastPage - (maxVisible - 2);
        end = lastPage - 1;
    }

    pages.push(1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (end < lastPage - 1) pages.push("...");

    pages.push(lastPage);

    return pages;
}