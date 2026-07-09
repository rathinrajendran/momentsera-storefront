"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Filter,
  Heart,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Search,
  ShoppingBag,
  Users,
  Video,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMyEvents, useMyProfile } from "../../../hooks/useUser";
import { Header } from "../../(marketing)/components/header/Header";
import { H6 } from "../../../components/ui/H6";
import { H2 } from "../../../components/ui/H2";
import { Para } from "../../../components/ui/Para";
import AccountHeader from "../components/AccountHeader";
import AccountFooter from "../components/AccountFooter";
import { Button } from "../../../components/ui/button";
import Heading from "../../../components/ui/Heading";
import { BorderFrame } from "../../../components/ui/BorderFrame";
import PageLayout from "../../../components/ui/PageLayout";
import Section from "../../../components/ui/Section";
import BgTypography from "../../../components/ui/BgTypography";
import { useToken } from "../../../hooks/useToken";
import { useMyWishes } from "../../../hooks/useWishes";

type Wish = {
  id: string;
  guest_name: string;
  invite_id: string;
  invite_name: string;
  type: "text" | "audio" | "video";
  message?: string;
  audio_url?: string;
  video_url?: string;
  duration?: number;
  created_at: string;
};
export default function WishPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"text" | "audio" | "video">("text");
  const token = useToken();
  const { data, isLoading } = useMyWishes(token);
  const wishes = useMemo(() => {
    return (data ?? []).map((item: any) => ({
      id: item.id,
      guest: item.wishes_from,
      invitation: item.groom_name && item.bride_name ? `${item.groom_name} & ${item.bride_name}` : item.event_key,
      message: item.wishes,
      type: item.wishes_type,
      audio_url: item.media ? `${process.env.NEXT_PUBLIC_API}/${item.media}` : "",
      video_url: item.media ? `${process.env.NEXT_PUBLIC_API}/${item.media}` : "",
      duration: item.duration,
      status: item.status,
      date: new Date(item.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      event_key: item.event_key,
      invite_key: item.invite_key,
      event_type: item.event_type,
    }));
  }, [data]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <PageLayout>
      <Header />
      <BorderFrame />
      <Section>
        <Heading
          label="Studio Agreement"
          title="Wishes & Messages"
          desc="Messages shared by your guests across all invitations. Messages shared by your guests across all invitations."
        />
        {/* DATA REGISTER INTERFACES */}
        <div className="bg-white">
          {/* INTERACTION CONTROLS BAR */}
          <div className="mb-4 flex flex-col overflow-hidden rounded-lg border border-[var(--border-color)] bg-white sm:flex-row sm:items-center sm:justify-between">
            {/* TABS ALTERNATION BUTTONS */}
            <div className="flex border-b border-[var(--border-color)] sm:border-b-0">
              <button
                onClick={() => setActiveTab("text")}
                className={`relative px-8 py-5 text-[11px] font-bold tracking-[0.2em] uppercase transition-all ${
                  activeTab === "text"
                    ? "font-black text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                Text ({wishes.filter((w:any) => w.type === "text").length})
                {activeTab === "text" && <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--text-primary)]" />}
              </button>
              <button
                onClick={() => setActiveTab("audio")}
                className={`relative px-8 py-5 text-[11px] font-bold tracking-[0.2em] uppercase transition-all ${
                  activeTab === "video"
                    ? "font-black text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                Audio ({wishes.filter((w:any) => w.type === "audio").length})
                {activeTab === "audio" && <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--text-primary)]" />}
              </button>
              <button
                onClick={() => setActiveTab("video")}
                className={`relative px-8 py-5 text-[11px] font-bold tracking-[0.2em] uppercase transition-all ${
                  activeTab === "video"
                    ? "font-black text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                Video ({wishes.filter((w:any) => w.type === "video").length})
                {activeTab === "video" && <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--text-primary)]" />}
              </button>
            </div>

            {/* QUICK ACTIONS UTILITIES */}
            <div className="flex items-center gap-2 p-3 sm:p-0 sm:pr-4">
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-3 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full max-w-[220px] border border-[var(--border-color)] bg-[var(--background)] py-2 pr-4 pl-9 text-xs transition-all outline-none focus:border-[var(--text-primary)]"
                />
              </div>
              <button className="border border-[var(--border-color)] p-2 text-[var(--text-primary)] hover:bg-[var(--background)]">
                <Filter size={14} />
              </button>
            </div>
          </div>

          {/* 2. DYNAMIC WORKSPACE TABLES */}
          <div className="overflow-x-auto">
            {activeTab === "text" ? (
              /* WISHES DATA SCHEMA TABLE */
              <div className="">
                {/* TERMS GRID */}
                {/* Wishes */}
                <div className="space-y-4">
                  {wishes
                    .filter((wish: any) => wish.type === activeTab)
                    .filter(
                      (wish: any) =>
                        wish.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        wish.invitation.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((wish: any) => (
                      <div key={wish.id} className="rounded-2xl border border-[var(--border-color)] bg-white p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                              {wish.type === "text" && <Heart size={18} />}
                              {wish.type === "audio" && <Mic size={18} />}
                              {wish.type === "video" && <Video size={18} />}
                            </div>

                            <div>
                              <h3 className="font-semibold">{wish.guest}</h3>

                              <p className="text-sm text-neutral-500">{wish.invitation}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Type */}
                            <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-medium uppercase">{wish.type}</span>

                            {/* Status */}
                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase ${
                                wish.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : wish.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {wish.status}
                            </span>

                            <button>
                              <MoreHorizontal size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="mt-5">
                          {wish.type === "text" && (
                            <div className="rounded-2xl bg-neutral-50 p-5">
                              <p className="leading-relaxed text-neutral-700">"{wish.message}"</p>
                            </div>
                          )}

                          {wish.type === "audio" && wish.audio_url && (
                            <div className="rounded-2xl bg-neutral-50 p-5">
                              <audio controls className="w-full">
                                <source src={wish.audio_url} type="audio/mpeg" />
                              </audio>
                            </div>
                          )}

                          {wish.type === "video" && wish.video_url && (
                            <div className="rounded-2xl bg-neutral-50 p-5">
                              <video controls className="aspect-video w-full rounded-xl">
                                <source src={wish.video_url} type="video/mp4" />
                              </video>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-sm text-neutral-500">{wish.date}</span>

                          <div className="flex items-center gap-2">
                            {wish.status === "pending" && (
                              <>
                                <Button
                                  className="flex items-center gap-2 rounded-md bg-green-300 px-4 py-2 text-sm font-medium text-white"
                                  // onClick={() => approveWish(wish.id)}
                                >
                                  <Check size={16} />
                                  <span className="hidden sm:block">Approve</span>
                                </Button>

                                <Button
                                  className="flex items-center gap-2 rounded-md bg-red-300 px-4 py-2 text-sm font-medium text-white"
                                  // onClick={() => rejectWish(wish.id)}
                                >
                                  <X size={16} />
                                  <span className="hidden sm:block">Reject</span>
                                </Button>
                              </>
                            )}

                            <Button
                              // onClick={() => router.push(`/invites/${wish.event_type}/${wish.event_key}`)}
                              className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
                            >
                              <MessageCircle size={16} />
                              <span className="hidden sm:block">View Invitation</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : activeTab === "audio" ? (
              <div className="">
                {/* TERMS GRID */}
                {/* Wishes */}
                <div className="space-y-4"></div>
              </div>
            ) : (
              <div className="">
                {/* TERMS GRID */}
                {/* Wishes */}
                <div className="space-y-4"></div>
              </div>
            )}
          </div>

          {/* PAGINATION PANEL FOOTER */}
          <div className="flex items-center justify-between border-t border-[var(--border-color)] bg-[var(--background)] px-6 py-4 text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
            <span>Showing 1-3 of records</span>
            <div className="flex gap-2">
              <button disabled className="cursor-not-allowed border border-[var(--border-color)] bg-white px-3 py-1.5 opacity-40">
                Prev
              </button>
              <button disabled className="cursor-not-allowed border border-[var(--border-color)] bg-white px-3 py-1.5 opacity-40">
                Next
              </button>
            </div>
          </div>
        </div>
      </Section>

      <BgTypography title="invites." />
      <AccountHeader />
      <AccountFooter />
    </PageLayout>
  );
}
