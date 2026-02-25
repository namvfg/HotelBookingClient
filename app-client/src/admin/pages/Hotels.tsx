import { useEffect, useState } from "react";
import { adminAuthApis, endpoints } from "../../shared/api/apis";
import type { Hotel } from "../../shared/type/hotel/hotel";
import { useAdminContext } from "../context/userAdminContext";
import { highlightText } from "../../shared/utils/highlight";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../shared/components/Pagination";

export default function Hotels() {

    const { keyword } = useAdminContext();
    const navigate = useNavigate();

    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setCurrentPage(1);
    }, [keyword]);

    const loadData = async () => {
        const res = await adminAuthApis.get(endpoints["hotels"], {
            params: {
                page: currentPage,
                search: keyword,
            }
        });

        setHotels(res.data.data);
        setLastPage(res.data.meta.last_page);
        setLoading(false);
    };

    const handleDeleteHotel = async (hotelId: number) => {
        const confirmed = window.confirm(
            "Are you sure to delete this hotel?"
        );
        if (!confirmed) return;

        try {
            await adminAuthApis.delete(
                endpoints["hotel-detail"](hotelId)
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
                <h1 className="text-lg font-semibold">Hotels</h1>
                <button
                    onClick={() => navigate("/admin/hotels/add")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md
                        bg-slate-900 text-white text-sm
                        hover:bg-slate-800 transition"
                >
                    <Plus size={16} />
                    Add Hotel
                </button>
            </div>

            {/* Table */}
            <table className="w-full table-fixed border-collapse">
                <thead className="sticky top-0 z-10 bg-gray-50 border-b">
                    <tr>
                        <th className="w-10 px-4 py-3 text-left">ID</th>
                        <th className="w-60 px-4 py-3 text-left">Name</th>
                        <th className="w-30 px-4 py-3 text-left">Manager</th>
                        <th className="w-40 px-4 py-3 text-left">City</th>
                        <th className="w-40 px-4 py-3 text-left">Country</th>
                        <th className="w-20 px-4 py-3 text-left">Status</th>
                        <th className="w-32 px-4 py-3 text-left">Created at</th>
                        <th className="w-36 px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {hotels.map((hotel) => (
                        <tr
                            key={hotel.id}
                            className="border-b hover:bg-gray-50 transition"
                        >
                            <td className="px-4 py-3">{hotel.id}</td>

                            <td className="px-4 py-3 font-medium truncate">
                                {highlightText(hotel.name, keyword)}
                            </td>

                            <td className="px-4 py-3 truncate">
                                {highlightText(hotel.manager_name ?? "-", keyword)}
                            </td>

                            <td className="px-4 py-3">
                                {highlightText(hotel.city, keyword)}
                            </td>

                            <td className="px-4 py-3">
                                {highlightText(hotel.country, keyword)}
                            </td>

                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center px-2.5 py-1
                                        text-xs font-medium rounded-full ring-1 ring-inset
                                        ${hotel.is_active
                                            ? "bg-green-50 text-green-700 ring-green-600/20"
                                            : "bg-red-50 text-red-700 ring-red-600/20"
                                        }`}
                                >
                                    {hotel.is_active ? "Active" : "Inactive"}
                                </span>
                            </td>

                            <td className="px-4 py-3 text-gray-500">
                                {hotel.created_at}
                            </td>

                            <td className="px-4 py-3 text-right">
                                <div className="inline-flex items-center gap-1">
                                    {/* Edit */}
                                    <button
                                        onClick={() =>
                                            navigate(`/admin/hotels/${hotel.id}/edit`)
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
                                        onClick={() => handleDeleteHotel(hotel.id)}
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
