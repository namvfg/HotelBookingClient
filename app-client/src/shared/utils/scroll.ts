export function isScrollNearBottom(
    el: HTMLElement,
    offset = 20
) {
    return el.scrollTop + el.clientHeight >= el.scrollHeight - offset;
}