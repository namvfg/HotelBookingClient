import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apis, { endpoints } from "../../shared/api/apis";

export default function HotelDetail() {
    const { id } = useParams();
    const [hotel, setHotel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadHotel = async (hotelId: number) => {
        try {
            const res = await apis.get(endpoints["public-hotel-detail"](hotelId));
            setHotel(res.data.data);
            console.log(res);
        } catch (error) {
            console.error("Failed to load Hotel", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!id) return;
        loadHotel(Number(id));
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!hotel) return <div>Hotel not found</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* HOTEL INFO */}
            <section>
                {hotel.primary_image && (
                    <img
                        src={hotel.primary_image.url}
                        alt={hotel.name}
                        className="w-full h-96 object-cover rounded-lg"
                    />
                )}

                <h1 className="text-3xl font-bold mt-4">{hotel.name}</h1>
                <p className="text-gray-600">
                    {hotel.address}, {hotel.city}, {hotel.country}
                </p>

                <p className="mt-4">{hotel.description}</p>
            </section>

            {/* GALLERY */}
            <section>
                <h2 className="text-xl font-semibold mb-2">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {hotel.images.map((img: any) => (
                        <img
                            key={img.id}
                            src={img.url}
                            className="h-32 w-full object-cover rounded"
                        />
                    ))}
                </div>
            </section>

            {/* AMENITIES */}
            <section>
                <h2 className="text-xl font-semibold mb-3">Amenities</h2>

                <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((a: any) => (
                        <span
                            key={a.id}
                            className="inline-flex items-center px-3 py-1 rounded-full
                            text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {a.name}
                        </span>
                    ))}
                </div>
            </section>

            {/* ROOM TYPES */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Room Types</h2>

                <div className="space-y-6">
                    {hotel.room_types.map((rt: any) => (
                        <div key={rt.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold">{rt.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {rt.description} guests
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Capacity: {rt.capacity} guests
                                    </p>
                                </div>

                                <div className="text-lg font-bold">
                                    ${rt.base_price}/night
                                </div>
                            </div>

                            {/* ROOMS */}
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {rt.rooms.map((room: any) => (
                                    <div
                                        key={room.id}
                                        className="border rounded p-2 text-center"
                                        onClick={() => navigate(`/booking/${room.id}`)}
                                    >
                                        {room.primary_image && (
                                            <img
                                                src={room.primary_image.url}
                                                className="h-24 w-full object-cover rounded"
                                            />
                                        )}

                                        <div className="mt-2 font-medium">
                                            Room {room.room_code}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
