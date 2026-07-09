"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthLayout from "../../components/auth/AuthLayout";
import Link from "next/link";


export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your account details...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing account verification token link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Verification link expired or invalid.");
        }

        setStatus("success");
        setMessage("Your account email has been successfully verified!");

        // Auto redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push("/account/login");
        }, 3000);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <AuthLayout title="Account Verification">
      <div className="w-full space-y-4 text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <div className="mb-2 h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-600">{message}</div>
            <p className="text-xs text-gray-500">Redirecting you to log in shortly...</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">{message}</div>
            <Link href="/account/login" className="text-sm font-medium text-blue-600 hover:underline">
              Go to Sign In
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
