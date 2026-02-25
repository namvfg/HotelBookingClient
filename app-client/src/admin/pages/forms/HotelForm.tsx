import { useEffect, useState } from "react";
import { adminAuthApis, endpoints } from "../../../shared/api/apis";
import type { TableActionType } from "../../../shared/type/others/tableActionType";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../../shared/components/Input";
import type { HotelFormState } from "../../../shared/type/hotel/hotelFormState";
import type { HotelDetail } from "../../../shared/type/hotel/hotelDetail";

export default function HotelForm({ type }: { type: TableActionType }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<HotelFormState>({
        name: "",
        address: "",
        city: "",
        country: "",
        description: "",
        manager_id: "",
    });

    const [hotelDetail, setHotelDetail] = useState<HotelDetail | null>(null);
    const [managers, setManagers] = useState<any[]>([]);

    // ===== images state =====
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    /* ===== load managers ===== */
    useEffect(() => {
        adminAuthApis.get(endpoints["managers"]).then((res) => {
            setManagers(res.data.data);
        });
    }, []);

    /* ===== load hotel when edit ===== */
    useEffect(() => {
        if (type !== "edit" || !id) return;

        const loadHotel = async () => {
            const res = await adminAuthApis.get(
                endpoints["hotel-detail"](Number(id))
            );

            const hotel = res.data.data;
            setHotelDetail(hotel);

            setForm({
                name: hotel.name ?? "",
                address: hotel.address ?? "",
                city: hotel.city ?? "",
                country: hotel.country ?? "",
                description: hotel.description ?? "",
                manager_id: hotel.manager?.id ?? "",
            });
        };

        loadHotel();
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

            // new images
            newImages.forEach((img) => {
                formData.append("images[]", img);
            });

            // deleted old images
            deletedImageIds.forEach((id) => {
                formData.append("delete_image_ids[]", String(id));
            });

            if (type === "create") {
                await adminAuthApis.post(endpoints["hotels"], formData);
            } else {
                console.log(form);
                await adminAuthApis.put(
                    endpoints["hotel-detail"](Number(id)),
                    formData
                );
            }

            alert(
                type === "create"
                    ? "Hotel created successfully!"
                    : "Hotel updated successfully!"
            );

            navigate("/admin/hotels");
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
                {type === "create" ? "Add hotel" : "Edit hotel"}
            </h2>

            {/* ===== READ ONLY INFO (edit only) ===== */}
            {type === "edit" && hotelDetail && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <Input label="ID" value={String(hotelDetail.id)} disabled />
                    <Input
                        label="Manager"
                        value={hotelDetail.manager?.name ?? "—"}
                        disabled
                    />
                    <Input label="Created at" value={hotelDetail.created_at} disabled />
                    <Input label="Updated at" value={hotelDetail.updated_at} disabled />
                </div>
            )}

            <Input
                label="Hotel name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                error={errors.name?.[0]}
            />

            <Input
                label="Address"
                value={form.address}
                onChange={(v) => setForm({ ...form, address: v })}
                error={errors.address?.[0]}
            />

            <Input
                label="City"
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
                error={errors.city?.[0]}
            />

            <Input
                label="Country"
                value={form.country}
                onChange={(v) => setForm({ ...form, country: v })}
                error={errors.country?.[0]}
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

            {/* Manager */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Manager</label>
                <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={form.manager_id}
                    onChange={(e) =>
                        setForm({ ...form, manager_id: e.target.value })
                    }
                >
                    <option value="">-- Select manager --</option>
                    {managers.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.name} ({m.email})
                        </option>
                    ))}
                </select>
                {errors.manager_id && (
                    <p className="text-sm text-red-500">{errors.manager_id[0]}</p>
                )}
            </div>

            {/* Images */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Images</label>

                {/* existing images */}
                {type === "edit" && hotelDetail?.images?.length > 0 && (
                    <div className="flex gap-3 flex-wrap">
                        {hotelDetail.images.map((img: any) => {
                            const marked = deletedImageIds.includes(img.id);

                            return (
                                <div key={img.id} className="relative">
                                    <img
                                        src={img.url}
                                        className={`w-24 h-24 object-cover rounded border ${marked ? "opacity-40" : ""
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDeletedImageIds((prev) =>
                                                marked
                                                    ? prev.filter((id) => id !== img.id)
                                                    : [...prev, img.id]
                                            )
                                        }
                                        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded px-1"
                                    >
                                        {marked ? "Undo" : "X"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* new images */}
                {newPreviews.length > 0 && (
                    <div className="flex gap-3 flex-wrap">
                        {newPreviews.map((src, i) => (
                            <div key={i} className="relative">
                                <img
                                    src={src}
                                    className="w-24 h-24 object-cover rounded border"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNewImages((prev) =>
                                            prev.filter((_, idx) => idx !== i)
                                        );
                                        setNewPreviews((prev) =>
                                            prev.filter((_, idx) => idx !== i)
                                        );
                                    }}
                                    className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded px-1"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        setNewImages(files);
                        setNewPreviews(files.map((f) => URL.createObjectURL(f)));
                    }}
                />
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
                            ? "Create hotel"
                            : "Update hotel"}
                </button>
            </div>
        </form>
    );
}
