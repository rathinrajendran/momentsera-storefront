"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, RoundedBox, Sparkles as ThreeSparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Heart,
  Image as ImageIcon,
  Lock,
  MapPin,
  Music2,
  Sparkles,
  Users,
} from "lucide-react";

import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";

import mockup from "../../../public/images/banner/mockup.png";
import mockup1 from "../../../public/images/banner/mockup1.png";
import mockup2 from "../../../public/images/banner/mockup2.png";

import celeb1 from "../../../public/images/celebrations/1.webp";
import celeb2 from "../../../public/images/celebrations/2.webp";
import celeb3 from "../../../public/images/celebrations/3.webp";
import celeb4 from "../../../public/images/celebrations/4.webp";

type Point = [number, number, number];

type InvitationProps = {
  position: Point;
  rotation: Point;
  scale: number;
  image: StaticImageData;
  opacity?: number;
  accent?: string;
  isHovered?: boolean;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smooth = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

const segment = (progress: number, from: number, to: number) => smooth((progress - from) / (to - from));

function InvitationCard({ position, rotation, scale, image, opacity = 1, accent = "#f7f3eb", isHovered = false }: InvitationProps) {
  const group = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((state) => {
    if (!group.current) return;

    const floatY = Math.sin(state.clock.elapsedTime * 0.7) * 0.035;
    const floatZ = Math.cos(state.clock.elapsedTime * 0.55) * 0.018;

    group.current.position.y = position[1] + floatY;
    group.current.position.z = position[2] + floatZ;
    group.current.rotation.x += (rotation[0] - group.current.rotation.x) * 0.045;
    group.current.rotation.y += (rotation[1] - group.current.rotation.y) * 0.045;
    group.current.rotation.z += (rotation[2] - group.current.rotation.z) * 0.045;

    if (materialRef.current) {
      materialRef.current.iridescence = THREE.MathUtils.lerp(materialRef.current.iridescence, isHovered ? 0.6 : 0.05, 0.05);
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[2.75, 4.1, 0.2]} radius={0.18} smoothness={6} position={[0.08, -0.1, -0.15]}>
        <meshStandardMaterial color="#000000" transparent opacity={0.24 * opacity} roughness={1} />
      </RoundedBox>

      <RoundedBox args={[2.75, 4.1, 0.18]} radius={0.18} smoothness={6}>
        <meshPhysicalMaterial
          ref={materialRef}
          color={accent}
          roughness={0.2}
          metalness={0.05}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          iridescence={0.05}
          iridescenceIOR={1.3}
          transparent
          opacity={opacity}
        />
      </RoundedBox>

      <Html
        transform
        position={[0, 0, 0.105]}
        distanceFactor={5.05}
        style={{
          width: "252px",
          height: "376px",
          pointerEvents: "none",
          borderRadius: "16px",
          overflow: "hidden",
          opacity,
          backfaceVisibility: "hidden",
        }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[16px] bg-[#f5efe5]">
          <Image src={image} alt="Invitation preview" fill sizes="252px" className="object-contain" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />
        </div>
      </Html>
    </group>
  );
}

function GlassFeature({ position, icon, label, value }: { position: Point; icon: ReactNode; label: string; value: string }) {
  return (
    <group position={position}>
      <RoundedBox args={[2.25, 0.82, 0.08]} radius={0.15} smoothness={5}>
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.85} roughness={0.1} metalness={0.01} clearcoat={0.8} />
      </RoundedBox>

      <Html transform position={[0, 0, 0.06]} distanceFactor={5} style={{ pointerEvents: "none" }}>
        <div className="flex w-[205px] items-center gap-3 px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white">{icon}</div>
          <div>
            <p className="text-[7px] tracking-[0.2em] text-black/35 uppercase">{label}</p>
            <p className="mt-0.5 text-[10px] font-semibold text-black">{value}</p>
          </div>
        </div>
      </Html>
    </group>
  );
}

function Scene({
  progress,
  pointer,
}: {
  progress: React.MutableRefObject<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const world = useRef<THREE.Group>(null);
  const heroCard = useRef<THREE.Group>(null);
  const leftCard = useRef<THREE.Group>(null);
  const rightCard = useRef<THREE.Group>(null);
  const featureGroup = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Pre-allocate vector refs to prevent GC allocation in render loop
  const heroScaleVec = useRef(new THREE.Vector3());
  const featureScaleVec = useRef(new THREE.Vector3());

  useFrame(() => {
    const p = progress.current;
    const mx = pointer.current.x;
    const my = pointer.current.y;

    const intro = segment(p, 0, 0.22);
    const zoom = segment(p, 0.15, 0.42);
    const explode = segment(p, 0.36, 0.68);
    const settle = segment(p, 0.68, 1);

    if (world.current) {
      world.current.rotation.y += (mx * 0.08 - world.current.rotation.y) * 0.035;
      world.current.rotation.x += (my * -0.045 - world.current.rotation.x) * 0.035;
      world.current.position.y += (-intro * 0.18 - settle * 0.45 - world.current.position.y) * 0.025;
    }

    if (heroCard.current) {
      const x = THREE.MathUtils.lerp(0, -1.35, explode);
      const y = THREE.MathUtils.lerp(0, 0.25, intro) + settle * 0.35;
      const z = THREE.MathUtils.lerp(0, 0.55, zoom);
      const scale = THREE.MathUtils.lerp(0.78, 1.02, zoom) * THREE.MathUtils.lerp(1, 0.78, explode);

      heroCard.current.position.x += (x - heroCard.current.position.x) * 0.045;
      heroCard.current.position.y += (y - heroCard.current.position.y) * 0.045;
      heroCard.current.position.z += (z - heroCard.current.position.z) * 0.045;
      heroCard.current.scale.lerp(heroScaleVec.current.set(scale, scale, scale), 0.045);
      heroCard.current.rotation.y += (THREE.MathUtils.lerp(-0.05, -0.34, explode) + mx * 0.12 - heroCard.current.rotation.y) * 0.045;
      heroCard.current.rotation.x += (my * -0.08 - heroCard.current.rotation.x) * 0.045;
    }

    if (leftCard.current) {
      const x = THREE.MathUtils.lerp(-0.7, -3.25, explode);
      const y = THREE.MathUtils.lerp(0.2, 1.25, explode);
      const z = THREE.MathUtils.lerp(-1.35, -0.1, explode);
      leftCard.current.position.x += (x - leftCard.current.position.x) * 0.04;
      leftCard.current.position.y += (y - leftCard.current.position.y) * 0.04;
      leftCard.current.position.z += (z - leftCard.current.position.z) * 0.04;
      leftCard.current.rotation.y += (THREE.MathUtils.lerp(0.24, 0.55, explode) - leftCard.current.rotation.y) * 0.04;
      leftCard.current.rotation.z += (THREE.MathUtils.lerp(-0.08, -0.18, explode) - leftCard.current.rotation.z) * 0.04;
    }

    if (rightCard.current) {
      const x = THREE.MathUtils.lerp(0.7, 3.15, explode);
      const y = THREE.MathUtils.lerp(0.05, -0.95, explode);
      const z = THREE.MathUtils.lerp(-1.45, -0.05, explode);
      rightCard.current.position.x += (x - rightCard.current.position.x) * 0.04;
      rightCard.current.position.y += (y - rightCard.current.position.y) * 0.04;
      rightCard.current.position.z += (z - rightCard.current.position.z) * 0.04;
      rightCard.current.rotation.y += (THREE.MathUtils.lerp(-0.24, -0.55, explode) - rightCard.current.rotation.y) * 0.04;
      rightCard.current.rotation.z += (THREE.MathUtils.lerp(0.08, 0.16, explode) - rightCard.current.rotation.z) * 0.04;
    }

    if (featureGroup.current) {
      featureGroup.current.scale.lerp(featureScaleVec.current.set(explode, explode, explode), 0.055);
      featureGroup.current.position.y += (THREE.MathUtils.lerp(1.8, -0.35, explode) - featureGroup.current.position.y) * 0.04;
      featureGroup.current.position.z += (THREE.MathUtils.lerp(-0.2, 0.5, explode) - featureGroup.current.position.z) * 0.04;
    }

    const cameraZ = THREE.MathUtils.lerp(9.6, 8.0, zoom);
    const cameraY = THREE.MathUtils.lerp(0.2, -0.1, explode) + my * 0.15;
    const cameraX = mx * 0.32 + THREE.MathUtils.lerp(0, -0.35, settle);

    camera.position.x += (cameraX - camera.position.x) * 0.025;
    camera.position.y += (cameraY - camera.position.y) * 0.025;
    camera.position.z += (cameraZ - camera.position.z) * 0.03;
    camera.lookAt(THREE.MathUtils.lerp(0, -0.25, explode), THREE.MathUtils.lerp(0, -0.35, explode), 0);
  });

  return (
    <group ref={world}>
      <group ref={heroCard}>
        <InvitationCard position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} image={mockup} accent="#f6f2ea" />
      </group>

      <group ref={leftCard}>
        <InvitationCard position={[0, 0, 0]} rotation={[0, 0.28, -0.08]} scale={0.72} image={mockup1} opacity={0.8} accent="#e7e0d4" />
      </group>

      <group ref={rightCard}>
        <InvitationCard position={[0, 0, 0]} rotation={[0, -0.28, 0.08]} scale={0.68} image={mockup2} opacity={0.78} accent="#e1e5e3" />
      </group>

      <group ref={featureGroup}>
        <GlassFeature
          position={[-3.55, -0.1, 0.45]}
          icon={<Music2 className="h-3.5 w-3.5" />}
          label="Experience"
          value="Personal soundtrack"
        />
        <GlassFeature position={[3.45, 0.65, 0.4]} icon={<Users className="h-3.5 w-3.5" />} label="Guests" value="Smart RSVP" />
        <GlassFeature position={[2.65, -1.25, 0.3]} icon={<Heart className="h-3.5 w-3.5" />} label="Memories" value="Photo gallery" />
        <GlassFeature position={[-2.9, 1.55, 0.2]} icon={<Lock className="h-3.5 w-3.5" />} label="Privacy" value="Protected sections" />
      </group>

      <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={12} blur={2.5} far={4} />
      <ThreeSparkles count={70} scale={[12, 8, 8]} size={1.2} speed={0.2} opacity={0.35} color="#ffffff" />
    </group>
  );
}

const categories = [
  { title: "Wedding", description: "Romantic, cinematic and deeply personal.", image: celeb1 },
  { title: "Birthday", description: "Bold celebrations with personality.", image: celeb2 },
  { title: "Anniversary", description: "Elegant stories built around memories.", image: celeb3 },
  { title: "Corporate", description: "Premium experiences for modern events.", image: celeb4 },
];

const features = [
  { icon: <Music2 className="h-5 w-5" />, title: "Music", text: "Give your invitation its own soundtrack." },
  { icon: <ImageIcon className="h-5 w-5" />, title: "Gallery", text: "Turn memories into an immersive visual story." },
  { icon: <Heart className="h-5 w-5" />, title: "Wishes", text: "Let guests leave messages that become part of the moment." },
  { icon: <Lock className="h-5 w-5" />, title: "Privacy", text: "Protect your event and private sections when needed." },
];

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement | null>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [webglReady, setWebglReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.16, 0.28], [1, 1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const exploreOpacity = useTransform(scrollYProgress, [0.05, 0.18, 0.28], [1, 1, 0]);

  useEffect(() => {
    setWebglReady(true);

    const unsubscribe = scrollYProgress.on("change", (value) => {
      progress.current = value;
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * -2,
      };
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        pointer.current = {
          x: Math.min(Math.max(event.gamma / 30, -1), 1),
          y: Math.min(Math.max(event.beta / 30, -1), 1),
        };
      }
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("deviceorientation", handleOrientation, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#080909] text-white">
      <Header />

      {/* 3D SCROLL STORY */}
      <section ref={heroRef} className="relative h-[360vh] bg-[#080909]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {webglReady && (
            <div className="absolute inset-0 z-0">
              <Canvas
                dpr={[1, 1.5]}
                performance={{ min: 0.5 }}
                camera={{ position: [0, 0.2, 9.6], fov: 36 }}
                gl={{ antialias: true, alpha: true, depth: true, powerPreference: "high-performance" }}
              >
                <color attach="background" args={["#080909"]} />
                <fog attach="fog" args={["#080909", 8, 17]} />

                <ambientLight intensity={1.55} />
                <directionalLight position={[5, 6, 8]} intensity={3.6} />
                <directionalLight position={[-5, 2, 4]} intensity={1.4} />
                <pointLight position={[0, 0, 5]} intensity={2.4} color="#e7d4ac" />

                <Suspense fallback={null}>
                  <Scene progress={progress} pointer={pointer} />
                  <Environment preset="studio" />
                </Suspense>
              </Canvas>
            </div>
          )}

          <motion.div
            style={{ opacity: heroOpacity, y: heroTextY }}
            className="pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto max-w-[1500px] px-5 pt-28 md:px-10 md:pt-36"
          >
            <div className="max-w-[560px]">
              <p className="text-[9px] tracking-[0.38em] text-white/40 uppercase">The digital invitation studio</p>

              <h1 className="mt-7 text-[clamp(4rem,9vw,9.5rem)] leading-[.72] font-black tracking-[-0.085em]">
                Moments
                <br />
                <span className="[font-family:var(--font-windsong)] font-light tracking-normal text-white/60">alive.</span>
              </h1>

              <p className="mt-9 max-w-[350px] text-sm leading-6 text-white/42">
                Premium digital invitations designed as interactive experiences, not static cards.
              </p>
            </div>
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-[1500px] items-end justify-between px-5 pb-7 md:px-10">
            <div className="hidden md:block">
              <p className="text-[8px] tracking-[0.3em] text-white/25 uppercase">Kerala / India</p>
              <p className="mt-2 text-[9px] text-white/35">Design · Motion · Technology</p>
            </div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="mx-auto flex flex-col items-center gap-3 text-white/40"
            >
              <span className="text-[8px] tracking-[0.35em] uppercase">Scroll to explore</span>
              <ArrowDown className="h-4 w-4" strokeWidth={1} />
            </motion.div>

            <div className="hidden text-right md:block">
              <p className="text-[8px] tracking-[0.3em] text-white/25 uppercase">3D invitation system</p>
              <p className="mt-2 text-[9px] text-white/35">01 — 04</p>
            </div>
          </div>

          <div className="pointer-events-none absolute top-1/2 right-5 z-20 hidden -translate-y-1/2 md:block">
            <div className="flex h-40 w-px flex-col justify-between bg-white/10">
              <motion.div style={{ scaleY: scrollYProgress, transformOrigin: "top" }} className="h-full w-full bg-white/70" />
            </div>
          </div>

          <motion.button
            style={{ opacity: exploreOpacity }}
            onClick={() => router.push("/invites")}
            className="absolute bottom-20 left-5 z-20 flex items-center gap-4 rounded-full bg-white py-2 pr-2 pl-6 text-[9px] tracking-[0.25em] text-black uppercase transition-colors hover:bg-neutral-200 md:left-10"
          >
            Explore invitations
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </motion.button>
        </div>
      </section>

      {/* STORY */}
      <section className="relative z-10 bg-[#f4f1ea] px-5 py-32 text-[#0a0b0b] md:px-10 md:py-44">
        <div className="mx-auto grid max-w-[1500px] gap-20 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="text-[9px] tracking-[0.35em] uppercase opacity-35">A new kind of invitation</p>
            <h2 className="mt-7 text-5xl leading-[.82] font-black tracking-[-0.075em] sm:text-7xl">
              Not a card.
              <br />
              <span className="opacity-25">An experience.</span>
            </h2>
          </div>

          <div className="max-w-[760px]">
            <p className="text-xl leading-relaxed text-black/65 md:text-3xl">
              Your invitation is the first glimpse your guests get of the celebration. We turn that first impression into something
              beautiful, interactive and memorable.
            </p>

            <div className="mt-14 grid gap-3 sm:grid-cols-3">
              {[
                ["01", "Design", "Editorial visual systems"],
                ["02", "Motion", "Cinematic interactions"],
                ["03", "Technology", "Smart guest experiences"],
              ].map(([number, title, text]) => (
                <motion.div
                  key={number}
                  whileHover={{ y: -7, rotateX: 2 }}
                  className="rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,.04)] [transform-style:preserve-3d]"
                >
                  <p className="text-[8px] opacity-30">/ {number}</p>
                  <p className="mt-10 text-sm font-bold">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-black/45">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="relative z-10 bg-[#f8f7f4] px-5 py-28 text-[#0b0c0c] md:px-10 md:py-36">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-[9px] tracking-[0.35em] uppercase opacity-35">Collections</p>
              <h2 className="mt-5 text-5xl font-black tracking-[-0.075em] sm:text-7xl">
                Choose your
                <br />
                <span className="opacity-25">world.</span>
              </h2>
            </div>

            <button
              onClick={() => router.push("/invites")}
              className="hidden items-center gap-2 border-b border-black pb-2 text-[9px] tracking-[0.25em] uppercase sm:flex"
            >
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {categories.map((item, index) => (
              <motion.button
                key={item.title}
                onClick={() => router.push("/invites")}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                whileHover={{ y: -12, rotateX: 3, rotateY: index % 2 ? -2 : 2 }}
                transition={{ type: "spring", stiffness: 170, damping: 18 }}
                className="group relative aspect-[4/5] overflow-hidden rounded-[30px] bg-white text-left shadow-[0_25px_70px_rgba(0,0,0,.08)] [transform-style:preserve-3d]"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
                <div className="absolute right-5 bottom-5 left-5 text-white">
                  <p className="text-[8px] tracking-[0.3em] uppercase opacity-60">Collection</p>
                  <h3 className="mt-2 text-xl font-black tracking-[-0.05em]">{item.title}</h3>
                  <p className="mt-2 text-[10px] leading-4 text-white/60">{item.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE FEATURES */}
      <section className="relative z-10 overflow-hidden bg-[#111313] px-5 py-32 md:px-10 md:py-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-16 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="text-[9px] tracking-[0.35em] text-white/30 uppercase">Inside every experience</p>
              <h2 className="mt-6 text-5xl leading-[.82] font-black tracking-[-0.075em] sm:text-7xl">
                Small details.
                <br />
                <span className="text-white/25">Big feeling.</span>
              </h2>
              <p className="mt-8 max-w-[350px] text-sm leading-6 text-white/40">
                Every invitation can become an interactive destination for guests.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.06 }}
                  whileHover={{ y: -6, rotateX: 2, rotateY: index % 2 ? -1 : 1 }}
                  className="rounded-[28px] border border-white/8 bg-white/[0.035] p-7 backdrop-blur-md transition-colors [transform-style:preserve-3d] hover:bg-white/[0.07]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white text-black">
                    {item.icon}
                  </div>
                  <h3 className="mt-10 text-lg font-bold">{item.title}</h3>
                  <p className="mt-3 text-xs leading-5 text-white/35">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EDITOR UI */}
      <section className="relative z-10 overflow-hidden bg-[#e9e5dd] px-5 py-32 text-[#0b0c0c] md:px-10 md:py-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 max-w-[650px]">
            <p className="text-[9px] tracking-[0.35em] uppercase opacity-35">The editor</p>
            <h2 className="mt-6 text-5xl leading-[.82] font-black tracking-[-0.075em] sm:text-7xl">
              Your design.
              <br />
              <span className="opacity-25">Your rules.</span>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 80, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="relative rounded-[38px] border border-black/10 bg-[#151616] p-2 shadow-[0_50px_140px_rgba(0,0,0,.18)] [perspective:1600px] md:p-3"
          >
            <div className="flex h-10 items-center justify-between border-b border-white/10 px-4 text-white/35">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
              </div>
              <span className="text-[8px] tracking-[0.3em] uppercase">MomentsEra Editor</span>
              <span className="text-[8px]">Live</span>
            </div>

            <div className="grid min-h-[500px] grid-cols-[55px_1fr] md:grid-cols-[70px_1fr_260px]">
              <div className="border-r border-white/10 py-5">
                {["✦", "◫", "◌", "♪", "⚙"].map((item, index) => (
                  <div
                    key={item}
                    className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-xs ${
                      index === 0 ? "bg-white text-black" : "text-white/30"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="relative flex items-center justify-center overflow-hidden bg-[#202222] p-8">
                <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:35px_35px] opacity-30" />
                <motion.div
                  whileHover={{ rotateY: 7, rotateX: -4, scale: 1.025 }}
                  transition={{ type: "spring", stiffness: 160, damping: 18 }}
                  className="relative h-[390px] w-[250px] overflow-hidden rounded-[28px] border-[7px] border-[#252525] bg-white p-1 shadow-2xl [transform-style:preserve-3d]"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[20px]">
                    <Image src={mockup1} fill sizes="250px" className="object-contain" alt="Invitation editor" />
                  </div>
                </motion.div>
              </div>

              <div className="hidden border-l border-white/10 p-5 md:block">
                <p className="text-[8px] tracking-[0.25em] text-white/30 uppercase">Customize</p>
                {["Typography", "Colors", "Background", "Music", "Sections"].map((item, index) => (
                  <div key={item} className="mt-3 rounded-xl border border-white/8 bg-white/[0.03] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/65">{item}</span>
                      <span className="text-[9px] text-white/25">{index === 0 ? "Aa" : "+"}</span>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => router.push("/invites")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-[8px] font-medium tracking-[0.2em] text-black uppercase transition-colors hover:bg-neutral-200"
                >
                  Start designing
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GUEST EXPERIENCE */}
      <section className="relative z-10 bg-[#f5f2eb] px-5 py-32 text-[#0b0c0c] md:px-10 md:py-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[9px] tracking-[0.35em] uppercase opacity-35">Guest experience</p>
              <h2 className="mt-6 text-5xl leading-[.82] font-black tracking-[-0.075em] sm:text-7xl">
                Every detail.
                <br />
                <span className="opacity-25">Already there.</span>
              </h2>
              <p className="mt-8 max-w-[400px] text-sm leading-6 text-black/45">
                From the first tap to the final RSVP, every important part of the celebration lives inside one elegant experience.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                [CalendarDays, "Schedule", "Events and functions"],
                [MapPin, "Location", "Google Maps directions"],
                [Users, "RSVP", "Guest confirmations"],
                [Heart, "Wishes", "Messages from loved ones"],
              ].map(([Icon, title, description]) => {
                const IconComponent = Icon as typeof CalendarDays;
                return (
                  <motion.div
                    key={String(title)}
                    whileHover={{ y: -7, rotateX: 2 }}
                    className="rounded-[28px] border border-black/10 bg-white p-7 shadow-[0_20px_70px_rgba(0,0,0,.04)] [transform-style:preserve-3d]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
                        <IconComponent className="h-5 w-5" strokeWidth={1.4} />
                      </div>
                      <ArrowUpRight className="h-4 w-4 opacity-20" />
                    </div>
                    <h3 className="mt-12 text-lg font-bold">{String(title)}</h3>
                    <p className="mt-2 text-xs text-black/40">{String(description)}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 overflow-hidden bg-black px-5 py-44 text-center text-white md:py-56">
        <div className="absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.12),transparent_65%)]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mx-auto max-w-[1100px]"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5">
            <Sparkles className="h-5 w-5" strokeWidth={1} />
          </div>

          <p className="mt-7 text-[9px] tracking-[0.4em] text-white/35 uppercase">Start with a moment</p>

          <h2 className="mt-8 text-[clamp(4rem,10vw,10rem)] leading-[.72] font-black tracking-[-0.085em]">
            Make it
            <br />
            <span className="[font-family:var(--font-windsong)] font-light tracking-normal text-white/60">yours.</span>
          </h2>

          <p className="mx-auto mt-10 max-w-[430px] text-sm leading-6 text-white/35">
            Choose a design, personalize the experience, and publish an invitation your guests will remember.
          </p>

          <button
            onClick={() => router.push("/invites")}
            className="group mx-auto mt-9 flex items-center gap-5 rounded-full bg-white py-2 pr-2 pl-7 text-[9px] tracking-[0.25em] text-black uppercase transition-colors hover:bg-neutral-200"
          >
            Create invitation
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </button>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
