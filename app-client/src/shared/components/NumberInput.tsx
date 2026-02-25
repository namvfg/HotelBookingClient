export default function NumberInput({
    label,
    value,
    onChange,
    min = 1,
    max = 100,
    step = 1,
    error,
    disabled = false
}: {
    label: string;
    value?: number;
    onChange?: (v: number) => void;
    min?: number,
    max?: number,
    step?: number,
    error?: string;
    disabled?: boolean
}) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            <input
                disabled={disabled}
                type="numner"
                min={min}
                max={max}
                step={step}
                value={value ?? ""}
                onChange={(e) => {
                    if (onChange) {
                        onChange(Number(e.target.value));
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
