"use client";

import { useEffect, useState } from "react";

export function useToken() {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  return token;
}
