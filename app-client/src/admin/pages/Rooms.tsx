import { useEffect, useState } from "react";
import { adminAuthApis, endpoints } from "../../shared/api/apis";
import { useAdminContext } from "../context/userAdminContext";
import { highlightText } from "../../shared/utils/highlight";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../shared/components/Pagination";
import type { Room } from "../../shared/type/room/room";
import { formatDate } from "../../shared/utils/formatDate";

export default function Rooms() {

    const { keyword } = useAdminContext();
    const navigate = useNavigate();

    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setCurrentPage(1);
    }, [keyword]);

    const loadData = async () => {
        const res = await adminAuthApis.get(endpoints["rooms"], {
            params: {
                page: currentPage,
                search: keyword,
            }
        });

        console.log(res)

        setRooms(res.data.data);
        setLastPage(res.data.meta.last_page);
        setLoading(false);
    };

    const handleDeleteRoom = async (roomId: number) => {
        const confirmed = window.confirm(
            "Are you sure to delete this room?"
        );
        if (!confirmed) return;

        try {
            await adminAuthApis.delete(
                endpoints["room-detail"](roomId)
            );
            await loadData();
        } catch (err) {
            alert("Delete failed");
            console.error(err);
        }
    };

    useEffect(() => {
        loadData();
    }, [currentPage, keyword]);

    if (loading) return <p>Loading ...</p>;

    return (
        <div className="relative overflow-x-auto">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
                <h1 className="text-lg font-semibold">Rooms</h1>
                <button
                    onClick={() => navigate("/admin/rooms/add")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md
                        bg-slate-900 text-white text-sm
                        hover:bg-slate-800 transition"
                >
                    <Plus size={16} />
                    Add Room
                </button>
            </div>

            {/* Table */}
            <table className="w-full table-fixed border-collapse">
                <thead className="sticky top-0 z-10 bg-gray-50 border-b">
                    <tr>
                        <th className="w-10 px-4 py-3 text-left">ID</th>
                        <th className="w-30 px-4 py-3 text-left">Room Code</th>
                        <th className="w-40 px-4 py-3 text-left">Hotel</th>
                        <th className="w-40 px-4 py-3 text-left">Room Type</th>
                        <th className="w-32 px-4 py-3 text-left">Created at</th>
                        <th className="w-36 px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {rooms.map((room) => (
                        <tr
                            key={room.id}
                            className="border-b hover:bg-gray-50 transition"
                        >
                            <td className="px-4 py-3">{room.id}</td>

                            <td className="px-4 py-3 font-medium truncate">
                                {highlightText(room.room_code, keyword)}
                            </td>

                            <td className="px-4 py-3 truncate">
                                {highlightText(room.hotel_name ?? "-", keyword)}
                            </td>

                            <td className="px-4 py-3 truncate">
                                {highlightText(room.room_type_name ?? "-", keyword)}
                            </td>

                            <td className="px-4 py-3 text-gray-500">
                                {formatDate(room.created_at)}
                            </td>

                            <td className="px-4 py-3 text-right">
                                <div className="inline-flex items-center gap-1">
                                    {/* Edit */}
                                    <button
                                        onClick={() =>
                                            navigate(`/admin/rooms/${room.id}/edit`)
                                        }
                                        className="inline-flex items-center gap-1 px-3 py-1.5
                                            text-xs rounded-md border
                                            hover:bg-slate-900 hover:text-white transition"
                                    >
                                        <Pencil size={14} />
                                        Edit
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDeleteRoom(room.id)}
                                        className="inline-flex items-center gap-1 px-3 py-1.5
                                            text-xs rounded-md border border-red-500 text-red-600
                                            hover:bg-red-500 hover:text-white transition"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={(page: number) => setCurrentPage(page)}
            />
        </div>
    );
}
