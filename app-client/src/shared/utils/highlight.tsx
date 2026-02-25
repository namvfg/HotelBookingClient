export function highlightText(text: string, keyword: string) {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
            <mark
                key={index}
                className="bg-yellow-200 text-slate-900 rounded">
                {part.trim()}
            </mark>
        ) : (
            part
        )
    );
}