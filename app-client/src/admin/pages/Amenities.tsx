import { useEffect, useState } from "react";
import { adminAuthApis, endpoints } from "../../shared/api/apis";
import { formatDate } from "../../shared/utils/formatDate";
import { useAdminContext } from "../context/userAdminContext";
import { highlightText } from "../../shared/utils/highlight";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../shared/components/Pagination";
import type { Amenity } from "../../shared/type/amentity/amentity";

export default function Amentities() {

    const { keyword } = useAdminContext();
    const navigate = useNavigate();

    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setCurrentPage(1);
    }, [keyword]);

    const loadData = async () => {
        const res = await adminAuthApis.get(endpoints["amenities"], {
            params: {
                page: currentPage,
                search: keyword,
            }
        });
        setAmenities(res.data.data);
        setLastPage(res.data.meta.last_page);
        setLoading(false);
    }

    const handleDeleteAmenity = async (amenityId: number) => {
        const confirmed = window.confirm(
            "Are you sure to delete this amenity?"
        );
        if (!confirmed) return;

        try {
            await adminAuthApis.delete(endpoints["amenity-detail"](amenityId));
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
                    <h1 className="text-lg font-semibold">Amenities</h1>
                    <button onClick={() => navigate("/admin/amenities/add")}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900 text-white text-sm hover:bg-slate-800 transition">
                        <Plus size={16} />
                        Add Amenity
                    </button>
                </div>
                <table className="w-full table-fixed border-collapse">
                    <thead className="sticky top-0 z-10 bg-gray-50 border-b">
                        <tr>
                            <th className="w-10 px-4 py-3 text-left">ID</th>
                            <th className="w-50 px-4 py-3 text-left">Name</th>
                            <th className="w-60 px-4 py-3 text-left">Slug</th>
                            <th className="w-25 px-4 py-3 text-left">Created at</th>
                            <th className="w-32 px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {amenities.map((amenity) => (
                            <tr
                                key={amenity.id}
                                className="border-b hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3">{amenity.id}</td>

                                <td className="px-4 py-3 truncate font-medium">
                                    {highlightText(amenity.name, keyword)}
                                </td>

                                <td className="px-4 py-3 truncate">
                                    {highlightText(amenity.slug, keyword)}
                                </td>

                                <td className="px-4 py-3 text-gray-500">
                                    {formatDate(amenity.created_at)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="inline-flex items-center gap-1">
                                        {/* Edit */}
                                        <button
                                            onClick={() => navigate(`/admin/amenities/${amenity.id}/edit`)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5
                                                text-xs rounded-md border
                                                hover:bg-slate-900 hover:text-white
                                                transition">
                                            <Pencil size={14} />
                                            Edit
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDeleteAmenity(amenity.id)}
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