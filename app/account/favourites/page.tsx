"use client";

import Image from "next/image";

import { Header } from "../../(marketing)/components/header/Header";

const items = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Aura ${i + 1}`,
}));

export default function FavouritesPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />

      <section className="mx-auto max-w-[1600px] px-6 pt-[20vh] pb-24">
        <span className="text-[10px] font-bold tracking-[0.6em] text-[var(--accent-primary)] uppercase">Saved Collection</span>

        <h1 className="mt-8 text-[clamp(4rem,8vw,7rem)] font-bold tracking-[-0.08em] uppercase">Favourites.</h1>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[4/5] overflow-hidden rounded-[40px] border border-[var(--border-color)] bg-white"
            >
              <Image
                src={`https://picsum.photos/800/1000?random=${item.id}`}
                fill
                alt=""
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />

              <div className="absolute bottom-8 left-8">
                <h3 className="text-3xl font-bold text-white">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
