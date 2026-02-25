import { useEffect, useState } from "react";
import apis, { endpoints } from "../../shared/api/apis";
import { useNavigate } from "react-router-dom";

const PopularHotels = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadHotHotels = async (url?: string) => {
    try {
      const res = url
        ? await apis.get(url)
        : await apis.get(endpoints["hotel-hot"]);

      setHotels((prev) =>
        url ? [...prev, ...res.data.data] : res.data.data
      );

      setNextPageUrl(res.data.links?.next ?? null);
    } catch (error) {
      console.error("Failed to load hot hotels", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadHotHotels();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-500">Đang tải khách sạn nổi bật...</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h3 className="text-3xl font-bold text-center mb-12">
        Khách sạn nổi bật
      </h3>

      <div className="grid md:grid-cols-3 gap-8">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
            onClick={() => navigate(`/hotels/${hotel.id}`)}
          >
            {/* Image */}
            <div className="h-48 bg-gray-200">
              {hotel.primary_image ? (
                <img
                  src={hotel.primary_image.url}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            <div className="p-6">
              <h4 className="font-semibold text-lg mb-1">
                {hotel.name}
              </h4>

              <p className="text-sm text-gray-500 mb-2">
                {hotel.city}, {hotel.country}
              </p>

              <p className="text-sm text-gray-500 mb-3">
                {hotel.bookings_count} lượt đặt trong 30 ngày
              </p>

              <button className="mt-2 text-blue-600 font-medium hover:underline">
                Xem chi tiết →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      {nextPageUrl && (
        <div className="mt-12 text-center">
          <button
            disabled={loadingMore}
            onClick={() => {
              navigate("/hotels/search");
            }}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingMore ? "Đang tải..." : "Xem thêm"}
          </button>
        </div>
      )}
    </section>
  );
};

export default PopularHotels;
