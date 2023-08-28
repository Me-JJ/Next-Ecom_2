"use client";

import React, { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Navbar from "../components/navbar";
interface Props {
  children: ReactNode;
}

export default function HomeLayout({ children }: Props) {
  return (
    <div className="max-w-screen-xl mx-auto xl:p-0">
      <Navbar />
      {children}
    </div>
  );
}
