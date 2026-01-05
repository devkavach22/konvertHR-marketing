import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function GuestRoute({ children }: { children: JSX.Element }) {
  const { userId } = useAuth();

  // If user is logged in, block guest pages
  if (userId) {
    return <Navigate to="/" replace />;
  }

  return children;
}
