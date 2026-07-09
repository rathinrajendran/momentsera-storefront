import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:mx-auto">
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900">{title}</h2>
      </div>

      <div className="mt-8 w-full max-w-md sm:mx-auto">
        <div className="flex flex-col items-center border border-gray-100 bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">{children}</div>
      </div>
    </div>
  );
}
