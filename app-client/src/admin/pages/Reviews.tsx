import { useEffect, useState } from "react";
import { adminAuthApis, endpoints } from "../../shared/api/apis";
import { useAdminContext } from "../context/userAdminContext";
import { highlightText } from "../../shared/utils/highlight";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../shared/components/Pagination";
import type { Review } from "../../shared/type/review/review";
import { formatDate } from "../../shared/utils/formatDate";

export default function Reviews() {

    const { keyword } = useAdminContext();
    const navigate = useNavigate();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setCurrentPage(1);
    }, [keyword]);

    const loadData = async () => {
        const res = await adminAuthApis.get(endpoints["reviews"], {
            params: {
                page: currentPage,
                search: keyword,
            }
        });

        setReviews(res.data.data);
        setLastPage(res.data.meta.last_page);
        setLoading(false);
    };

    const handleDeleteReview= async (reviewId: number) => {
        const confirmed = window.confirm(
            "Are you sure to delete this review?"
        );
        if (!confirmed) return;

        try {
            await adminAuthApis.delete(
                endpoints["review-detail"](reviewId)
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
                <h1 className="text-lg font-semibold">Reviews</h1>
                <button
                    onClick={() => navigate("/admin/reviews/add")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md
                        bg-slate-900 text-white text-sm
                        hover:bg-slate-800 transition"
                >
                    <Plus size={16} />
                    Add Review
                </button>
            </div>

            {/* Table */}
            <table className="w-full table-fixed border-collapse">
                <thead className="sticky top-0 z-10 bg-gray-50 border-b">
                    <tr>
                        <th className="w-10 px-4 py-3 text-left">ID</th>
                        <th className="w-40 px-4 py-3 text-left">User Name</th>
                        <th className="w-50 px-4 py-3 text-left">Hotel Name</th>
                        <th className="w-20 px-4 py-3 text-left">Rating</th>
                        <th className="w-60 px-4 py-3 text-left">Comment</th>
                        <th className="w-32 px-4 py-3 text-left">Created at</th>
                        <th className="w-36 px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {reviews.map((review) => (
                        <tr
                            key={review.id}
                            className="border-b hover:bg-gray-50 transition"
                        >
                            <td className="px-4 py-3">{review.id}</td>

                            <td className="px-4 py-3 font-medium truncate">
                                {highlightText(review.user_name, keyword)}
                            </td>

                            <td className="px-4 py-3 truncate">
                                {highlightText(review.hotel_name, keyword)}
                            </td>

                            <td className="px-4 py-3">
                                {review.rating}
                            </td>

                            <td className="px-4 py-3">
                                {highlightText(review.comment, keyword)}
                            </td>

                            <td className="px-4 py-3 text-gray-500">
                                {formatDate(review.created_at)}
                            </td>

                            <td className="px-4 py-3 text-right">
                                <div className="inline-flex items-center gap-1">
                                    {/* Edit */}
                                    <button
                                        onClick={() =>
                                            navigate(`/admin/reviews/${review.id}/edit`)
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
                                        onClick={() => handleDeleteReview(review.id)}
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
