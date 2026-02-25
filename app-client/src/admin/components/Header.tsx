import { useEffect, useState } from "react";
import { useAdminContext } from "../context/userAdminContext";
import { useAdminAuth } from "../context/admin-auth/useAdminAuth";

export default function Header() {
    const { keyword, setKeyword } = useAdminContext();
    const [value, setValue] = useState("");
    const { state } = useAdminAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            setKeyword(value.trim());
        }, 400)

        return () => clearTimeout(timer);
    }, [value, setKeyword]);

    return (
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
            <div className="flex justify-center items-center gap-5 my-5">
                <h2 className="font-semibold text-lg">Dashboard</h2>

                <div className="relative w-72">
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        type="text"
                        placeholder="Search name, email, phone..."
                        className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                    />

                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M21 21l-4.35-4.35" />
                        <circle cx="11" cy="11" r="7" />
                    </svg>
                </div>
            </div>
            {state.user && (
                <div className="flex items-center gap-3">
                    <span className="text-sm">{state.user.name}</span>
                    <img
                        src={state.user.avatar_url}
                        className="w-9 h-9 rounded-full"
                    />
                </div>
            )}
        </header>
    );
}