const API = process.env.NEXT_PUBLIC_API?.replace(/\/$/, "");

if (!API) {
  throw new Error("NEXT_PUBLIC_API is not configured. Set it in your environment variables.");
}

export default API;
