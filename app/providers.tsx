"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ClientLayout from "./ClientLayout";
// import "@fontsource-variable/plus-jakarta-sans";
// import "../lib/fetchPatch";

const client = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={client}>
      <ClientLayout>{children}</ClientLayout>
    </QueryClientProvider>
  );
}
