"use client";

import React, { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Navbar from "../components/navbar";
interface Props {
  children: ReactNode;
}

export default function GuestLayout({ children }: Props) {
  const { data: session } = useSession();
  // console.log("session -=--=->", session);
  if (session) {
    return redirect("/");
  }
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
