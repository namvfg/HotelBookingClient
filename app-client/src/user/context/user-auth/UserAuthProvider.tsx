import { useEffect, useReducer } from "react";
import { UserAuthContext } from "./UserAuthContext";
import { userAuthReducer, initialUserAuthState } from "./userAuthReducer";
import apis, { userAuthApis, endpoints } from "../../../shared/api/apis";
import Cookies from "js-cookie";

export function UserAuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [state, dispatch] = useReducer(
        userAuthReducer,
        initialUserAuthState
    );

    const login = async (email: string, password: string) => {
        dispatch({ type: "LOGIN_START" });

        try {
            const res = await apis.post(endpoints["login"], {
                email,
                password,
            });

            const { user, token } = res.data;

            Cookies.set("user_token", token, {
                expires: 7,
                sameSite: "strict",
                secure: false, // bật true nếu https
            });

            dispatch({
                type: "LOGIN_SUCCESS",
                payload: { user },
            });
        } catch (err: any) {
            const message =
                err.response?.data?.message || "Login failed";
            dispatch({ type: "LOGIN_FAIL", payload: message });
            throw err;
        }
    };

    const logout = () => {
        Cookies.remove("user_token");
        dispatch({ type: "LOGOUT" });
    };

    const loadMe = async () => {
        dispatch({ type: "LOAD_USER_START" });

        try {
            const res = await userAuthApis.get(endpoints["user-me"]);
            const { user } = res.data;

            dispatch({
                type: "LOAD_USER_SUCCESS",
                payload: { user },
            });
        } catch {
            dispatch({
                type: "LOAD_USER_SUCCESS",
                payload: { user: null },
            });
        }
    };

    useEffect(() => {
        const token = Cookies.get("user_token");
        if (token) {
            loadMe();
        } else {
            dispatch({
                type: "LOAD_USER_SUCCESS",
                payload: { user: null },
            });
        }
    }, []);

    return (
        <UserAuthContext.Provider
            value={{ state, login, logout, loadMe }}
        >
            {children}
        </UserAuthContext.Provider>
    );
}
