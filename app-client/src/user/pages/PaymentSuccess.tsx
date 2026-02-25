import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { userAuthApis, endpoints } from "../../shared/api/apis";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const paymentId = searchParams.get("payment_id");

    const [payment, setPayment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                if (!paymentId) return;

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

        fetchPayment();
    }, [paymentId]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-lg">Đang kiểm tra thanh toán...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
            <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center space-y-6">
                <div className="text-6xl">🎉</div>

                <h1 className="text-2xl font-bold text-green-600">
                    Thanh toán thành công
                </h1>

                {payment && (
                    <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                        <p>
                            <span className="font-medium">Mã thanh toán:</span>{" "}
                            #{payment.id}
                        </p>
                        <p>
                            <span className="font-medium">Số tiền:</span>{" "}
                            {Number(payment.amount).toLocaleString()} VND
                        </p>
                        <p className="text-green-600 font-semibold">
                            Trạng thái: {payment.status}
                        </p>
                    </div>
                )}

                <button
                    onClick={() => navigate("/")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                >
                    Về trang chủ
                </button>
            </div>
        </div>
    );
}