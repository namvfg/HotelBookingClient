import type { User } from "../../../shared/type/user/user";

export type UserAuthState = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    initialized: boolean;
    error: string | null;
};

export type UserAuthAction =
    | { type: "LOGIN_START" }
    | { type: "LOGIN_SUCCESS"; payload: { user: User } }
    | { type: "LOGIN_FAIL"; payload: string }
    | { type: "LOGOUT" }
    | { type: "LOAD_USER_START" }
    | { type: "LOAD_USER_SUCCESS"; payload: { user: User | null } };
