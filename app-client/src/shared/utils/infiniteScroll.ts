type InfiniteScrollOptions = {
    hasMore: boolean;
    loading: boolean;
    offset?: number;
    onLoadMore: () => void;
};

export function handleInfiniteScroll(
    el: HTMLElement,
    {
        hasMore,
        loading,
        offset = 20,
        onLoadMore,
    }: InfiniteScrollOptions
) {
    const isBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - offset;

    if (isBottom && hasMore && !loading) {
        onLoadMore();
    }
}