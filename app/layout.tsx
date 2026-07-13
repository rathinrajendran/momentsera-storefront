"use client";

import {
  /* ─────────────────────────────────────────
     Body / UI
  ───────────────────────────────────────── */
  Inter,
  Poppins,
  DM_Sans,
  Josefin_Sans,
  Nunito,
  Work_Sans,

  /* ─────────────────────────────────────────
     Serif / Royal / Luxury
  ───────────────────────────────────────── */
  Playfair_Display,
  Cormorant_Garamond,
  Lora,
  EB_Garamond,
  Cinzel,
  Tenor_Sans,
  Source_Serif_4,

  /* NEW PREMIUM SERIF */
  Bodoni_Moda,
  Prata,
  Marcellus,
  Forum,
  Vidaloka,
  Libre_Baskerville,
  Cormorant_Unicase,
  Gloock,
  Bellefair,

  /* ─────────────────────────────────────────
     Script / Calligraphy
  ───────────────────────────────────────── */
  Great_Vibes,
  Sacramento,
  Pinyon_Script,
  Alex_Brush,
  Allura,
  Parisienne,
  Dancing_Script,
  Qwitcher_Grypen,
  WindSong,
  Ms_Madi,
  Imperial_Script,

  /* NEW LUXURY SCRIPT */
  Ballet,
  Italianno,
  Mea_Culpa,
  Monsieur_La_Doulaise,
  Passions_Conflict,
  Rouge_Script,
  Tangerine,
  Niconne,
  Arizonia,
  Satisfy,
  Yellowtail,
  Petit_Formal_Script,
  Norican,

  /* Handwritten */
  Caveat,
  La_Belle_Aurore,
  Whisper,

  /* Mono */
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";

import StyledComponentsRegistry from "./(store)/invites/[eventType]/[inviteKey]/onboarding/styled-registry";
import QueryProvider from "../providers/QueryProvider";
import "./globals.css";
import { AuthProvider } from "../providers/AuthProvider";
/* ─────────────────────────────────────────
   BODY / UI
───────────────────────────────────────── */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-josefin",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-nunito",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-work-sans",
  display: "swap",
});

/* ─────────────────────────────────────────
   ROYAL / SERIF
───────────────────────────────────────── */

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const tenorSans = Tenor_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-tenor",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
});

const prata = Prata({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-prata",
  display: "swap",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

const forum = Forum({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-forum",
  display: "swap",
});

const vidaloka = Vidaloka({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vidaloka",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

const cormorantUnicase = Cormorant_Unicase({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant-unicase",
  display: "swap",
});

const gloock = Gloock({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gloock",
  display: "swap",
});

const bellefair = Bellefair({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bellefair",
  display: "swap",
});

/* ─────────────────────────────────────────
   SCRIPT / CALLIGRAPHY
───────────────────────────────────────── */

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sacramento",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-alex-brush",
  display: "swap",
});

const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-allura",
  display: "swap",
});

const parisienne = Parisienne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-parisienne",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
});

const qwitcher = Qwitcher_Grypen({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-qwitcher",
  display: "swap",
});

const windsong = WindSong({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-windsong",
  display: "swap",
});

const msMadi = Ms_Madi({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ms-madi",
  display: "swap",
});

const imperialScript = Imperial_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-imperial-script",
  display: "swap",
});

/* NEW PREMIUM SCRIPTS */

const ballet = Ballet({
  subsets: ["latin"],
  variable: "--font-ballet",
  display: "swap",
});

const italianno = Italianno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italianno",
  display: "swap",
});

const meaCulpa = Mea_Culpa({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mea-culpa",
  display: "swap",
});

const monsieur = Monsieur_La_Doulaise({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-monsieur",
  display: "swap",
});

const passions = Passions_Conflict({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-passions",
  display: "swap",
});

const rougeScript = Rouge_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rouge-script",
  display: "swap",
});

const tangerine = Tangerine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-tangerine",
  display: "swap",
});

const niconne = Niconne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-niconne",
  display: "swap",
});

const arizonia = Arizonia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-arizonia",
  display: "swap",
});

const satisfy = Satisfy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-satisfy",
  display: "swap",
});

const yellowtail = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yellowtail",
  display: "swap",
});

const petitFormal = Petit_Formal_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-petit-formal",
  display: "swap",
});

const norican = Norican({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-norican",
  display: "swap",
});

/* HANDWRITTEN */

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const belleAurore = La_Belle_Aurore({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-belle-aurore",
  display: "swap",
});

const whisper = Whisper({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-whisper",
  display: "swap",
});

/* ─────────────────────────────────────────
   MONO
───────────────────────────────────────── */

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

/* ─────────────────────────────────────────
   DISPLAY
───────────────────────────────────────── */

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

/* ─────────────────────────────────────────
   FONT CLASSES
───────────────────────────────────────── */

const fontClasses = [
  inter.variable,
  poppins.variable,
  dmSans.variable,
  josefinSans.variable,
  nunito.variable,
  workSans.variable,

  playfair.variable,
  cormorant.variable,
  lora.variable,
  ebGaramond.variable,
  cinzel.variable,
  tenorSans.variable,
  sourceSerif.variable,
  bodoni.variable,
  prata.variable,
  marcellus.variable,
  forum.variable,
  vidaloka.variable,
  libreBaskerville.variable,
  cormorantUnicase.variable,
  gloock.variable,
  bellefair.variable,

  greatVibes.variable,
  sacramento.variable,
  pinyon.variable,
  alexBrush.variable,
  allura.variable,
  parisienne.variable,
  dancingScript.variable,
  qwitcher.variable,
  windsong.variable,
  msMadi.variable,
  imperialScript.variable,

  ballet.variable,
  italianno.variable,
  meaCulpa.variable,
  monsieur.variable,
  passions.variable,
  rougeScript.variable,
  tangerine.variable,
  niconne.variable,
  arizonia.variable,
  satisfy.variable,
  yellowtail.variable,
  petitFormal.variable,
  norican.variable,

  caveat.variable,
  belleAurore.variable,
  whisper.variable,

  jetbrains.variable,
  display.variable,
  plusJakarta.variable,
].join(" ");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fontClasses} antialiased`}>
        <StyledComponentsRegistry>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
