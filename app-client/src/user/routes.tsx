import { Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import HotelDetail from "./pages/HotelDetail";
import HotelSearchResult from "./pages/HotelSearchResult";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";


export const userRoutes = (
    <>
        <Route element={<UserLayout />}>
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<Home />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/hotels/search" element={<HotelSearchResult />} />
            <Route path="/booking/:roomId" element={<Booking />} />
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/my-bookings" element={<MyBookings />}></Route>
            <Route path="/payments/:paymentId" element={<Payment />}></Route>
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
        </Route>
    </>
);