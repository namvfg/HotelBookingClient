import { useState } from "react";
import { AdminContext } from "./AdminContext";

export function AdminProvider({children}: {children : React.ReactNode}) {
    const [keyword, setKeyword] = useState("");

    return (
        <AdminContext.Provider value={{keyword, setKeyword}}>
            {children}
        </AdminContext.Provider>
    )
}