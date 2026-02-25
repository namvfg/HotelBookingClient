import { useEffect, useState } from "react";
import { adminAuthApis, endpoints } from "../../../shared/api/apis";
import type { TableActionType } from "../../../shared/type/others/tableActionType";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../../shared/components/Input";
import type { AmenityFormState } from "../../../shared/type/amentity/amenityFormState";
import type { AmenityDetail } from "../../../shared/type/amentity/amentityDetail";

export default function AmenityForm({ type }: { type: TableActionType }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<AmenityFormState>({
        name: "",
        slug: ""
    });

    const [amenityDetail, setAmenityDetail] = useState<AmenityDetail | null>(null);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    // ===== load amenity when edit =====
    useEffect(() => {
        if (type !== "edit" || !id) return;

        const loadAmenity = async () => {
            const res = await adminAuthApis.get(
                endpoints["amenity-detail"](Number(id))
            );

            const amenity = res.data.data;
            setAmenityDetail(amenity);

            setForm({
                name: amenity.name ?? "",
                slug: amenity.slug ?? "",
            });
        };

        loadAmenity();
    }, [type, id]);

    // ===== submit =====
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const formData = new FormData();

            Object.entries(form).forEach(([key, value]) => {
                if (
                    type === "edit" && !value
                ) {
                    return;
                }
                formData.append(key, value);
            });

            if (type === "create") {
                await adminAuthApis.post(endpoints["amenities"], formData);
            } else {
                await adminAuthApis.put(
                    endpoints["amenity-detail"](Number(id)),
                    formData
                );
            }

            alert(type === "create"
                ? "Amenity created successfully!"
                : "Amenity updated successfully"
            );

            navigate("/admin/amenities");
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
                {type === "create" ? "Add amenity" : "Edit amenity"}
            </h2>

            {/* ===== READ ONLY INFO (edit only) ===== */}
            {type === "edit" && amenityDetail && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <Input label="ID" value={String(amenityDetail.id)} disabled />
                    <Input label="Created at" value={amenityDetail.created_at} disabled />
                    <Input label="Updated at" value={amenityDetail.updated_at} disabled />
                </div>
            )}

            {/* Name */}
            <Input
                label="Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                error={errors.name?.[0]}
            />

            {/* slug */}
            <Input
                label="Slug"
                value={form.slug}
                onChange={(v) => setForm({ ...form, slug: v })}
                error={errors.slug?.[0]}
            />

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    disabled={loading}
                    className="px-6 py-2 rounded-md bg-slate-900 text-white disabled:opacity-50"
                >
                    {loading
                        ? "Saving..."
                        : type === "create"
                            ? "Create amenity"
                            : "Update amentity"}
                </button>
            </div>
        </form>
    );
}
