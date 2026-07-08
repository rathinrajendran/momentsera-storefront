"use client";
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useThemeAnimation } from "../../../../../hooks/useThemeAnimations";
import { useInviteData } from "../../../../../hooks/useInviteData";
import { getAnimationKey } from "../../../../../utils/animation";
import GallerySection from "../components/common/GallerySection";
import WishesSection from "../components/common/WishesSection";
import { LineBorder } from "../components/icons/LineBorder";
import {
  getSectionConfig,
  getSectionPassword,
  isSectionHidden,
  isSectionProtected,
  SectionVisibility,
} from "../../../../../utils/section-visibility";
import { useUnlockedSections } from "../../../../../hooks/useUnlockedSections";
import CurvedText from "../../../../../components/ui/CurvedText";

interface SoraProps {
  data: any;
  eventKey: string;
  motionData: any;
  settings: any;
}
export default function Sora({ data, eventKey, motionData, settings }: SoraProps) {
  const [wishRefreshKey, setWishRefreshKey] = useState(0);
  const wishesContainerRef = useRef<HTMLElement | null>(null);
  const sora = useInviteData(data);
  const { getMotionProps } = useThemeAnimation(motionData);
  const animationKey = useMemo(() => getAnimationKey(motionData), [motionData]);
  const { key: _scheduleKey, ...scheduleProps } = getMotionProps(0);
  const gallery = getSectionConfig(settings.section_visibility, "gallery");
  const wishes = getSectionConfig(settings.section_visibility, "wishes");
  const { unlockedSections, setUnlockedSections } = useUnlockedSections(eventKey);
  console.log("data values", data);

  return (
    <div
      className="relative min-h-screen overflow-hidden selection:bg-black/10"
      style={{
        background: "var(--bg-page)",
        color: "var(--primary)",
        fontFamily: "var(--font-secondary)",
        fontSize: "var(--font-size-primary)",
      }}
    >
      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div key={`hero-${animationKey}`} className="w-full">
            <HeroContent
              message={sora.message}
              firstName={sora.firstName}
              secondName={sora.secondName}
              heroImage={sora.heroImage}
              coupleOrder={sora.coupleOrder}
              formattedDate={sora.formattedDate}
              getMotionProps={getMotionProps}
            />
          </motion.div>
        </AnimatePresence>
      </section>

      {/* EVENTS */}
      <section className="px-6 py-24">
        <motion.h2
          {...scheduleProps}
          className="mb-16 text-center text-5xl"
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-accent)",
            fontSize: "var(--font-size-accent)",
          }}
        >
          Schedule
        </motion.h2>

        <div className="mx-auto flex max-w-4xl flex-col items-center space-y-8">
          {sora.eventFunctions?.map?.((fn: any, i: number) => {
            const { key: _key, ...motionProps } = getMotionProps(i * 0.2);
            return (
              <motion.div
                key={fn.function_key ?? i}
                {...motionProps}
                className="inline-flex items-center gap-8"
                style={{
                  color: "var(--primary)",
                  fontFamily: "var(--font-primary)",
                  fontSize: "var(--font-size-primary)",
                }}
              >
                <div className="text-right">
                  <p>
                    {fn?.date
                      ? format(new Date(fn.date), "dd MMMM yyyy").replace(
                          format(new Date(fn.date), "MMMM"),
                          format(new Date(fn.date), "MMMM").toUpperCase(),
                        )
                      : "No date"}
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl capitalize">{fn.title}</h3>
                  <p>{fn.locationName}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* GALLERY */}
      {!gallery.hidden && (
        <GallerySection
          animationKey={animationKey}
          getMotionProps={getMotionProps}
          layout={sora.galleryLayout}
          urls={sora.galleryUrls}
          fallback={sora.heroImage}
          title="Gallery"
          textColor="accent"
          fontSize="accent"
          fontFamily="accent"
          isProtected={gallery.protected}
          password={gallery.password}
          unlockedSections={unlockedSections}
          setUnlockedSections={setUnlockedSections}
        />
      )}
      {/* WISHES */}
      {!wishes.hidden && (
        <WishesSection
          animationKey={animationKey}
          getMotionProps={getMotionProps}
          eventKey={eventKey}
          wishesRaw={sora.wishesRaw}
          wishesEnabled={sora.wishesEnabled}
          wishesContainerRef={wishesContainerRef}
          wishRefreshKey={wishRefreshKey}
          setWishRefreshKey={setWishRefreshKey}
          title={sora.wishesTitle ?? "Best Wishes"}
          textColor="accent"
          fontSize="accent"
          fontFamily="accent"
          isIcon={false}
          isProtected={wishes.protected}
          password={wishes.password}
          unlockedSections={unlockedSections}
          setUnlockedSections={setUnlockedSections}
        />
      )}
      {/* FOOTER */}

      <footer className="py-20 text-center" style={{ background: "var(--bg-section-1)", color: "var(--primary)" }}>
        <h2
          className="text-5xl"
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-accent)",
            fontSize: "var(--font-size-accent)",
          }}
        >
          <span>{sora.brideName?.charAt(0).toUpperCase() + sora.brideName?.slice(1).toLowerCase()}</span>
          <span className="mx-1">&</span>
          <span>{sora.groomName?.charAt(0).toUpperCase() + sora.groomName?.slice(1).toLowerCase()}</span>
        </h2>
        <p
          className="mt-6 tracking-[5px]"
          style={{
            color: "var(--primary)",
            fontFamily: "var(--font-primary)",
            fontSize: "var(--font-size-primary)",
          }}
        >
          {sora.formattedDate?.toUpperCase()}
        </p>
      </footer>
    </div>
  );
}
/* HERO */
function HeroContent({ message, firstName, secondName, getMotionProps, heroImage, coupleOrder, formattedDate }: any) {
  const { key: _pKey, ...pProps } = getMotionProps(0.1);
  const { key: _hKey, ...hProps } = getMotionProps(0.3);
  const { key: _fKey, ...fProps } = getMotionProps(0.5);
  return (
    <div className="relative mx-auto max-w-5xl px-6 pt-24">
      <div className="relative">
        <div className="relative inline-block max-h-[500px] w-[100%] max-w-[180px] rounded-t-full border border-[var(--accent)] p-3 md:max-w-[250px] md:p-5">
          <img src={heroImage} className="m-auto h-full w-full rounded-t-full object-cover" alt="Hero" />
          <CurvedText
            text={message}
            className="absolute -top-[10%] left-1/2 w-[92%] -translate-x-1/2 md:-top-[15%]"
            radius={360}
            fontSize={40}
            mobileRadius={160}
            mobileFontSize={16}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-5">
          <motion.h1
            {...hProps}
            className="text-6xl leading-none tracking-wide md:text-9xl"
            style={{
              color: "var(--primary)",
              fontFamily: "var(--font-primary)",
              fontSize: `calc(var(--font-size-accent) * var(--font-scale, 1))`,
            }}
          >
            <span className="block break-all">{firstName}</span>
            <span className="mx-3 inline">&</span>
            <span className="block break-all">{secondName}</span>
          </motion.h1>
        </div>
      </div>
      <motion.p
        {...pProps}
        className="tracking-[0.5rem] capitalize"
        style={{
          color: "var(--primary)",
          fontFamily: "var(--font-primary)",
          fontSize: `calc(var(--font-size-primary) * var(--font-scale, 1))`,
        }}
      >
        {formattedDate}
      </motion.p>
    </div>
  );
}
