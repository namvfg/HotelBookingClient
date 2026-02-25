import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, BedDouble, LogOut, Hotel, Type, Star, Factory } from "lucide-react";
import { useAdminAuth } from "../context/admin-auth/useAdminAuth";


const menus = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/hotels", label: "Hotels", icon: Hotel },
    { to: "/admin/rooms", label: "Rooms", icon: BedDouble },
    { to: "/admin/room-types", label: "Room Types", icon: Type },
    { to: "/admin/reviews", label: "Reviews", icon: Star},
    { to: "/admin/amenities", label: "Amenities", icon: Factory},
];

export default function Sidebar() {

    const { logout } = useAdminAuth();

    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col">
            <div className="h-16 flex items-center px-6 text-xl font-bold border-b border-slate-700">
                Admin Panel
            </div>


            <nav className="flex-1 px-3 py-4 space-y-1">
                {menus.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition ${isActive
                                ? "bg-slate-700"
                                : "text-slate-300 hover:bg-slate-800"
                            }`
                        }
                    >
                        <item.icon size={18} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>


            <button onClick={logout} className="flex items-center gap-3 px-6 py-4 text-sm text-slate-300 hover:bg-slate-800">
                <LogOut size={18} /> Logout
            </button>
        </aside>
    );
}