"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

export default function EmailVerificationBanner() {
  const { profile } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const applyForReverification = async () => {
    if (!profile) return;
    setSubmitting(true);
    const res = await fetch(`/api/users/verify?userId=${profile.id}`, {
      method: "GET",
    });
    const { message, error } = await res.json();

    if (!res.ok && error) {
      toast.error(error);
    }

    toast.success(message);
    setSubmitting(false);
  };

  if (profile?.verified) return null;

  return (
    <div className="p-2 text-center bg-blue-gray-50 mt-2">
      <span>It looks like you haven't verified your email.</span>
      <button
        disabled={submitting}
        onClick={applyForReverification}
        className="font-semibold underline ml-2"
      >
        {submitting ? "Generating Link..." : "Get verification link"}
      </button>
    </div>
  );
}
