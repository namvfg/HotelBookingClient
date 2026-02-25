import { useEffect, useReducer } from "react";
import { AdminAuthContext } from "./AdminAuthContext";
import { adminAuthReducer, initialAdminAuthState } from "./adminAuthReducer";
import apis, { adminAuthApis, endpoints } from "../../../shared/api/apis";
import Cookies from "js-cookie";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(
        adminAuthReducer,
        initialAdminAuthState,
    );

    const login = async (email: string, password: string) => {
        dispatch({ type: "LOGIN_START" });

        try {
            const res = await apis.post(endpoints["admin-login"], {
                email,
                password,
            });

            const { user, token } = res.data;

            Cookies.set("admin_token", token, {
                expires: 7,          // 1 ngày
                sameSite: "strict",  // chống CSRF
                secure: false,       // true nếu https
            });

            dispatch({
                type: "LOGIN_SUCCESS",
                payload: { user },
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any 
        catch (err: any) {
            const message = err.response?.data?.message || "Login failed";
            dispatch({ type: "LOGIN_FAIL", payload: message });
            throw err;
        }
    };

    const logout = () => {
        Cookies.remove("admin_token");
        dispatch({ type: "LOGOUT" });
    };

    const loadMe = async () => {
        dispatch({ type: "LOAD_USER_START" });

        try {
            const res = await adminAuthApis.get(endpoints["admin-me"]);
            const { user } = res.data;
            dispatch({
                type: "LOAD_USER_SUCCESS",
                payload: { user },
            });
        } catch {
            dispatch({ type: "LOAD_USER_SUCCESS", payload: { user: null } })
        }
    }

    useEffect(() => {
        const token = Cookies.get("admin_token");
        if (token) {
            loadMe();
        }
    }, []);

    return (
        <AdminAuthContext.Provider value={{ state, login, logout, loadMe }}>
            {children}
        </AdminAuthContext.Provider>
    );
}