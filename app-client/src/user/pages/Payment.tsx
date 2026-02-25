import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { endpoints, userAuthApis } from "../../shared/api/apis";

export default function Payment() {
    const { paymentId } = useParams();

    const [payment, setPayment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [method, setMethod] = useState("vnpay");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const loadPayment = async () => {
            try {
                const res = await userAuthApis.get(
                    endpoints["payment-detail"](Number(paymentId))
                );
                setPayment(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (paymentId) loadPayment();
    }, [paymentId]);

    const handlePayment = async () => {
        try {
            setProcessing(true);

            const res = await userAuthApis.post(
                endpoints["payment-vnpay"](Number(paymentId))
            );

            window.location.href = res.data.payment_url;
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    if (loading)
        return <div className="p-10 text-center">Loading...</div>;

    if (!payment)
        return <div className="p-10 text-center">Payment not found</div>;

    const isPaid = payment.status === "success";

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-6">

                <h2 className="text-2xl font-bold text-gray-800 text-center">
                    Thanh toán đặt phòng
                </h2>

                {/* Booking Info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <p>
                        <span className="font-medium">Check-in:</span>{" "}
                        {payment.booking.checkin_date}
                    </p>
                    <p>
                        <span className="font-medium">Check-out:</span>{" "}
                        {payment.booking.checkout_date}
                    </p>
                    <p className="text-lg font-semibold text-red-600 pt-2">
                        {Number(payment.amount).toLocaleString()} VND
                    </p>
                </div>

                {/* Payment Method */}
                {!isPaid && (
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">
                            Chọn phương thức thanh toán
                        </p>

                        <label className="flex items-center gap-3 border p-3 rounded-xl cursor-pointer hover:border-blue-500">
                            <input
                                type="radio"
                                value="vnpay"
                                checked={method === "vnpay"}
                                onChange={() => setMethod("vnpay")}
                            />
                            <span className="font-medium">VNPAY</span>
                        </label>

                        <label className="flex items-center gap-3 border p-3 rounded-xl opacity-50 cursor-not-allowed">
                            <input type="radio" disabled />
                            <span>MoMo (Coming soon)</span>
                        </label>
                    </div>
                )}

                {/* Pay Button */}
                {!isPaid && (
                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        className={`w-full py-3 rounded-xl text-white font-semibold transition
                            ${processing
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {processing ? "Đang xử lý..." : "Thanh toán ngay"}
                    </button>
                )}

                {isPaid && (
                    <div className="text-center text-green-600 font-semibold">
                        Thanh toán đã hoàn tất
                    </div>
                )}
            </div>
        </div>
    );
}