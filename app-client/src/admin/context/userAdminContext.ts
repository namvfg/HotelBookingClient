import { useContext } from "react";
import { AdminContext } from "./AdminContext";

export function useAdminContext() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdminContext must be used inside AdminProvider");
  }
  return ctx;
}
