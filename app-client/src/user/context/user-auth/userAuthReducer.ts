import type { UserAuthAction, UserAuthState } from "./userAuthType";

export const initialUserAuthState: UserAuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    initialized: false,
    error: null,
};

export function userAuthReducer(
    state: UserAuthState,
    action: UserAuthAction
): UserAuthState {
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
            return { ...initialUserAuthState, error: action.payload };

        case "LOGOUT":
            return initialUserAuthState;

        case "LOAD_USER_START":
            return { ...state, loading: true };

        case "LOAD_USER_SUCCESS":
            return {
                user: action.payload.user,
                isAuthenticated: !!action.payload.user,
                loading: false,
                initialized: true,
                error: null,
            };

        default:
            return state;
    }
}
