import { useSession } from "next-auth/react";
import React from "react";
import { SessionUserProfile } from "../types";

interface Auth {
  loading: boolean;
  loggedIn: boolean;
  isAdmin: boolean;
  profile?: SessionUserProfile | null;
}
export default function useAuth(): Auth {
  const session = useSession();

  // console.log("useAuth->", session);
  return {
    loading: session.status === "loading",
    loggedIn: session.status === "authenticated",
    isAdmin: session.data?.user.role === "admin",
    profile: session.data?.user,
  };
}
