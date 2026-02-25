import { useEffect, useState } from "react";
import { adminAuthApis, endpoints } from "../../shared/api/apis";
import type { User } from "../../shared/type/user/user";
import { formatDate } from "../../shared/utils/formatDate";
import { useAdminContext } from "../context/userAdminContext";
import { highlightText } from "../../shared/utils/highlight";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { getRoleBadge } from "../../shared/utils/roleBadge";
import { useNavigate } from "react-router-dom";
import Pagination from "../../shared/components/Pagination";

export default function Users() {

    const { keyword } = useAdminContext();
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setCurrentPage(1);
    }, [keyword]);

    const loadData = async () => {
        const res = await adminAuthApis.get(endpoints["users"], {
            params: {
                page: currentPage,
                search: keyword,
            }
        });
        setUsers(res.data.data);
        setLastPage(res.data.meta.last_page);
        setLoading(false);
    }

    const handleDeleteUser = async (userId: number) => {
        const confirmed = window.confirm(
            "Are you sure to delete this user?"
        );
        if (!confirmed) return;

        try {
            await adminAuthApis.delete(endpoints["user-detail"](userId));
            await loadData();
        } catch (err: any) {
            alert("Delete failed");
            console.error(err);
        }
    }

    useEffect(() => {
        loadData();
    }, [currentPage, keyword]);

    if (loading) return <p>Loading ...</p>

    return (
        <>
            <div className="relative overflow-x-auto">
                <div className="p-4 border-b flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Users</h1>
                    <button onClick={() => navigate("/admin/users/add")}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900 text-white text-sm hover:bg-slate-800 transition">
                        <Plus size={16} />
                        Add User
                    </button>
                </div>
                <table className="w-full table-fixed border-collapse">
                    <thead className="sticky top-0 z-10 bg-gray-50 border-b">
                        <tr>
                            <th className="w-10 px-4 py-3 text-left">ID</th>
                            <th className="w-50 px-4 py-3 text-left">Name</th>
                            <th className="w-60 px-4 py-3 text-left">Email</th>
                            <th className="w-40 px-4 py-3 text-left">Phone</th>
                            <th className="w-15 px-4 py-3 text-left">Role</th>
                            <th className="w-25 px-4 py-3 text-left">Created at</th>
                            <th className="w-32 px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3">{user.id}</td>

                                <td className="px-4 py-3 truncate font-medium">
                                    {highlightText(user.name, keyword)}
                                </td>

                                <td className="px-4 py-3 truncate">
                                    {highlightText(user.email, keyword)}
                                </td>

                                <td className="px-4 py-3">
                                    {highlightText(user.phone, keyword)}
                                </td>

                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1
                                            text-xs font-medium rounded-full
                                            ring-1 ring-inset ${getRoleBadge(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-gray-500">
                                    {formatDate(user.created_at)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="inline-flex items-center gap-1">
                                        {/* Edit */}
                                        <button
                                            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5
                                                text-xs rounded-md border
                                                hover:bg-slate-900 hover:text-white
                                                transition">
                                            <Pencil size={14} />
                                            Edit
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5
                                                text-xs rounded-md border border-red-500 text-red-600
                                                hover:bg-red-500 hover:text-white
                                                transition">
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={setCurrentPage}
                />

            </div>
        </>
    );
}