import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints, userAuthApis } from "../../shared/api/apis";

interface Booking {
    id: number;
    user_name: string;
    room_code: string;
    checkin_date: string;
    checkout_date: string;
    total_price: string;
    payment_id: number | null;
    payment_status: string | null;
    status: string;
    created_at: string;
}

export default function MyBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const loadBookings = async () => {
        try {
            const res = await userAuthApis.get(endpoints["my-bookings"]);
            console.log(res)
            setBookings(res.data.data);
        } catch (err) {
            setError("Không thể tải danh sách đặt phòng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return "bg-green-100 text-green-600";
            case "PENDING":
                return "bg-yellow-100 text-yellow-600";
            case "CANCELLED":
                return "bg-red-100 text-red-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    if (loading)
        return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold mb-8">
                    Đặt phòng của tôi
                </h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {bookings.length === 0 && (
                    <div className="text-gray-500">
                        Bạn chưa có booking nào.
                    </div>
                )}

                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="bg-white shadow-md rounded-2xl p-6 flex justify-between items-center"
                        >
                            {/* LEFT */}
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold">
                                    Phòng: {booking.room_code}
                                </h2>

                                <p className="text-sm text-gray-600">
                                    {booking.checkin_date} → {booking.checkout_date}
                                </p>

                                <p className="text-sm font-medium">
                                    Tổng tiền:{" "}
                                    {Number(booking.total_price).toLocaleString()} VND
                                </p>

                                <div className="flex gap-2 text-xs">
                                    <span
                                        className={`px-2 py-1 rounded-full font-medium ${getStatusStyle(
                                            booking.status
                                        )}`}
                                    >
                                        {booking.status}
                                    </span>

                                    {booking.payment_status && (
                                        <span
                                            className={`px-2 py-1 rounded-full font-medium ${getStatusStyle(
                                                booking.payment_status
                                            )}`}
                                        >
                                            Payment: {booking.payment_status}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-gray-400">
                                    Đặt ngày:{" "}
                                    {new Date(
                                        booking.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            {/* RIGHT ACTION */}
                            <div className="flex flex-col gap-3">

                                {(booking.status === "pending") && (
                                    <button
                                        onClick={() => {
                                            if (booking.payment_id) {
                                                navigate(`/payments/${booking.payment_id}`);
                                            } else {
                                                alert("Chưa có payment cho booking này");
                                            }
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm"
                                    >
                                        Thanh toán ngay
                                    </button>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}