import { useEffect, useState } from "react";
import { adminAuthApis, endpoints } from "../../../shared/api/apis";
import type { TableActionType } from "../../../shared/type/others/tableActionType";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../../shared/components/Input";
import type { UserFormState } from "../../../shared/type/user/userFormState";
import type { UserDetail } from "../../../shared/type/user/userDetail";

export default function UserForm({ type }: { type: TableActionType }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<UserFormState>({
        name: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
        password_confirmation: "",
    });

    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);

    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [confirmError, setConfirmError] = useState<string | null>(null);

    // ===== validate password =====
    useEffect(() => {
        if (!form.password_confirmation) {
            setConfirmError(null);
            return;
        }

        setConfirmError(
            form.password !== form.password_confirmation
                ? "Password confirmation does not match"
                : null
        );
    }, [form.password, form.password_confirmation]);

    // ===== load user when edit =====
    useEffect(() => {
        if (type !== "edit" || !id) return;

        const loadUser = async () => {
            const res = await adminAuthApis.get(
                endpoints["user-detail"](Number(id))
            );

            const user = res.data.data;
            setUserDetail(user);

            setForm({
                name: user.name ?? "",
                email: user.email ?? "",
                phone: user.phone ?? "",
                role: user.role,
                password: "",
                password_confirmation: "",
            });

            setAvatarPreview(user.avatar_url);
        };

        loadUser();
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
                    type === "edit" &&
                    (key === "password" || key === "password_confirmation") &&
                    !value
                ) {
                    return;
                }
                formData.append(key, value);
            });

            if (avatar) {
                formData.append("avatar", avatar);
            }

            if (type === "create") {
                await adminAuthApis.post(endpoints["users"], formData);
            } else {
                await adminAuthApis.put(
                    endpoints["user-detail"](Number(id)),
                    formData
                );
            }

            alert(type === "create"
                ? "User created successfully!"
                : "User updated successfully"
            );

            navigate("/admin/users");
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
                {type === "create" ? "Add user" : "Edit user"}
            </h2>

            {/* ===== READ ONLY INFO (edit only) ===== */}
            {type === "edit" && userDetail && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <Input label="ID" value={String(userDetail.id)} disabled />
                    <Input
                        label="Email verified at"
                        value={userDetail.email_verified_at ?? "—"}
                        disabled
                    />
                    <Input label="Created at" value={userDetail.created_at} disabled />
                    <Input label="Updated at" value={userDetail.updated_at} disabled />
                </div>
            )}

            {/* Name */}
            <Input
                label="Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                error={errors.name?.[0]}
            />

            {/* Email */}
            <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                error={errors.email?.[0]}
            />

            {/* Phone */}
            <Input
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                error={errors.phone?.[0]}
            />

            {/* Role */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Role</label>
                <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={form.role}
                    onChange={(e) =>
                        setForm({ ...form, role: e.target.value as any })
                    }
                >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={(v) =>
                        setForm({ ...form, password: v })
                    }
                />

                <Input
                    label="Confirm password"
                    type="password"
                    value={form.password_confirmation}
                    onChange={(v) =>
                        setForm({ ...form, password_confirmation: v })
                    }
                    error={confirmError ?? undefined}
                />
            </div>

            {/* Avatar */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Avatar</label>
                <div className="flex items-center gap-4">
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            className="w-20 h-20 rounded-full object-cover border"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full border flex items-center justify-center text-gray-400">
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
                                file ? URL.createObjectURL(file) : avatarPreview
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
                    {loading
                        ? "Saving..."
                        : type === "create"
                            ? "Create user"
                            : "Update user"}
                </button>
            </div>
        </form>
    );
}
