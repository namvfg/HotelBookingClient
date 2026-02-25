export default function Input({
    label,
    value,
    onChange,
    type = "text",
    error,
    disabled = false
}: {
    label: string;
    value?: string;
    onChange?: (v: string) => void;
    type?: string;
    error?: string;
    disabled?: boolean
}) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            <input
                disabled={disabled}
                type={type}
                value={value ?? ""}
                onChange={(e) => {
                    if (onChange) {
                        onChange(e.target.value);
                    }
                }}
                className={`w-full px-3 py-2 border rounded-md
                    ${disabled ? "bg-gray-100 text-gray-500" : ""}
                    ${error ? "border-red-500" : ""}
                `}
            />
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

