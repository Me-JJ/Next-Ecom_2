"use client";

import React, { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import EmailVerificationBanner from "../components/EmailVerificationBanner";
interface Props {
  children: ReactNode;
}

export default function PrivateLayout({ children }: Props) {
  const { data: session } = useSession();
  // console.log("session -=--=->", session);
  if (!session) {
    return redirect("/auth/signin");
  }
  console.log("layout->", session);
  return (
    <div className="max-w-screen-xl mx-auto p-4 xl:p-0">
      <EmailVerificationBanner />
      {children}
    </div>
  );
}
