import { createContext } from "react";
import type { UserAuthState } from "./userAuthType";

type UserAuthContextType = {
    state: UserAuthState;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loadMe: () => Promise<void>;
};

export const UserAuthContext =
    createContext<UserAuthContextType | null>(null);
