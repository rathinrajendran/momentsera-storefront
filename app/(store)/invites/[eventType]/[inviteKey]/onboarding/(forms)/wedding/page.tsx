"use client";

import { useParams, useRouter } from "next/navigation";

export default function WeddingForm() {
  const { invite_key } = useParams();
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use your backend port 4000 to save the event data

    // Redirect to the editor after successful save
    router.push(`/editor/${invite_key}`);
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-lg bg-white p-10 shadow-md">
      <h1 className="mb-6 border-b pb-4 text-3xl font-bold">Wedding Onboarding</h1>
      <form onSubmit={handleSave} className="grid grid-cols-1 gap-6">
        <input type="text" placeholder="Groom's Name" className="rounded border p-3" required />
        <input type="text" placeholder="Bride's Name" className="rounded border p-3" required />
        <input type="date" className="rounded border p-3" required />
        <button type="submit" className="rounded-full bg-black py-4 text-white transition hover:opacity-90">
          Save & Open Editor
        </button>
      </form>
    </div>
  );
}
