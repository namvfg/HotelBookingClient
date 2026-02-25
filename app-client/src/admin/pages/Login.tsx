import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/admin-auth/useAdminAuth";

export default function AdminLogin() {
    const { login, state } = useAdminAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
        navigate("/admin", { replace: true });
    };

    useEffect(() => {
        if (state.isAuthenticated) {
            navigate("/admin");
        }
    }, [state.isAuthenticated]);

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-sm bg-white p-6 rounded-xl shadow"
                >
                    <h1 className="text-xl font-semibold mb-4 text-center">
                        Admin Login
                    </h1>

                    {state.error && (
                        <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
                            {state.error}
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            className="mt-1 w-full border rounded px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-sm font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            className="mt-1 w-full border rounded px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    <button
                        disabled={state.loading}
                        className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 disabled:opacity-60"
                    >
                        {state.loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </>
    )
}