"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, LayoutGrid, Search, Sparkles } from "lucide-react";
import { Header } from "../../(marketing)/components/header/Header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Footer } from "../../(marketing)/components/footer/Footer";
import Heading from "../../../components/ui/Heading";
import PageLayout from "../../../components/ui/PageLayout";
import { BorderFrame } from "../../../components/ui/BorderFrame";
import Section from "../../../components/ui/Section";
import { Invite } from "./page";
/* ──────────────────────────────────────────
ANIMATION
────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};
const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.19, 1, 0.22, 1],
    },
  },
};
interface InviteListsProps {
  invites: Invite[];
  filters: {
    categories: string[];
    types: string[];
    styles: string[];
  };
}

export default function InviteLists({ invites, filters }: InviteListsProps) {
  const router = useRouter();
  const [category, setCategory] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [sort, setSort] = useState("latest");
  const [search, setSearch] = useState("");
  const { categories, types, styles } = filters;
  const PAGE_SIZE = 10;
  console.log("invites data 1", invites);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const filteredInvites = useMemo(() => {
    return invites
      .filter((invite) => {
        const searchTerm = search.trim().toLowerCase();

        if (category !== "all" && invite.main_category !== category) return false;
        if (typeFilter !== "all" && invite.type !== typeFilter) return false;
        if (styleFilter !== "all" && invite.style_category !== styleFilter) return false;

        if (searchTerm) {
          const searchableText = [
            invite.shortname,
            invite.invite_key,
            invite.main_category,
            invite.style_category,
            invite.type,
            invite.description,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(searchTerm);
        }

        return true;
      })
      .sort((a, b) => {
        switch (sort) {
          case "low-high":
            return Number(a.price) - Number(b.price);

          case "high-low":
            return Number(b.price) - Number(a.price);

          default:
            return 0;
        }
      });
  }, [invites, category, typeFilter, styleFilter, search, sort]);
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, typeFilter, styleFilter, search, sort]);
  useEffect(() => {
    const node = loadMoreRef.current;

    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredInvites.length));
      },
      {
        rootMargin: "300px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [filteredInvites.length]);
 
  console.log("invites data", invites);
  
  return (
    <PageLayout>
      <Header />
      <BorderFrame />
      <Section>
        <Heading label="Curated Collection" title="Digital Experiences." />
        {/* HERO */}
        {/* <div className="mb-8 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div
            className="
            flex
            h-[60px]
            w-full
            max-w-[420px]
            items-center
            gap-4
            rounded-full
            border
            border-[var(--border-color)]
            bg-white
            px-6
            shadow-sm
            "
          >
            <Search
              className="
               h-5
               w-5
               text-[var(--text-muted)]
               "
            />
            <input
              placeholder="Search experiences..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
            w-full
            bg-transparent
            outline-none
            "
            />
          </div>
        </div> */}
        {/* ─────────────────────────────
      FILTERS
      ───────────────────────────── */}
        <div className="mb-5 rounded-xl bg-white">
          <div className="flex flex-row gap-2 overflow-auto rounded-2xl pb-2 [&::-webkit-scrollbar]:h-[2px] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-track]:bg-[#78909C]">
            {/* Category */}
            <div className="flex-1">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <LayoutGrid className="hidden h-7 w-7 sm:block" strokeWidth={1} />
                  <SelectValue placeholder="Select Type" title="Category" />
                </SelectTrigger>
                <SelectContent className="mt-3 rounded-xl border-[var(--border-color)] bg-white p-2 text-xs shadow-none">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="cursor-pointer px-4 py-3 text-[0.7rem] capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="flex-1">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" title="Type" />
                </SelectTrigger>
                <SelectContent className="mt-3 rounded-xl border-[var(--border-color)] bg-white p-2 text-xs capitalize shadow-none">
                  {types.map((type) => (
                    <SelectItem key={type} value={type} className="cursor-pointer px-4 py-3 text-[0.7rem] capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Style */}
            <div className="flex-1">
              <Select value={styleFilter} onValueChange={setStyleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Style" title="style" />
                </SelectTrigger>
                <SelectContent className="mt-3 rounded-xl border-[var(--border-color)] bg-white p-2 text-xs shadow-none">
                  {styles.map((style) => (
                    <SelectItem key={style} value={style} className="cursor-pointer px-4 py-3 text-[0.7rem] capitalize">
                      {style.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="flex-1">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" title="Sort" />
                </SelectTrigger>
                <SelectContent className="mt-3 rounded-xl border-[var(--border-color)] bg-white p-2 text-xs shadow-none">
                  <SelectItem value="latest" className="cursor-pointer px-4 py-3 text-[0.7rem] capitalize">
                    Latest
                  </SelectItem>
                  <SelectItem value="popular" className="cursor-pointer px-4 py-3 text-[0.7rem] capitalize">
                    Most Popular
                  </SelectItem>
                  <SelectItem value="low-high" className="cursor-pointer px-4 py-3 text-[0.7rem] capitalize">
                    Price Low → High
                  </SelectItem>
                  <SelectItem value="high-low" className="cursor-pointer px-4 py-3 text-[0.7rem] capitalize">
                    Price High → Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="flex hidden h-auto items-center justify-center px-5">
              <button className="flex h-5 w-10 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200">
                <Search className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────
      SUGGESTIONS
      ───────────────────────────── */}
        {/* ─────────────────────────────
      GRID
      ───────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex w-full shrink-0 flex-wrap gap-3 rounded-md"
        >
          {filteredInvites.slice(0, visibleCount).map((invite: any) => {
            const img = `https://picsum.photos/seed/${invite.id}/600/800`;
            return (
              <motion.div
                key={invite.id}
                variants={itemVariants}
                initial="hidden"
                animate="show"
                className="group w-[calc(50%-0.375rem)] rounded-md bg-white md:w-[calc(33.333%-0.5rem)] lg:w-[calc(25%-0.5625rem)] xl:w-[calc(20%-0.6rem)]"
              >
                {/* CARD */}
                <div
                  className="relative cursor-pointer overflow-hidden rounded-md transition-all duration-500"
                  onClick={() => router.push(`/invites/${invite.main_category}/${invite.invite_key}`)}
                >
                  <div className="relative aspect-[16/18]">
                    {/* IMAGE */}
                    <Image
                      src={img}
                      alt={invite.shortname}
                      fill
                      className="object-cover opacity-90 transition-all duration-1000 group-hover:scale-110 group-hover:brightness-105"
                    />
                  </div>
                  {/* HOVER BUTTON */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="flex h-16 w-16 scale-75 items-center justify-center rounded-full bg-white text-[var(--accent-primary)] shadow-md transition-transform duration-500 group-hover:scale-100">
                      <ArrowUpRight size={24} />
                    </div>
                  </div>
                  {/* BADGE */}
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5">
                      <Sparkles size={10} className="text-[var(--accent-primary)]" />
                      <span className="text-[0.5rem] font-semibold tracking-[0.2em] text-[var(--text-primary)] uppercase">Premium</span>
                    </div>
                  </div>
                </div>
                {/* METADATA */}
                <div className="flex flex-col items-start justify-between rounded-lg bg-white pt-1 pb-4">
                  <div>
                    <h3 className="text-xs md:text-md font-bold tracking-tighter text-[var(--text-primary)] capitalize transition-colors group-hover:text-[var(--accent-primary)]">
                      {invite.shortname}
                    </h3>
                  </div>
                  {/* PRICE */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold tracking-normal text-[var(--text-secondary)]">₹{invite.price}</p>
                    <p className="text-xs tracking-normal text-[var(--text-light)]">Starting from</p>
                  </div>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="text-[0.6rem] tracking-[0.2rem] text-[var(--text-muted)] capitalize uppercase">
                      {invite.main_category}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        <div ref={loadMoreRef} className="flex h-24 items-center justify-center">
          {visibleCount < filteredInvites.length ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border-color)] border-t-[var(--accent-primary)]" />
          ) : filteredInvites.length > PAGE_SIZE ? (
            <p className="text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase">You've reached the end</p>
          ) : null}
        </div>
      </Section>
      <Footer />
    </PageLayout>
  );
}
