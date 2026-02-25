import { Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import Users from "./pages/Users";
import AdminLogin from "./pages/Login";
import AdminCleanLayout from "./layouts/AdminCleanLayout";
import UserForm from "./pages/forms/UserForm";
import Hotels from "./pages/Hotels";
import HotelForm from "./pages/forms/HotelForm";
import RoomTypes from "./pages/RoomTypes";
import RoomTypeForm from "./pages/forms/RoomTypeForm";
import Reviews from "./pages/Reviews";
import ReviewForm from "./pages/forms/ReviewForm";
import Rooms from "./pages/Rooms";
import RoomForm from "./pages/forms/RoomForm";
import Amentities from "./pages/Amenities";
import AmenityForm from "./pages/forms/AmenityForm";



export const adminRoutes = (
    <>
        <Route element={<AdminCleanLayout />}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                {/* users */}
                <Route path="users" element={<Users />} />
                <Route path="users/add" element={<UserForm type="create" />} />
                <Route path="users/:id/edit" element={<UserForm type="edit" />} />

                {/* hotels */}
                <Route path="hotels" element={<Hotels />} />
                <Route path="hotels/add" element={<HotelForm type="create" />} />
                <Route path="hotels/:id/edit" element={<HotelForm type="edit" />} />

                {/* room types */}
                <Route path="room-types" element={<RoomTypes />} />
                <Route path="room-types/add" element={<RoomTypeForm type="create" />} />
                <Route path="room-types/:id/edit" element={<RoomTypeForm type="edit" />} />

                {/* reviews */}
                <Route path="reviews" element={<Reviews />} />
                <Route path="reviews/add" element={<ReviewForm type="create" />} />
                <Route path="reviews/:id/edit" element={<ReviewForm type="edit" />} />

                {/* rooms */}
                <Route path="rooms" element={<Rooms />} />
                <Route path="rooms/add" element={<RoomForm type="create" />} />
                <Route path="rooms/:id/edit" element={<RoomForm type="edit" />} />

                {/* amenities */}
                <Route path="amenities" element={<Amentities />} />
                <Route path="amenities/add" element={<AmenityForm type="create" />} />
                <Route path="amenities/:id/edit" element={<AmenityForm type="edit" />} />
            </Route>
        </Route>
    </>

);