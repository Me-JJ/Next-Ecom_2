import React from "react";
import { notFound } from "next/navigation";

interface Props {
  searchParams: { token: string; userId: string };
}
// every key:value pair after ? in url is stored in searchParams
export default function Verify(props: Props) {
  const { token, userId } = props.searchParams;

  //verify the token ans userId

  if (!token || !userId) return notFound();

  return (
    <div className="text-3xl opacity-70 text-center p-5 animate-pulse">
      Please wait...
      <p>We are verifying your email</p>
    </div>
  );
}
