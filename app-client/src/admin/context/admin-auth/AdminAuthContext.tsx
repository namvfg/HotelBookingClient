import { createContext } from "react";
import type { AdminAuthState } from "./adminAuthTypes"

type AdminAuthContextType = {
    state: AdminAuthState;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loadMe: () => Promise<void>;
};

export const AdminAuthContext = createContext<AdminAuthContextType | null>(null);