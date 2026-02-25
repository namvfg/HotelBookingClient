import { useEffect, useState } from "react";
import { adminAuthApis, endpoints } from "../../../shared/api/apis";
import type { TableActionType } from "../../../shared/type/others/tableActionType";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../../shared/components/Input";
import type { RoomFormState } from "../../../shared/type/room/roomFormState";
import type { RoomDetail } from "../../../shared/type/room/roomDetail";
import { isScrollNearBottom } from "../../../shared/utils/scroll";
import { handleInfiniteScroll } from "../../../shared/utils/infiniteScroll";

export default function RoomForm({ type }: { type: TableActionType }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<RoomFormState>({
        room_code: "",
        room_type_id: "",
        hotel_id: "",
    });

    const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
    const [hotels, setHotels] = useState<any[]>([]);
    const [selectedHotelId, setSelectedHotelId] = useState(-1);
    const [roomTypes, setRoomTypes] = useState<any[]>([]);

    // hotels
    const [hotelPage, setHotelPage] = useState(1);
    const [hasMoreHotels, setHasMoreHotels] = useState(true);
    const [loadingHotels, setLoadingHotels] = useState(false);

    //roomTypes
    const [roomTypePage, setRoomTypePage] = useState(1);
    const [hasMoreRoomTypes, setHasMoreRoomTypes] = useState(true);
    const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);

    // ===== images state =====
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    /* ===== load hotels ===== */

    const loadHotels = async (page = 1) => {
        if (loadingHotels || !hasMoreHotels) return;

        setLoadingHotels(true);

        const res = await adminAuthApis.get(endpoints["hotels"], {
            params: { page }
        });

        const data = res.data.data;
        const meta = res.data.meta;

        setHotels((prev) => page === 1 ? data : [...prev, ...data]);
        setHasMoreHotels(meta.current_page < meta.last_page);
        setHotelPage(page);

        setLoadingHotels(false);
    };

    useEffect(() => {
        loadHotels(1);
    }, []);

    const loadRoomTypes = async (page = 1) => {
        if (loadingRoomTypes || !hasMoreRoomTypes || selectedHotelId === -1) return;

        setLoadingRoomTypes(true);

        const res = await adminAuthApis.get(endpoints["room_types"], {
            params: {
                hotel_id: selectedHotelId,
                page,
            },
        });

        const data = res.data.data;
        const meta = res.data.meta;

        setRoomTypes((prev) => page === 1 ? data : [...prev, ...data]);
        setHasMoreRoomTypes(meta.current_page < meta.last_page);
        setRoomTypePage(page);

        setLoadingRoomTypes(false);
    };

    useEffect(() => {
        if (selectedHotelId === -1) {
            setRoomTypes([]);
            return;
        }

        setRoomTypes([]);
        setRoomTypePage(1);
        setHasMoreRoomTypes(true);
        loadRoomTypes(1);
    }, [selectedHotelId]);

    useEffect(() => {
        console.log(hotels);
        console.log(roomTypes);
    }, [hotels, roomTypes])

    /* ===== load room when edit ===== */
    useEffect(() => {
        if (type !== "edit" || !id) return;

        const loadRoom = async () => {
            const res = await adminAuthApis.get(
                endpoints["room-detail"](Number(id))
            );

            const room = res.data.data;
            setRoomDetail(room);

            setForm({
                room_code: room.room_code ?? "",
                room_type_id: room.room_type?.id ?? "",
                hotel_id: room.hotel?.id ?? "",
            });
        };

        loadRoom();
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
                await adminAuthApis.post(endpoints["rooms"], formData);
            } else {
                console.log(form);
                await adminAuthApis.put(
                    endpoints["room-detail"](Number(id)),
                    formData
                );
            }

            alert(
                type === "create"
                    ? "Room created successfully!"
                    : "Room updated successfully!"
            );

            navigate("/admin/rooms");
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
                {type === "create" ? "Add room" : "Edit room"}
            </h2>

            {/* ===== READ ONLY INFO (edit only) ===== */}
            {type === "edit" && roomDetail && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <Input label="ID" value={String(roomDetail.id)} disabled />
                    <Input
                        label="Hotel"
                        value={roomDetail.hotel?.name ?? "—"}
                        disabled
                    />
                    <Input
                        label="Room Type"
                        value={roomDetail.room_type?.name ?? "—"}
                        disabled
                    />
                    <Input label="Created at" value={roomDetail.created_at} disabled />
                    <Input label="Updated at" value={roomDetail.updated_at} disabled />
                </div>
            )}

            <Input
                label="Room Code"
                value={form.room_code}
                onChange={(v) => setForm({ ...form, room_code: v })}
                error={errors.room_code?.[0]}
            />

            {/* Hotel */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Hotel</label>

                <div
                    className="border rounded-md max-h-60 overflow-y-auto"

                >
                    <select
                        className="w-full px-3 py-2 border-none outline-none"
                        size={6} // quan trọng: biến select thành list
                        value={form.hotel_id}
                        onScroll={(e) =>
                            handleInfiniteScroll(e.currentTarget, {
                                hasMore: hasMoreHotels,
                                loading: loadingHotels,
                                onLoadMore: () => loadHotels(hotelPage + 1),
                            })
                        }
                        onChange={(e) => {
                            const value = e.target.value;
                            setForm({ ...form, hotel_id: value });
                            setSelectedHotelId(Number(value));
                        }}
                    >
                        {hotels.map((h) => (
                            <option key={h.id} value={h.id}>
                                {h.name} ({h.city} {h.country})
                            </option>
                        ))}

                        {loadingHotels && (
                            <option disabled>Loading more hotels...</option>
                        )}
                    </select>
                </div>

                {errors.hotel_id && (
                    <p className="text-sm text-red-500">{errors.hotel_id[0]}</p>
                )}
            </div>

            {/* Room Types */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Room Type</label>

                <div
                    className="border rounded-md max-h-60 overflow-y-auto"

                >
                    <select
                        className="w-full px-3 py-2 border-none outline-none"
                        size={6}
                        value={form.room_type_id}
                        onScroll={(e) =>
                            handleInfiniteScroll(e.currentTarget, {
                                hasMore: hasMoreRoomTypes,
                                loading: loadingRoomTypes,
                                onLoadMore: () => loadRoomTypes(roomTypePage + 1),
                            })
                        }
                        onChange={(e) =>
                            setForm({ ...form, room_type_id: e.target.value })
                        }
                    >
                        {roomTypes.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name} (${t.base_price} - Cap: {t.capacity})
                            </option>
                        ))}

                        {loadingRoomTypes && (
                            <option disabled>Loading more room types...</option>
                        )}
                    </select>
                </div>

                {errors.room_type_id && (
                    <p className="text-sm text-red-500">{errors.room_type_id[0]}</p>
                )}
            </div>

            {/* Images */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Images</label>

                {/* existing images */}
                {type === "edit" && roomDetail?.images?.length > 0 && (
                    <div className="flex gap-3 flex-wrap">
                        {roomDetail.images.map((img: any) => {
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
                            ? "Create room"
                            : "Update room"}
                </button>
            </div>
        </form>
    );
}
