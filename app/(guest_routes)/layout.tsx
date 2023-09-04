import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import Navbar from "../components/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
interface Props {
  children: ReactNode;
}

export default async function GuestLayout({ children }: Props) {
  const session = await getServerSession(authOptions);
  // console.log("guest-route layout -> ", session);
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
