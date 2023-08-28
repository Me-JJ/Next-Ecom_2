"use client";

import React, { useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface Props {
  searchParams: { token: string; userId: string };
}
// every key:value pair after ? in url is stored in searchParams
export default function Verify(props: Props) {
  const { token, userId } = props.searchParams;
  const router = useRouter();

  //verify the token ans userId
  useEffect(() => {
    fetch("/api/users/verify", {
      method: "POST",
      body: JSON.stringify({ token, userId }),
    }).then(async (res) => {
      const apiRes = await res.json();
      const { error, message } = apiRes as { message: string; error: string };
      if (res.ok) {
        toast.success(message);
      }
      if (!res.ok && error) {
        toast.error(error);
      }
      router.replace("/");
    });
  }, []);
  if (!token || !userId) return notFound();

  return (
    <div className="text-3xl opacity-70 text-center p-5 animate-pulse">
      Please wait...
      <p>We are verifying your email</p>
    </div>
  );
}
