import { Outlet } from "react-router-dom";
import { AdminAuthProvider } from "../context/admin-auth/AdminAuthProvider";

export default function AdminCleanLayout() {
    
    return (
        <AdminAuthProvider>
            <Outlet/>
        </AdminAuthProvider>
    )
}