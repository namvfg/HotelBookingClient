import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/user-auth/useUserAuth";
import { endpoints, userAuthApis } from "../../shared/api/apis";

export default function Booking() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { state } = useUserAuth();

    const [room, setRoom] = useState<any | null>(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [loadingRoom, setLoadingRoom] = useState(true);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [loadingBooking, setLoadingBooking] = useState(false);
    const [error, setError] = useState("");

    // =============================
    // Helpers
    // =============================

    const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const addDays = (date: Date, days: number) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    };

    const isSameDate = (d1: Date, d2: Date) =>
        formatDate(d1) === formatDate(d2);

    const isBetween = (date: Date, start: Date, end: Date) =>
        formatDate(date) >= formatDate(start) &&
        formatDate(date) <= formatDate(end);

    // =============================
    // Redirect nếu chưa login
    // =============================

    useEffect(() => {
        if (!state.isAuthenticated) {
            navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
        }
    }, [state.isAuthenticated, navigate]);

    // =============================
    // Load room detail
    // =============================

    useEffect(() => {
        if (!roomId) return;

        const loadRoom = async () => {
            try {
                const res = await userAuthApis.get(
                    endpoints["room-availability"](Number(roomId))
                );

                const data = res.data.data;
                setRoom(data);
                setSelectedImage(data.images?.[0]?.url);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingRoom(false);
            }
        };

        loadRoom();
    }, [roomId]);

    // =============================
    // Calendar logic
    // =============================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = Array.from({ length: 30 }, (_, i) =>
        addDays(today, i)
    );

    const isBooked = (date: Date) => {
        if (!room?.booked_dates) return false;

        const current = formatDate(date);

        return room.booked_dates.some((range: any) => {
            return (
                current >= range.from &&
                current <= range.to
            );
        });
    };

    const handleSelectDate = (date: Date) => {
        if (isBooked(date)) return;

        // Nếu chưa chọn gì → set start
        if (!startDate && !endDate) {
            setStartDate(date);
            return;
        }

        // Nếu đã có start nhưng chưa có end
        if (startDate && !endDate) {

            // Nếu click ngày trước start → đổi start
            if (formatDate(date) < formatDate(startDate)) {
                setStartDate(date);
                return;
            }

            // Nếu click cùng ngày → booking 1 ngày
            if (isSameDate(date, startDate)) {
                setEndDate(date);
                return;
            }

            // Kiểm tra khoảng giữa có ngày bị booked không
            const current = new Date(startDate);
            while (formatDate(current) <= formatDate(date)) {
                if (isBooked(current)) return;
                current.setDate(current.getDate() + 1);
            }

            setEndDate(date);
            return;
        }

        // Nếu đã có cả start và end → bắt đầu chọn lại từ đầu
        setStartDate(date);
        setEndDate(null);
    };

    const handleClear = () => {
        setStartDate(null);
        setEndDate(null);
    };

    // =============================
    // Handle booking
    // =============================

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            setError("Vui lòng chọn ngày bắt đầu và kết thúc");
            return;
        }

        setLoadingBooking(true);
        setError("");

        try {
            const res = await userAuthApis.post(endpoints["bookings"], {
                room_id: room?.id,
                checkin_date: formatDate(startDate) + " 00:00:00",
                checkout_date: formatDate(endDate) + " 23:59:59",
            });

            alert("Đặt phòng thành công");
            navigate(`/payments/${res.data.data.payment.id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Đặt phòng thất bại");
        } finally {
            setLoadingBooking(false);
        }
    };

    // =============================
    // Render
    // =============================

    if (loadingRoom) return <div>Loading room...</div>;
    if (!room) return <div>Room not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">

                <div>
                    <div className="overflow-hidden rounded-2xl shadow-lg">
                        <img
                            src={selectedImage}
                            alt="Room"
                            className="w-full h-[420px] object-cover"
                        />
                    </div>

                    <div className="flex gap-3 mt-4">
                        {room.images.map((img: any) => (
                            <img
                                key={img.id}
                                src={img.url}
                                alt="Thumbnail"
                                onClick={() => setSelectedImage(img.url)}
                                className={`w-24 h-24 object-cover cursor-pointer rounded-xl border-2
                                ${selectedImage === img.url
                                        ? "border-blue-600"
                                        : "border-transparent opacity-70 hover:opacity-100"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-6">

                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {room.room_type}
                        </h2>

                        <p className="text-2xl font-semibold text-blue-600">
                            {room.base_price.toLocaleString()} VND
                            <span className="text-gray-500 text-base font-normal">
                                {" "} / đêm
                            </span>
                        </p>
                    </div>

                    <form
                        onSubmit={handleBooking}
                        className="bg-white p-6 rounded-2xl shadow-md space-y-5"
                    >
                        <h3 className="text-xl font-semibold text-gray-800">
                            Chọn ngày đặt phòng
                        </h3>

                        <div className="grid grid-cols-7 gap-2">
                            {days.map((day) => {
                                const booked = isBooked(day);

                                const selected =
                                    startDate &&
                                    (isSameDate(day, startDate) ||
                                        (startDate &&
                                            endDate &&
                                            isBetween(day, startDate, endDate)));

                                return (
                                    <button
                                        type="button"
                                        key={formatDate(day)}
                                        onClick={() => handleSelectDate(day)}
                                        disabled={booked}
                                        className={`
                                            p-2 rounded-lg text-sm transition
                                            ${booked
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : selected
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 hover:bg-blue-100"
                                            }
                                        `}
                                    >
                                        {day.getDate()}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                Clear
                            </button>

                            {startDate && endDate && (
                                <div className="text-sm text-gray-600">
                                    {formatDate(startDate)} → {formatDate(endDate)}
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loadingBooking}
                            className={`w-full py-3 rounded-xl text-white font-medium transition duration-300
                                ${loadingBooking
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loadingBooking ? "Đang xử lý..." : "Xác nhận đặt phòng"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
