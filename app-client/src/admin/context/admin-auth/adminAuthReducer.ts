import type { AdminAuthAction, AdminAuthState } from "./adminAuthTypes";

export const initialAdminAuthState: AdminAuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    initialized: false,
    error: null,
};

export function adminAuthReducer(
    state: AdminAuthState,
    action: AdminAuthAction
): AdminAuthState {
    switch (action.type) {
        case "LOGIN_START":
            return { ...state, loading: true };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload.user,
                isAuthenticated: true,
                loading: false,
                error: null,
                initialized: true,
            };
        case "LOGIN_FAIL":
            return { ...initialAdminAuthState, error: action.payload };
        case "LOGOUT":
            return initialAdminAuthState;
        case "LOAD_USER_START":
            return {
                ...state,
                loading: true,
            }
        case "LOAD_USER_SUCCESS":
            return {
                user: action.payload.user,
                error: null,
                initialized: true,
                loading: false,
                isAuthenticated: action.payload.user ? true : false,
            }
        default:
            return state;
    }
}