import { createContext } from "react";

type AdminContextType = {
    keyword: string;
    setKeyword: (value: string) => void;
}

export const AdminContext = createContext<AdminContextType | null>(null);
