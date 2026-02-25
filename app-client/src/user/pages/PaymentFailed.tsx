import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentFailed() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const paymentId = searchParams.get("payment_id");

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
            <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center space-y-6">
                <div className="text-6xl">❌</div>

                <h1 className="text-2xl font-bold text-red-600">
                    Thanh toán thất bại
                </h1>

                <p className="text-gray-600">
                    Giao dịch không thành công hoặc đã bị hủy.
                </p>

                {paymentId && (
                    <p className="text-sm text-gray-500">
                        Mã thanh toán: #{paymentId}
                    </p>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/payments/${paymentId}`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                        Thử lại
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl font-semibold transition"
                    >
                        Trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
}