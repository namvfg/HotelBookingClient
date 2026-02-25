import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keyword: "",
    city: "",
    country: "",
    checkin: "",
    checkout: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    navigate(`/hotels/search?${params.toString()}`);
  };

  return (
    <section className="bg-linear-to-r from-blue-500 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Đặt phòng khách sạn dễ dàng
        </h2>

        <p className="text-lg text-blue-100 mb-10">
          Hơn 1.000 khách sạn chất lượng trên toàn quốc
        </p>

        {/* SEARCH BOX */}
        <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-5 gap-4 text-gray-700">
          {/* HOTEL NAME */}
          <input
            type="text"
            placeholder="Tên khách sạn"
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value })
            }
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* CITY */}
          <input
            type="text"
            placeholder="Thành phố"
            value={filters.city}
            onChange={(e) =>
              setFilters({ ...filters, city: e.target.value })
            }
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* COUNTRY */}
          <input
            type="text"
            placeholder="Quốc gia"
            value={filters.country}
            onChange={(e) =>
              setFilters({ ...filters, country: e.target.value })
            }
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* CHECK-IN */}
          <input
            type="date"
            value={filters.checkin}
            onChange={(e) =>
              setFilters({ ...filters, checkin: e.target.value })
            }
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* CHECK-OUT */}
          <input
            type="date"
            value={filters.checkout}
            onChange={(e) =>
              setFilters({ ...filters, checkout: e.target.value })
            }
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* BUTTON */}
          <button
            onClick={handleSearch}
            className="md:col-span-5 bg-blue-600 hover:bg-blue-700  text-white rounded-lg py-3 font-semibold transition">
            Tìm phòng
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
