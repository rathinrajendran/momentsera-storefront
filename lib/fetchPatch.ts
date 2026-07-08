"use client";

if (typeof window !== "undefined") {
  const originalFetch: typeof window.fetch = window.fetch;

  window.fetch = async (
    input: Parameters<typeof fetch>[0],
    init?: Parameters<typeof fetch>[1]
  ): ReturnType<typeof fetch> => {
    const token = localStorage.getItem("token");

    const headers = new Headers(init?.headers || {});

    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return originalFetch(input, {
      ...init,
      headers,
    });
  };
}
