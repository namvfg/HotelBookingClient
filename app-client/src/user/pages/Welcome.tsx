import { Link } from "react-router-dom";
import bgImage from "@/assets/images/hotelbanner.jpg";

const Welcome = () => {
    return (
        <div
            className="relative min-h-[80vh] bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-black/10" />

            {/* Content */}
            <div className="relative text-center text-white max-w-xl px-6">
                <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
                    Chào mừng đến với HotelBooking
                </h1>

                <p className="text-gray-200 mb-8 drop-shadow">
                    Đặt phòng khách sạn nhanh chóng, tiện lợi và giá tốt
                </p>

                <Link
                    to="/home"
                    className="inline-block px-6 py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg"
                >
                    Khám phá ngay
                </Link>
            </div>
        </div>
    );
};

export default Welcome;
