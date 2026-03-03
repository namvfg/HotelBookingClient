import axios from "axios"
import Cookies from "js-cookie"

export const endpoints = {
    //users
    "users": "/users",
    "user-detail": (userId: number) => `/users/${userId}`,
    "managers": "/managers",
    "register": "/register",
    "login": "/login",
    "user-me": "/user/me",
    "user-profile": "/profile",


    //hotels
    "hotels": "/hotels",
    "hotel-detail": (hotelId: number) => `/hotels/${hotelId}`,
    "hotel-hot": `/hot-hotels`,
    "public-hotel-detail": (hotelId: number) => `/hotels/${hotelId}/detail`,
    "search-hotels": `/search-hotels`,

    //room-types
    "room_types": "/room-types",
    "room_type-detail": (roomTypeId: number) => `/room-types/${roomTypeId}`,

    //reviews
    "reviews": "/reviews",
    "review-detail": (reviewId: number) => `/reviews/${reviewId}`,

    //rooms
    "rooms": "/rooms",
    "room-detail" : (roomId: number) => `/rooms/${roomId}`,
    "room-availability" : (roomId: number) => `/rooms/${roomId}/availability`,

    //amenities
    "amenities": "/amenities",
    "amenity-detail": (amenityId: number) => `/amenities/${amenityId}`,

    //bookings
    "bookings": "/bookings",
    "my-bookings": "/my-bookings",
    
    //payments
    "payment-detail": (paymentId: number) => `/payments/${paymentId}`,
    "payment-vnpay": (paymentId: number) => `/payments/${paymentId}/vnpay`,
    

    //authorize
    "admin-login": "/admin/login",
    "admin-logout": "/admin/logout",
    "admin-me": "/admin/me"

}

const serverIp = "www.hotel.duckou.id.vn";
// const serverIp = "127.0.0.1:8000";

export default axios.create({
    baseURL: `http://${serverIp}/api`,
});

export const adminAuthApis = axios.create({
    baseURL: `http://${serverIp}/api`,
});

adminAuthApis.interceptors.request.use((config) => {
    const token = Cookies.get("admin_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const userAuthApis = axios.create({
    baseURL: `http://${serverIp}/api`,
});

userAuthApis.interceptors.request.use((config) => {
    const token = Cookies.get("user_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


