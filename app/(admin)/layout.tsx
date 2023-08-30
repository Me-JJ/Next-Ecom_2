"use client";

import React, { ReactNode } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
interface Props {
  children: ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  const session = await getServerSession(authOptions);

  console.log("layout->", session);

  const isAdmin = session?.user.role === "admin";

  if (!isAdmin) return redirect("/auth/signin");
  return (
    <div>
      <AdminSidebar>{children}</AdminSidebar>;
    </div>
  );
}
