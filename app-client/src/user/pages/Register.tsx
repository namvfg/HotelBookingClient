import { useEffect, useState } from "react";
import apis, { endpoints } from "../../shared/api/apis";
import bgImage from "@/assets/images/hotelbanner.jpg";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/user-auth/useUserAuth";

interface RegisterForm {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    avatar: File | null;
    is_manager: boolean;
    note: string;
}

interface ValidationErrors {
    [key: string]: string[];
}

export default function Register() {
    const [form, setForm] = useState<RegisterForm>({
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        avatar: null,
        is_manager: false,
        note: "",
    });

    const navigate = useNavigate();
    const { state } = useUserAuth();

    const [preview, setPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (state.isAuthenticated) {
            navigate("/");
        }
    }, [state.isAuthenticated, navigate]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "file") {
            const fileInput = e.target as HTMLInputElement;
            const file = fileInput.files?.[0] || null;

            setForm({ ...form, avatar: file });

            if (file) {
                setPreview(URL.createObjectURL(file));
            }
        } else if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setForm({ ...form, [name]: checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        const formData = new FormData();

        Object.keys(form).forEach((key) => {
            const value = form[key as keyof RegisterForm];

            if (value !== null) {
                if (key === "is_manager") {
                    formData.append(key, form.is_manager ? "1" : "0");
                } else {
                    formData.append(key, value as string | Blob);
                }
            }
        });

        try {
            await apis.post(endpoints["register"], formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Register success");
            navigate("/login");
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                alert("Register failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field: string) =>
        `w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring ${errors[field]
            ? "border-red-500 focus:ring-red-200"
            : "focus:ring-blue-200"
        }`;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

                {/* LEFT - FORM */}
                <div className="p-10 flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold mb-2">
                        Create Account
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Join us and manage your bookings easily
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Avatar */}
                        <div>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Avatar preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                            No Avatar
                                        </div>
                                    )}
                                </div>

                                <label className="cursor-pointer text-sm text-blue-600 hover:underline">
                                    Upload Avatar
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {errors.avatar && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.avatar[0]}
                                </p>
                            )}
                        </div>

                        {/* Name */}
                        <div>
                            <input
                                className={inputClass("name")}
                                name="name"
                                placeholder="Name"
                                onChange={handleChange}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name[0]}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                className={inputClass("email")}
                                name="email"
                                type="email"
                                placeholder="Email"
                                onChange={handleChange}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email[0]}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <input
                                className={inputClass("phone")}
                                name="phone"
                                placeholder="Phone"
                                onChange={handleChange}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.phone[0]}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                className={inputClass("password")}
                                name="password"
                                type="password"
                                placeholder="Password"
                                onChange={handleChange}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password[0]}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <input
                                className={inputClass("password_confirmation")}
                                name="password_confirmation"
                                type="password"
                                placeholder="Confirm password"
                                onChange={handleChange}
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password_confirmation[0]}
                                </p>
                            )}
                        </div>

                        {/* Manager */}
                        <div>
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    name="is_manager"
                                    checked={form.is_manager}
                                    onChange={handleChange}
                                    className="rounded"
                                />
                                Register as manager
                            </label>
                        </div>

                        {form.is_manager && (
                            <div>
                                <textarea
                                    name="note"
                                    placeholder="Your experience / reason"
                                    onChange={handleChange}
                                    className={inputClass("note")}
                                />
                                {errors.note && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.note[0]}
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded-lg text-white transition ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                </div>

                {/* RIGHT - IMAGE */}
                <div className="relative hidden lg:block">
                    <img
                        src={bgImage}
                        alt="Hotel banner"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-10 left-10 text-white">
                        <h3 className="text-3xl font-bold">
                            Find your perfect stay
                        </h3>
                        <p className="mt-2 text-sm max-w-sm">
                            Hotels, rooms and management in one platform
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
