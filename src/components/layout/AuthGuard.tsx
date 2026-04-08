import { Navigate } from "react-router-dom";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isLoggedIn = sessionStorage.getItem("ccc-logged-in") === "true";
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
