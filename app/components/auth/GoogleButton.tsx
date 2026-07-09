import React from "react";

export default function GoogleButton() {
  const handleGoogleRedirect = () => {
    // Redirect context window to your Google OAuth client URL initialization route
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleRedirect}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="#EA4335"
          d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.33 2.69 1.432 6.614l3.834 3.151z"
        />
        <path
          fill="#4285F4"
          d="M23.49 12.275c0-.818-.073-1.605-.21-2.364H12v4.51h6.46c-.277 1.495-1.122 2.763-2.39 3.613l3.713 2.877c2.173-2 3.417-4.945 3.417-8.636z"
        />
        <path
          fill="#FBBC05"
          d="M5.266 14.235A7.077 7.077 0 014.91 12c0-.79.13-1.554.356-2.265L1.432 6.584A11.934 11.934 0 000 12c0 1.92.455 3.732 1.255 5.345l4.01-3.11z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.955-1.073 7.94-2.914l-3.713-2.877c-1.03.69-2.345 1.109-4.227 1.109-3.24 0-5.986-2.186-6.964-5.127L1.255 17.3A11.94 11.94 0 0012 24z"
        />
      </svg>
      <span>Continue with Google</span>
    </button>
  );
}
