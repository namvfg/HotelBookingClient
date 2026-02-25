import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-6 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">
                            HotelBooking
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Nền tảng đặt phòng khách sạn trực tuyến giúp bạn
                            tìm kiếm và đặt phòng nhanh chóng, an toàn và tiện lợi.
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
                            Khám phá
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/home" className="hover:text-white transition">
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link to="/hotels" className="hover:text-white transition">
                                    Khách sạn
                                </Link>
                            </li>
                            <li>
                                <Link to="/bookings" className="hover:text-white transition">
                                    Đặt phòng
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
                            Hỗ trợ
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/contact" className="hover:text-white transition">
                                    Liên hệ
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-white transition">
                                    Câu hỏi thường gặp
                                </Link>
                            </li>
                            <li>
                                <Link to="/policy" className="hover:text-white transition">
                                    Chính sách & điều khoản
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
                            Liên hệ
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>Email: support@hotelbooking.com</li>
                            <li>Hotline: 1900 9999</li>
                            <li>Hỗ trợ 24/7</li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} HotelBooking. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
