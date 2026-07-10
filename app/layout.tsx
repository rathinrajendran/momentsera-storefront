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
} from "next/font/google";

import Providers from "./providers";
import StyledComponentsRegistry from "./(store)/invites/[eventType]/[inviteKey]/onboarding/styled-registry";
import SmoothScroll from "../components/ui/SmoothScroll";
import { useEffect } from "react";
import { setAccessToken } from "../utils/apiClient";

/* ─────────────────────────────────────────
   BODY / UI
───────────────────────────────────────── */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-josefin",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-nunito",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-work-sans",
});

/* ─────────────────────────────────────────
   ROYAL / SERIF
───────────────────────────────────────── */

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
});

const tenorSans = Tenor_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-tenor",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
});

const prata = Prata({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-prata",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
});

const forum = Forum({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-forum",
});

const vidaloka = Vidaloka({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vidaloka",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-baskerville",
});

const cormorantUnicase = Cormorant_Unicase({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant-unicase",
});

const gloock = Gloock({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gloock",
});

const bellefair = Bellefair({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bellefair",
});

/* ─────────────────────────────────────────
   SCRIPT / CALLIGRAPHY
───────────────────────────────────────── */

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sacramento",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
});

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-alex-brush",
});

const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-allura",
});

const parisienne = Parisienne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-parisienne",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
});

const qwitcher = Qwitcher_Grypen({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-qwitcher",
});

const windsong = WindSong({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-windsong",
});

const msMadi = Ms_Madi({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ms-madi",
});

const imperialScript = Imperial_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-imperial-script",
});

/* NEW PREMIUM SCRIPTS */

const ballet = Ballet({
  subsets: ["latin"],
  variable: "--font-ballet",
});

const italianno = Italianno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italianno",
});

const meaCulpa = Mea_Culpa({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mea-culpa",
});

const monsieur = Monsieur_La_Doulaise({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-monsieur",
});

const passions = Passions_Conflict({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-passions",
});

const rougeScript = Rouge_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rouge-script",
});

const tangerine = Tangerine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-tangerine",
});

const niconne = Niconne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-niconne",
});

const arizonia = Arizonia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-arizonia",
});

const satisfy = Satisfy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-satisfy",
});

const yellowtail = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yellowtail",
});

const petitFormal = Petit_Formal_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-petit-formal",
});

const norican = Norican({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-norican",
});

/* HANDWRITTEN */

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

const belleAurore = La_Belle_Aurore({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-belle-aurore",
});

const whisper = Whisper({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-whisper",
});

/* ─────────────────────────────────────────
   MONO
───────────────────────────────────────── */

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

/* ─────────────────────────────────────────
   DISPLAY
───────────────────────────────────────── */

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
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
].join(" ");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-qb-installed="true">
      <body className={`${fontClasses} antialiased`}>
        <StyledComponentsRegistry>
          <Providers>
            {/* <SmoothScroll /> */}
            {children}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
