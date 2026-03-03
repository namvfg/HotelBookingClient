import { useEffect, useState } from "react";
import { endpoints, userAuthApis } from "../../shared/api/apis";
import Input from "../../shared/components/Input";
import type { UserDetail } from "../../shared/type/user/userDetail";
import { useUserAuth } from "../context/user-auth/useUserAuth";

export default function UserProfile() {
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);

    const { loadMe } = useUserAuth();

    const [form, setForm] = useState({
        name: "",
        phone: "",
    });

    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    // ===== Load current user =====
    useEffect(() => {
        const loadProfile = async () => {
            const res = await userAuthApis.get(endpoints["user-profile"]);
            const user = res.data.data;

            setUserDetail(user);

            setForm({
                name: user.name ?? "",
                phone: user.phone ?? "",
            });

            setAvatarPreview(user.avatar_url);
        };

        loadProfile();
    }, []);

    // ===== Submit update =====
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("phone", form.phone);

            if (avatar) {
                formData.append("avatar", avatar);
            }

            await userAuthApis.put(endpoints["user-profile"], formData);

            alert("Profile updated successfully!");

            loadMe(); 
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!userDetail) return null;

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 space-y-6 w-full max-w-3xl mx-auto"
        >
            <h2 className="text-lg font-semibold border-b pb-3">
                My Profile
            </h2>

            {/* ===== READ ONLY INFO ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <Input label="ID" value={String(userDetail.id)} disabled />
                <Input
                    label="Email"
                    value={userDetail.email}
                    disabled
                />
                <Input
                    label="Role"
                    value={userDetail.role}
                    disabled
                />
                <Input
                    label="Email verified at"
                    value={userDetail.email_verified_at ?? "—"}
                    disabled
                />
                <Input
                    label="Created at"
                    value={userDetail.created_at}
                    disabled
                />
                <Input
                    label="Updated at"
                    value={userDetail.updated_at}
                    disabled
                />
            </div>

            {/* Name */}
            <Input
                label="Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                error={errors.name?.[0]}
            />

            {/* Phone */}
            <Input
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                error={errors.phone?.[0]}
            />

            {/* Avatar */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Avatar</label>
                <div className="flex items-center gap-4">
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            className="w-24 h-24 rounded-full object-cover border"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full border flex items-center justify-center text-gray-400">
                            No image
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setAvatar(file);
                            setAvatarPreview(
                                file
                                    ? URL.createObjectURL(file)
                                    : avatarPreview
                            );
                        }}
                    />
                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    disabled={loading}
                    className="px-6 py-2 rounded-md bg-slate-900 text-white disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Update profile"}
                </button>
            </div>
        </form>
    );
}