import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import bgImage from "@/assets/images/hotelbanner.jpg";
import { useUserAuth } from "../context/user-auth/useUserAuth";

interface LoginErrors {
    [key: string]: string[];
}

export default function Login() {
    const { state, login } = useUserAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const next = searchParams.get("next") || "/home";

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<LoginErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            await login(form.email, form.password);
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            }
        }
    };

    useEffect(() => {
        if (state.isAuthenticated) {
            navigate(next, { replace: true });
        }
    }, [state.isAuthenticated, navigate, next]);

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
                        Welcome Back
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Login to manage your bookings
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email */}
                        <div>
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                className={inputClass("email")}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email[0]}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                className={inputClass("password")}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password[0]}
                                </p>
                            )}
                        </div>

                        {/* Auth error (vd sai password) */}
                        {state.error && (
                            <p className="text-red-500 text-sm">
                                {state.error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={state.loading}
                            className={`w-full py-2 rounded-lg text-white transition ${state.loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {state.loading ? "Logging in..." : "Login"}
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
