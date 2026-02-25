import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { AdminProvider } from "../context/AdminProvider";
import { useAdminAuth } from "../context/admin-auth/useAdminAuth";
import { useEffect } from "react";

export default function AdminLayout() {

    const { state } = useAdminAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (state.initialized && !state.isAuthenticated) {
            navigate("/admin/login", {
                replace: true,
                state: { from: location.pathname },
            });
        }
    }, [state.initialized, state.isAuthenticated]);

    if (!state.initialized) {
        return <div className="h-screen flex items-center justify-center">
            Checking authentication...
        </div>;
    }


    if (state.loading) {
        return <div>Loading ...</div>
    }

    return (
        <AdminProvider>
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex flex-col flex-1">
                    <Header />
                    <main className="p-6 bg-gray-100 flex-1 overflow-y-auto">
                        <div className="mx-auto w-full max-w-7xl max-h-screen">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </AdminProvider>
    );
}