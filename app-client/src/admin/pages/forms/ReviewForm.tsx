import { useEffect, useState } from "react";
import { adminAuthApis, endpoints } from "../../../shared/api/apis";
import type { TableActionType } from "../../../shared/type/others/tableActionType";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../../shared/components/Input";
import type { ReviewFormState } from "../../../shared/type/review/reviewFormState";
import type { ReviewDetail } from "../../../shared/type/review/reviewDetail";
import NumberInput from "../../../shared/components/NumberInput";
import type { User } from "../../../shared/type/user/user";
import type { Hotel } from "../../../shared/type/hotel/hotel";

export default function ReviewForm({ type }: { type: TableActionType }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<ReviewFormState>({
        user_id: "",
        hotel_id: "",
        rating: 0,
        comment: "",
    });

    const [reviewDetail, setReviewDetail] = useState<ReviewDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const [users, setUsers] = useState<User[]>([]);
    const [hotels, setHotels] = useState<Hotel[]>([]);

    useEffect(() => {
        adminAuthApis.get(endpoints["users"]).then((res) => {
            setUsers(res.data.data);
        });
        adminAuthApis.get(endpoints["hotels"]).then((res) => {
            setHotels(res.data.data);
        });
    }, [])

    /* ===== load review when edit ===== */
    useEffect(() => {
        if (type !== "edit" || !id) return;

        const loadReview = async () => {
            const res = await adminAuthApis.get(
                endpoints["review-detail"](Number(id))
            );

            const review = res.data.data;
            setReviewDetail(review);

            setForm({
                user_id: review.user?.id ?? "",
                hotel_id: review.hotel?.id ?? "",
                rating: review.rating ?? 0,
                comment: review.comment ?? ""
            });
        };

        loadReview();
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
            })

            if (type === "create") {
                await adminAuthApis.post(endpoints["reviews"], formData);
            } else {
                await adminAuthApis.put(
                    endpoints["review-detail"](Number(id)),
                    formData
                );
            }

            alert(
                type === "create"
                    ? "Review created successfully!"
                    : "Review updated successfully!"
            );

            navigate("/admin/reviews");
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
            {type === "edit" && reviewDetail && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <Input label="ID" value={String(reviewDetail.id)} disabled />
                    <Input
                        label="User"
                        value={reviewDetail.user?.name ?? "—"}
                        disabled
                    />
                    <Input
                        label="Hotel"
                        value={reviewDetail.hotel?.name ?? "—"}
                        disabled
                    />
                    <Input label="Created at" value={reviewDetail.created_at} disabled />
                    <Input label="Updated at" value={reviewDetail.updated_at} disabled />
                </div>
            )}

            <NumberInput
                label="Rating"
                value={form.rating}
                min={1}
                max={5}
                step={1}
                onChange={(v) => setForm({ ...form, rating: v })}
                error={errors.rating?.[0]}
            />

            {/* Comment */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Comment</label>
                <textarea
                    className="w-full px-3 py-2 border rounded-md"
                    rows={4}
                    value={form.comment}
                    onChange={(e) =>
                        setForm({ ...form, comment: e.target.value })
                    }
                />
                {errors.comment && (
                    <p className="text-sm text-red-500">{errors.comment[0]}</p>
                )}
            </div>

            {/* User */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Manager</label>
                <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={form.user_id}
                    onChange={(e) =>
                        setForm({ ...form, user_id: e.target.value })
                    }
                >
                    <option value="">-- Select user --</option>
                    {users.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.name} ({m.email})
                        </option>
                    ))}
                </select>
                {errors.user_id && (
                    <p className="text-sm text-red-500">{errors.user_id[0]}</p>
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
                            ? "Create review"
                            : "Update review"}
                </button>
            </div>
        </form>
    );
}
