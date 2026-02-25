import { Outlet } from "react-router-dom";
import UserFooter from "../compoents/Footer";
import UserHeader from "../compoents/Header";
import { UserAuthProvider } from "../context/user-auth/UserAuthProvider";


export default function UserLayout() {
    return (
        <>
            <UserAuthProvider>
                <div className="flex flex-col min-h-screen">
                    <UserHeader />
                    <main className="flex-1 bg-gray-100 p-6">
                        <Outlet />
                    </main>
                    <UserFooter />
                </div>
            </UserAuthProvider>
        </>
    );
}