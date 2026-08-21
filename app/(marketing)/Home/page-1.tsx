"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image, { type StaticImageData } from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  LockKeyhole,
  Mail,
  MapPin,
  Music2,
  Play,
  Send,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";

import mockup from "../../../public/images/banner/mockup.png";
import mockup1 from "../../../public/images/banner/mockup1.png";
import mockup2 from "../../../public/images/banner/mockup2.png";
import grid from "../../../public/images/banner/grid.jpg";

import celeb1 from "../../../public/images/celebrations/1.webp";
import celeb2 from "../../../public/images/celebrations/2.webp";
import celeb3 from "../../../public/images/celebrations/3.webp";
import celeb4 from "../../../public/images/celebrations/4.webp";

import HeartBeat from "../../[event_key]/invites/catalog/components/icons/Heart";
import AudioPlayerWave from "../../[event_key]/invites/catalog/components/icons/AudioPlayerWave";
import AnimatedGalleryIcon from "../../[event_key]/invites/catalog/components/icons/AnimatedGalleryIcon";
import AnimatedLockIcon from "../../[event_key]/invites/catalog/components/icons/AnimatedLockIcon";
import AnimatedFlipClock from "../../[event_key]/invites/catalog/components/icons/AnimatedFlipClock";

const ease = [0.19, 1, 0.22, 1] as const;

type InviteCard = {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  image: StaticImageData;
};

const inviteCards: InviteCard[] = [
  {
    id: "eternal",
    number: "01",
    category: "WEDDING",
    title: "Eternal",
    description: "An invitation experience designed around the beginning of forever.",
    image: mockup,
  },
  {
    id: "afterglow",
    number: "02",
    category: "BIRTHDAY",
    title: "Afterglow",
    description: "A warm celebration experience built around the people and memories that matter.",
    image: mockup1,
  },
  {
    id: "heirloom",
    number: "03",
    category: "ANNIVERSARY",
    title: "Heirloom",
    description: "Refined details and timeless typography for a celebration worth remembering.",
    image: mockup2,
  },
  {
    id: "gallery",
    number: "04",
    category: "GATHERING",
    title: "Gallery",
    description: "A contemporary invitation where photographs, details and moments become the story.",
    image: grid,
  },
];

const collections = [
  { title: "The Wedding Edit", category: "Wedding", image: celeb1 },
  { title: "The Birthday Edit", category: "Birthday", image: celeb2 },
  { title: "The Anniversary Edit", category: "Anniversary", image: celeb3 },
  { title: "The Gathering Edit", category: "Corporate", image: celeb4 },
];

const features = [
  {
    number: "01",
    label: "Atmosphere",
    title: "Welcome Music",
    description: "Set the mood from the moment your guests open the invitation.",
    icon: <Music2 className="h-5 w-5" strokeWidth={1.25} />,
  },
  {
    number: "02",
    label: "Memories",
    title: "Memory Gallery",
    description: "Bring portraits, family memories and celebration moments together.",
    icon: <Heart className="h-5 w-5" strokeWidth={1.25} />,
  },
  {
    number: "03",
    label: "Anticipation",
    title: "Event Countdown",
    description: "Build excitement with a live countdown to the main occasion.",
    icon: <Clock3 className="h-5 w-5" strokeWidth={1.25} />,
  },
  {
    number: "04",
    label: "Details",
    title: "Event Schedule",
    description: "Present ceremonies, sessions, venues and timings in one clear flow.",
    icon: <Sparkles className="h-5 w-5" strokeWidth={1.25} />,
  },
  {
    number: "05",
    label: "Connection",
    title: "Guest Wishes",
    description: "Give guests a beautiful place to leave personal messages.",
    icon: <Send className="h-5 w-5" strokeWidth={1.25} />,
  },
  {
    number: "06",
    label: "Privacy",
    title: "Private Details",
    description: "Protect selected venue, schedule or guest information when needed.",
    icon: <LockKeyhole className="h-5 w-5" strokeWidth={1.25} />,
  },
];

const education = [
  {
    title: "How to make your wedding invitation memorable",
    category: "WEDDING GUIDE",
    image: celeb1,
  },
  {
    title: "5 details guests actually need to know",
    category: "EVENT GUIDE",
    image: celeb2,
  },
  {
    title: "A modern guide to digital RSVPs",
    category: "RSVP GUIDE",
    image: celeb3,
  },
  {
    title: "Turn your photographs into the story",
    category: "GALLERY GUIDE",
    image: celeb4,
  },
];

const testimonials = [
  {
    quote: "Our invitation felt like a real experience rather than another event link. Every detail was beautifully considered.",
    name: "Aparna & Evin",
    role: "Wedding celebration",
  },
  {
    quote: "The layout made our schedule, gallery and RSVP information incredibly easy for guests to follow.",
    name: "Maya & Arjun",
    role: "Wedding celebration",
  },
  {
    quote: "We wanted something premium and personal. The final invitation looked exactly like our celebration felt.",
    name: "Nora & Daniel",
    role: "Anniversary celebration",
  },
];

function RoundArrowButton({ children, onClick, light = false }: { children: ReactNode; onClick?: () => void; light?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex h-12 items-center gap-4 rounded-full px-5 text-[9px] font-medium tracking-[0.22em] uppercase transition-all duration-500 hover:-translate-y-0.5 ${
        light ? "bg-white text-[#061c19] hover:bg-[#f1f3ed]" : "bg-[#061c19] text-white hover:bg-black"
      }`}
    >
      <span>{children}</span>
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45 ${
          light ? "bg-[#061c19] text-white" : "bg-white text-[#061c19]"
        }`}
      >
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </span>
    </button>
  );
}

function LogoStrip() {
  return (
    <section className="border-y border-black/[0.06] bg-[#f5f4ef] px-5 py-10 md:py-14">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-45 grayscale md:justify-between">
        {["VOGUE", "Forbes", "VOW", "The Knot", "BRIDES", "ESPN"].map((brand) => (
          <span key={brand} className="font-serif text-lg font-semibold tracking-[-0.04em] md:text-2xl">
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ item, index, onClick }: { item: InviteCard; index: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-[18px] border border-black/[0.07] bg-[#f3f1eb] text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,.10)]"
    >
      <div className="relative aspect-[0.88] overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 80vw, 25vw"
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>

      <div className="border-t border-black/[0.06] bg-white p-5">
        <div className="flex items-center justify-between">
          <span className="text-[8px] tracking-[0.25em] text-black/35 uppercase">{item.category}</span>
          <span className="text-[8px] text-black/25">{String(index + 1).padStart(2, "0")}</span>
        </div>

        <h3 className="mt-3 text-xl font-black tracking-[-0.05em]">{item.title}</h3>

        <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-black/45">{item.description}</p>

        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#061c19] px-4 py-2 text-[8px] tracking-[0.18em] text-white uppercase">
          View invite
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </button>
  );
}

export default function Home() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeInvite = inviteCards[activeIndex];

  const previous = () => setActiveIndex((current) => (current - 1 + inviteCards.length) % inviteCards.length);

  const next = () => setActiveIndex((current) => (current + 1) % inviteCards.length);

  useEffect(() => {
    const timer = window.setInterval(next, 5200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="overflow-x-clip bg-[#f7f6f1] text-[#061c19]">
      <Header />

      {/* HERO — screenshot-inspired dark product composition */}
      <section className="relative overflow-hidden bg-[#061c19] text-white">
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_70%_25%,rgba(255,255,255,.22),transparent_25%),radial-gradient(circle_at_20%_70%,rgba(112,155,135,.2),transparent_30%)] opacity-20" />

        <div className="relative mx-auto grid min-h-[680px] max-w-[1450px] items-center gap-8 px-6 py-20 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-16">
          <div className="relative z-10 max-w-[540px]">
            <p className="text-[8px] tracking-[0.38em] text-white/40 uppercase">MomentsEra / Digital Celebrations</p>

            <h1 className="mt-7 text-[clamp(3.5rem,8vw,7.8rem)] leading-[0.76] font-black tracking-[-0.085em]">
              Make your
              <br />
              <span className="[font-family:var(--font-windsong)] font-light text-white/55">moment</span>
              <br />
              unforgettable.
            </h1>

            <p className="mt-7 max-w-[420px] text-sm leading-6 text-white/55 md:text-base">
              Premium digital invitations for weddings, birthdays, anniversaries and meaningful gatherings — designed as an experience, not
              just a link.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <RoundArrowButton light onClick={() => router.push("/invites")}>
                Shop the collection
              </RoundArrowButton>

              <span className="text-[8px] tracking-[0.22em] text-white/35 uppercase">100% digital · responsive · personal</span>
            </div>
          </div>

          <div className="relative flex min-h-[430px] items-center justify-center lg:min-h-[650px]">
            <div className="absolute h-[430px] w-[300px] rotate-[-9deg] rounded-[28px] border border-white/10 bg-white/[0.05] backdrop-blur-sm sm:h-[520px] sm:w-[370px]" />
            <div className="absolute h-[460px] w-[320px] rotate-[8deg] rounded-[30px] border border-white/10 bg-white/[0.06] backdrop-blur-sm sm:h-[550px] sm:w-[390px]" />

            <div className="relative h-[490px] w-[310px] overflow-hidden rounded-[30px] border border-white/15 bg-[#eee8dc] shadow-[0_45px_120px_rgba(0,0,0,.35)] sm:h-[580px] sm:w-[370px]">
              <Image src={activeInvite.image} alt={`${activeInvite.title} invitation`} fill sizes="370px" className="object-contain" />

              <div className="absolute inset-[5%] rounded-[25px] border border-black/10" />
            </div>

            <div className="absolute top-[8%] right-[3%] hidden rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl sm:block">
              <p className="text-[7px] tracking-[0.25em] text-white/40 uppercase">Guest experience</p>
              <p className="mt-2 text-xs text-white/75">RSVP · Wishes · Details</p>
            </div>
          </div>

          <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={previous}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:bg-white hover:text-[#061c19]"
                aria-label="Previous invitation"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="h-px w-20 bg-white/15">
                <div
                  className="h-full bg-white/70 transition-all duration-[5200ms]"
                  style={{
                    width: `${((activeIndex + 1) / inviteCards.length) * 100}%`,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={next}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:bg-white hover:text-[#061c19]"
                aria-label="Next invitation"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <span className="text-[8px] tracking-[0.25em] text-white/35 uppercase">{activeInvite.number} / 04</span>
          </div>
        </div>

        <div className="h-8 bg-[#f7f6f1] [clip-path:polygon(0_30%,12%_65%,25%_45%,38%_80%,52%_42%,66%_72%,80%_35%,92%_62%,100%_40%,100%_100%,0_100%)]" />
      </section>

      {/* TRUST */}
      <LogoStrip />

      {/* COLLECTION */}
      <section className="bg-[#f7f6f1] px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="text-center">
            <p className="text-[8px] tracking-[0.35em] text-black/35 uppercase">MomentsEra Collection</p>
            <h2 className="mt-5 text-[clamp(2.8rem,6vw,5.7rem)] leading-[0.78] font-black tracking-[-0.08em]">
              Elevate your day
              <br />
              <span className="[font-family:var(--font-windsong)] font-light text-black/35">in every detail.</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {inviteCards.map((item, index) => (
              <ProductCard key={item.id} item={item} index={index} onClick={() => router.push("/invites")} />
            ))}
          </div>
        </div>
      </section>

      {/* PROMO STRIP */}
      <section className="relative overflow-hidden bg-[#ede8dc] px-6 py-14 sm:px-10 md:py-20">
        <div className="mx-auto grid max-w-[1350px] items-center gap-8 text-center md:grid-cols-[1fr_auto_1fr] md:text-left">
          <div className="hidden md:block">
            <Image src={celeb1} alt="" width={220} height={160} className="h-36 w-52 rounded-[22px] object-cover" />
          </div>

          <div className="mx-auto max-w-[560px] text-center">
            <p className="text-[8px] tracking-[0.32em] text-black/35 uppercase">Find your perfect invitation</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] md:text-4xl">
              One beautiful link.
              <br />
              Every important detail.
            </h2>
            <p className="mx-auto mt-4 max-w-[480px] text-xs leading-5 text-black/45">
              Share your story, schedule, gallery, RSVP and wishes in one seamless guest experience.
            </p>
            <div className="mt-6">
              <RoundArrowButton onClick={() => router.push("/invites")}>Take me there</RoundArrowButton>
            </div>
          </div>

          <div className="hidden justify-end md:flex">
            <Image src={celeb3} alt="" width={220} height={160} className="h-36 w-52 rounded-[22px] object-cover" />
          </div>
        </div>
      </section>

      {/* TWO FEATURE STORY ROWS */}
      <section className="bg-white px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-[1180px] space-y-24 md:space-y-36">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
            <div className="relative mx-auto aspect-square w-full max-w-[500px] overflow-hidden rounded-[30px] bg-[#eee9de]">
              <Image src={mockup2} alt="Invitation preview" fill sizes="500px" className="object-contain p-5" />
            </div>

            <div>
              <p className="text-[8px] tracking-[0.32em] text-black/30 uppercase">01 / One-of-a-kind</p>
              <h2 className="mt-5 text-[clamp(2.7rem,5vw,5rem)] leading-[0.82] font-black tracking-[-0.08em]">
                Your story,
                <br />
                <span className="[font-family:var(--font-windsong)] font-light text-black/35">beautifully told.</span>
              </h2>
              <p className="mt-6 max-w-[480px] text-sm leading-6 text-black/45">
                Start with a collection and shape every detail around your people, places, photographs, timings, memories and traditions.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {["Typography", "Colors", "Music", "Gallery", "RSVP"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-black/10 px-4 py-2 text-[8px] tracking-[0.15em] text-black/50 uppercase"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <RoundArrowButton onClick={() => router.push("/invites")}>Explore the editor</RoundArrowButton>
              </div>
            </div>
          </div>

          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
            <div className="order-2 md:order-1">
              <p className="text-[8px] tracking-[0.32em] text-black/30 uppercase">02 / Guest experience</p>
              <h2 className="mt-5 text-[clamp(2.7rem,5vw,5rem)] leading-[0.82] font-black tracking-[-0.08em]">
                Everything
                <br />
                <span className="[font-family:var(--font-windsong)] font-light text-black/35">in one place.</span>
              </h2>
              <p className="mt-6 max-w-[480px] text-sm leading-6 text-black/45">
                From the first welcome to the final wish, guests can discover exactly what they need without losing the emotion of the
                occasion.
              </p>

              <div className="mt-8 grid max-w-[480px] grid-cols-2 gap-3">
                {[
                  [MapPin, "Venue"],
                  [Clock3, "Schedule"],
                  [Users, "RSVP"],
                  [Mail, "Wishes"],
                ].map(([Icon, label]) => (
                  <div key={label as string} className="flex items-center gap-3 rounded-2xl border border-black/[0.07] bg-[#faf9f6] p-4">
                    <Icon className="h-4 w-4 text-black/45" strokeWidth={1.2} />
                    <span className="text-[10px] font-medium text-black/60">{label as string}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 mx-auto aspect-square w-full max-w-[500px] overflow-hidden rounded-[30px] bg-[#061c19] p-8 md:order-2">
              <div className="relative h-full w-full overflow-hidden rounded-[22px]">
                <Image src={mockup} alt="Guest invitation experience" fill sizes="500px" className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DARK EXPERIENCE */}
      <section className="relative overflow-hidden bg-[#061c19] px-5 py-24 text-white sm:px-8 md:py-32">
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_18%_45%,rgba(160,190,175,.22),transparent_25%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,.08),transparent_28%)] opacity-20" />

        <div className="relative mx-auto max-w-[1280px]">
          <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-[8px] tracking-[0.35em] text-white/35 uppercase">03 / Event experience</p>
              <h2 className="mt-6 text-[clamp(3.2rem,7vw,6.8rem)] leading-[0.78] font-black tracking-[-0.085em]">
                No clutter.
                <br />
                <span className="[font-family:var(--font-windsong)] font-light text-white/40">No compromise.</span>
              </h2>
              <p className="mt-7 max-w-[470px] text-sm leading-6 text-white/50">
                Choose only the details your celebration needs — music, memories, schedules, countdowns, wishes and private information.
              </p>

              <div className="mt-8">
                <RoundArrowButton light onClick={() => router.push("/invites")}>
                  Build the experience
                </RoundArrowButton>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {features.map((item) => (
                <div
                  key={item.number}
                  className="group flex min-h-[190px] flex-col justify-between rounded-[24px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-sm transition duration-500 hover:-translate-y-2 hover:bg-white hover:text-[#061c19]"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[8px] tracking-[0.25em] text-white/30 group-hover:text-black/25">{item.number}</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 group-hover:border-black/10 group-hover:bg-black/[0.03] group-hover:text-black/60">
                      {item.icon}
                    </span>
                  </div>

                  <div>
                    <p className="text-[7px] tracking-[0.24em] text-white/30 uppercase group-hover:text-black/25">{item.label}</p>
                    <h3 className="mt-2 text-lg font-bold tracking-[-0.04em]">{item.title}</h3>
                    <p className="mt-2 text-[9px] leading-4 text-white/40 group-hover:text-black/45">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-[-2%] mt-20 h-8 bg-[#f7f6f1] [clip-path:polygon(0_50%,14%_20%,28%_62%,43%_32%,58%_65%,72%_25%,87%_60%,100%_30%,100%_100%,0_100%)]" />
      </section>

      {/* SUBSCRIBE / SHARE */}
      <section className="bg-[#f7f6f1] px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-[8px] tracking-[0.32em] text-black/30 uppercase">Stay inspired</p>
            <h2 className="mt-5 text-[clamp(2.8rem,5vw,5.2rem)] leading-[0.8] font-black tracking-[-0.08em]">
              Save the
              <br />
              <span className="[font-family:var(--font-windsong)] font-light text-black/35">moments.</span>
            </h2>
            <p className="mt-6 max-w-[480px] text-sm leading-6 text-black/45">
              Discover new invitation collections, celebration ideas and thoughtful ways to make your next event feel completely yours.
            </p>

            <div className="mt-7 flex max-w-[430px] items-center rounded-full border border-black/10 bg-white p-1">
              <input
                aria-label="Email address"
                type="email"
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent px-5 py-3 text-xs outline-none placeholder:text-black/30"
              />
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#061c19] text-white"
                aria-label="Subscribe"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="relative mx-auto aspect-[0.95] w-full max-w-[520px] overflow-hidden rounded-[30px] bg-[#e9e5dc]">
            <Image
              src={celeb4}
              alt="MomentsEra celebration"
              fill
              sizes="520px"
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="bg-white px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="text-center">
            <p className="text-[8px] tracking-[0.32em] text-black/30 uppercase">Learn / Inspire</p>
            <h2 className="mt-5 text-[clamp(2.8rem,5.5vw,5.5rem)] leading-[0.8] font-black tracking-[-0.08em]">
              Celebration
              <br />
              <span className="[font-family:var(--font-windsong)] font-light text-black/35">education.</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {education.map((item, index) => (
              <article key={item.title} className="group overflow-hidden rounded-[22px] border border-black/[0.08] bg-white">
                <div className="relative aspect-[1.3] overflow-hidden bg-[#eeeae0]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-white/85 px-3 py-2 text-[7px] tracking-[0.18em] text-black/50 uppercase backdrop-blur">
                    0{index + 1}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-[7px] tracking-[0.24em] text-black/30 uppercase">{item.category}</p>
                  <h3 className="mt-3 text-base leading-5 font-bold tracking-[-0.03em]">{item.title}</h3>
                  <button
                    type="button"
                    onClick={() => router.push("/invites")}
                    className="mt-5 inline-flex items-center gap-2 text-[8px] tracking-[0.18em] uppercase"
                  >
                    View guide
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <RoundArrowButton onClick={() => router.push("/invites")}>View all</RoundArrowButton>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#f7f6f1] px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="text-center">
            <p className="text-[8px] tracking-[0.32em] text-black/30 uppercase">Real celebrations</p>
            <h2 className="mt-5 text-[clamp(2.8rem,5.5vw,5.5rem)] leading-[0.8] font-black tracking-[-0.08em]">
              Don&apos;t just take
              <br />
              <span className="[font-family:var(--font-windsong)] font-light text-black/35">our word for it.</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-3 md:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="relative min-h-[300px] rounded-[24px] border border-black/[0.08] bg-white p-7 shadow-[0_15px_50px_rgba(0,0,0,.035)]"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3 w-3 fill-current" strokeWidth={0} />
                  ))}
                </div>

                <p className="mt-7 text-sm leading-6 text-black/55">“{item.quote}”</p>

                <div className="absolute right-7 bottom-7 left-7 border-t border-black/[0.07] pt-4">
                  <p className="text-[10px] font-bold">{item.name}</p>
                  <p className="mt-1 text-[8px] tracking-[0.15em] text-black/30 uppercase">{item.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#061c19] px-5 py-28 text-center text-white sm:px-8 md:py-40">
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_center,rgba(151,185,168,.24),transparent_32%)] opacity-30" />

        <div className="relative mx-auto max-w-[900px]">
          <p className="text-[8px] tracking-[0.38em] text-white/35 uppercase">MomentsEra / Begin</p>

          <h2 className="mt-7 text-[clamp(4rem,10vw,9.5rem)] leading-[0.7] font-black tracking-[-0.09em]">
            Make it
            <br />
            <span className="[font-family:var(--font-windsong)] font-light text-white/45">yours.</span>
          </h2>

          <p className="mx-auto mt-9 max-w-[500px] text-sm leading-6 text-white/45">
            Choose an invitation, personalise the story, arrange the experience and share something your guests will remember.
          </p>

          <div className="mt-9 flex justify-center">
            <RoundArrowButton light onClick={() => router.push("/invites")}>
              Create your invitation
            </RoundArrowButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
