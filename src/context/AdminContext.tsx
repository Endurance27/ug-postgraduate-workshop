import { createContext, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AdminContextValue {
  siteContent: { [key: string]: any };
  updateContent: (section: string | Record<string, unknown>, value?: unknown) => void;
  navigate?: (page: string) => void;
}

export const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdminContext(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdminContext must be used within AdminPage");
  return ctx;
}
