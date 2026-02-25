import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import apis, { endpoints } from "../../shared/api/apis";
import * as Slider from "@radix-ui/react-slider";

const HotelSearchResult = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilter, setShowFilter] = useState(true);
    const [totalHotels, setTotolHotels] = useState(0);

    // query params
    const city = searchParams.get("city") || "";
    const country = searchParams.get("country") || "";
    const keyword = searchParams.get("keyword") || "";
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || 1000000);
    const checkin = searchParams.get("checkin") || "";
    const checkout = searchParams.get("checkout") || "";

    // filter state
    const [filters, setFilters] = useState({
        city,
        country,
        keyword,
        minPrice,
        maxPrice,
        checkin,
        checkout,
    });

    useEffect(() => {
        const loadHotels = async () => {
            setLoading(true);
            try {
                const res = await apis.get(endpoints["search-hotels"], {
                    params: filters,
                });
                setHotels(res.data.data);
                setTotolHotels(res.data.meta.total)
            } catch (err) {
                console.error("Search hotels failed", err);
            } finally {
                setLoading(false);
            }
        };

        loadHotels();
    }, [searchParams]);

    const applyFilter = () => {
        const params: any = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== "" && value !== null) {
                params[key] = value;
            }
        });

        setSearchParams(params);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* SIDEBAR */}
                <aside className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow p-5">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="font-semibold mb-4 flex justify-between w-full"
                        >
                            Bộ lọc
                            <span>{showFilter ? "−" : "+"}</span>
                        </button>

                        {showFilter && (
                            <div className="space-y-4">
                                <input
                                    placeholder="Tên khách sạn"
                                    value={filters.keyword}
                                    onChange={(e) =>
                                        setFilters({ ...filters, keyword: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />

                                <input
                                    placeholder="Thành phố"
                                    value={filters.city}
                                    onChange={(e) =>
                                        setFilters({ ...filters, city: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />

                                <input
                                    placeholder="Quốc gia"
                                    value={filters.country}
                                    onChange={(e) =>
                                        setFilters({ ...filters, country: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />

                                {/* PRICE RANGE – 1 SLIDER 2 ĐẦU */}
                                <div>
                                    <label className="text-sm font-medium block mb-3">
                                        Khoảng giá (USD)
                                    </label>

                                    <Slider.Root
                                        min={0}
                                        max={1000000}
                                        step={1000}
                                        value={[filters.minPrice, filters.maxPrice]}
                                        onValueChange={([min, max]) =>
                                            setFilters({
                                                ...filters,
                                                minPrice: min,
                                                maxPrice: max,
                                            })
                                        }
                                        className="relative flex items-center w-full h-5"
                                    >
                                        <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
                                            <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
                                        </Slider.Track>

                                        <Slider.Thumb className="block w-4 h-4 bg-white border border-blue-600 rounded-full shadow" />
                                        <Slider.Thumb className="block w-4 h-4 bg-white border border-blue-600 rounded-full shadow" />
                                    </Slider.Root>

                                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                                        <span>${filters.minPrice}</span>
                                        <span>${filters.maxPrice}</span>
                                    </div>
                                </div>

                                {/* CHECK-IN */}
                                <div>
                                    <label className="text-sm font-medium block mb-1">
                                        Ngày check-in
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.checkin}
                                        onChange={(e) =>
                                            setFilters({ ...filters, checkin: e.target.value })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>

                                {/* CHECK-OUT */}
                                <div>
                                    <label className="text-sm font-medium block mb-1">
                                        Ngày check-out
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.checkout}
                                        onChange={(e) =>
                                            setFilters({ ...filters, checkout: e.target.value })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>

                                <button
                                    onClick={applyFilter}
                                    className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                {/* RESULT */}
                <section className="lg:col-span-3">
                    {/* RESULT HEADER */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-1">
                            Kết quả tìm kiếm
                        </h1>

                        <p className="text-gray-500 text-sm">
                            {totalHotels} khách sạn được tìm thấy
                            {filters.city && ` tại ${filters.city}`}
                            {filters.country && `, ${filters.country}`}
                        </p>
                    </div>

                    {loading && (
                        <p className="text-center text-gray-500">
                            Đang tìm khách sạn...
                        </p>
                    )}

                    {!loading && totalHotels === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            😢 Không tìm thấy khách sạn phù hợp
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {hotels.map((hotel) => (
                            <div
                                key={hotel.id}
                                className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col h-full"
                            >
                                {/* IMAGE */}
                                <div className="h-48 bg-gray-200 shrink-0">
                                    {hotel.primary_image ? (
                                        <img
                                            src={hotel.primary_image.url}
                                            alt={hotel.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-400">
                                            No image
                                        </div>
                                    )}
                                </div>

                                {/* CONTENT */}
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                                        {hotel.name}
                                    </h3>

                                    <p className="text-sm text-gray-500 mb-4">
                                        {hotel.city}, {hotel.country}
                                    </p>

                                    <div className="mt-auto">
                                        <Link
                                            to={`/hotels/${hotel.id}`}
                                            className="inline-block text-blue-600 font-medium hover:underline"
                                        >
                                            Xem chi tiết →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HotelSearchResult;
