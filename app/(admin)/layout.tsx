"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import React, { ReactNode } from "react";
import AdminSidebar from "../components/AdminSidebar";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const isAdmin = session?.user.role === "admin";
      if (!isAdmin) return redirect("/auth/signin");
    }
    if (session === null) {
      return redirect("/auth/signin");
    }
  }, [session]);

  // console.log("admin->", session);

  return (
    <div>
      <AdminSidebar>{children}</AdminSidebar>;
    </div>
  );
}
