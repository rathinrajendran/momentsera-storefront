"use client";

import { useState } from "react";
import { Heart, Search, Filter, MoreHorizontal, MessageCircle } from "lucide-react";

const wishes = [
  {
    id: 1,
    guest: "Anjali Nair",
    message: "Wishing you both a lifetime of happiness, love and beautiful memories together.",
    invitation: "Rahul & Meera",
    date: "12 Jun 2026",
  },
  {
    id: 2,
    guest: "Arjun Menon",
    message: "Congratulations on your special day. May your journey together be filled with joy.",
    invitation: "Rahul & Meera",
    date: "10 Jun 2026",
  },
  {
    id: 3,
    guest: "Meera Thomas",
    message: "Such a beautiful invitation. Looking forward to celebrating with you!",
    invitation: "Birthday Celebration",
    date: "08 Jun 2026",
  },
];

export default function WishesPage() {
  const [search, setSearch] = useState("");

  const filteredWishes = wishes.filter(
    (wish) => wish.guest.toLowerCase().includes(search.toLowerCase()) || wish.message.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">Guest Messages</p>

        <h1 className="mt-2 text-4xl font-bold">Wishes & Messages</h1>

        <p className="mt-2 text-neutral-500">Messages shared by your guests across all invitations.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6">
          <p className="text-sm text-neutral-500">Total Wishes</p>

          <h3 className="mt-3 text-4xl font-bold">124</h3>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-sm text-neutral-500">This Month</p>

          <h3 className="mt-3 text-4xl font-bold">32</h3>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-sm text-neutral-500">Invitations With Wishes</p>

          <h3 className="mt-3 text-4xl font-bold">8</h3>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wishes..."
            className="h-12 w-full rounded-2xl border bg-white pr-4 pl-11 outline-none"
          />
        </div>

        <button className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-3">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Wishes */}
      <div className="space-y-4">
        {filteredWishes.map((wish) => (
          <div key={wish.id} className="rounded-3xl border bg-white p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                  <Heart size={18} />
                </div>

                <div>
                  <h3 className="font-semibold">{wish.guest}</h3>

                  <p className="text-sm text-neutral-500">{wish.invitation}</p>
                </div>
              </div>

              <button>
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-neutral-50 p-5">
              <p className="leading-relaxed text-neutral-700">"{wish.message}"</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-neutral-500">{wish.date}</span>

              <button className="flex items-center gap-2 text-sm font-medium">
                <MessageCircle size={16} />
                View Invitation
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredWishes.length === 0 && (
        <div className="rounded-3xl border bg-white py-20 text-center">
          <Heart size={40} className="mx-auto text-neutral-300" />

          <h3 className="mt-4 text-lg font-semibold">No wishes found</h3>

          <p className="mt-2 text-neutral-500">Guest messages will appear here.</p>
        </div>
      )}
    </div>
  );
}
