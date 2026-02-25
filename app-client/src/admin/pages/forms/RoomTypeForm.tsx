import { useEffect, useState } from "react";
import { adminAuthApis, endpoints } from "../../../shared/api/apis";
import type { TableActionType } from "../../../shared/type/others/tableActionType";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../../shared/components/Input";
import type { RoomTypeFormState } from "../../../shared/type/roomType/roomTypeFormState";
import type { RoomTypeDetail } from "../../../shared/type/roomType/roomTypeDetail";
import NumberInput from "../../../shared/components/NumberInput";

export default function RoomTypeForm({ type }: { type: TableActionType }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<RoomTypeFormState>({
        name: "",
        capacity: 0,
        base_price: 0,
        description: "",
        hotel_id: "",
    });

    const [roomTypeDetail, setRoomTypeDetail] = useState<RoomTypeDetail | null>(null);
    const [hotels, setHotels] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    /* ===== load hotels ===== */
    useEffect(() => {
        adminAuthApis.get(endpoints["hotels"]).then((res) => {
            setHotels(res.data.data);
        });
    }, []);

    /* ===== load room type when edit ===== */
    useEffect(() => {
        if (type !== "edit" || !id) return;

        const loadRoomType = async () => {
            const res = await adminAuthApis.get(
                endpoints["room_type-detail"](Number(id))
            );

            const roomType = res.data.data;
            setRoomTypeDetail(roomType);

            setForm({
                name: roomType.name ?? "",
                capacity: roomType.capacity ?? 0,
                base_price: roomType.base_price ?? 0,
                description: roomType.description ?? "",
                hotel_id: roomType.hotel?.id ?? "",
            });
        };

        loadRoomType();
    }, [type, id]);

    /* ===== submit ===== */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const formData = new FormData();

            Object.entries(form).forEach(([key, value]) => {
                if (value) {
                    formData.append(key, value);
                }
            });

            if (type === "create") {
                await adminAuthApis.post(endpoints["room_types"], formData);
            } else {
                await adminAuthApis.put(
                    endpoints["room_type-detail"](Number(id)),
                    formData
                );
            }

            alert(
                type === "create"
                    ? "Room Type created successfully!"
                    : "Room Type updated successfully!"
            );

            navigate("/admin/room-types");
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 space-y-6 w-full"
        >
            <h2 className="text-lg font-semibold border-b pb-3">
                {type === "create" ? "Add room type" : "Edit room type"}
            </h2>

            {/* ===== READ ONLY INFO (edit only) ===== */}
            {type === "edit" && roomTypeDetail && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <Input label="ID" value={String(roomTypeDetail.id)} disabled />
                    <Input
                        label="Hotel"
                        value={roomTypeDetail.hotel?.name ?? "—"}
                        disabled
                    />
                    <Input label="Created at" value={roomTypeDetail.created_at} disabled />
                    <Input label="Updated at" value={roomTypeDetail.updated_at} disabled />
                </div>
            )}

            <Input
                label="Room type name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                error={errors.name?.[0]}
            />

            <NumberInput
                label="Capacity"
                value={form.capacity}
                min={1}
                max={20}
                step={1}
                onChange={(v) => setForm({ ...form, capacity: v })}
                error={errors.capacity?.[0]}
            />

            <NumberInput
                label="Base Price"
                value={form.base_price}
                min={100}
                max={500000}
                step={100}
                onChange={(v) => setForm({ ...form, base_price: v })}
                error={errors.base_price?.[0]}
            />

            {/* Description */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    className="w-full px-3 py-2 border rounded-md"
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description[0]}</p>
                )}
            </div>

            {/* Hotel */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Hotel</label>
                <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={form.hotel_id}
                    onChange={(e) =>
                        setForm({ ...form, hotel_id: e.target.value })
                    }
                >
                    <option value="">-- Select hotel --</option>
                    {hotels.map((h) => (
                        <option key={h.id} value={h.id}>
                            {h.name} ({h.city} {h.country})
                        </option>
                    ))}
                </select>
                {errors.hotel_id && (
                    <p className="text-sm text-red-500">{errors.hotel_id[0]}</p>
                )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    disabled={loading}
                    className="px-6 py-2 rounded-md bg-slate-900 text-white disabled:opacity-50"
                >
                    {loading
                        ? "Saving..."
                        : type === "create"
                            ? "Create room type"
                            : "Update room type"}
                </button>
            </div>
        </form>
    );
}
