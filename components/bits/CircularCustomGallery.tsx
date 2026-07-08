"use client";

import { useRef, useEffect } from "react";
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Mesh,
  Program,
  Texture,
} from "ogl";

// import "./CircularGallery.css";

type GL = Renderer["gl"];

// -------------------- Helpers --------------------
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// -------------------- Card UI Texture --------------------
function createCardBaseTexture(gl: GL, item: any) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context failed");

  canvas.width = 1024;
  canvas.height = 1400;

  const w = canvas.width;
  const h = canvas.height;

  // clear transparent
  ctx.clearRect(0, 0, w, h);

  // 🔹 GLASS CARD BASE (transparent)
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 32); // card radius
  ctx.fill();

  // Title
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 75px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText((item.text || "PRODUCT").toUpperCase(), 80, 140);

  // Price pill
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.roundRect(w - 280, 85, 200, 85, 45);
  ctx.fill();

  ctx.fillStyle = "#111";
  ctx.font = "bold 45px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(item.price || "19,99$", w - 180, 145);

  const texture = new Texture(gl, { generateMipmaps: true });
  texture.image = canvas;
  return texture;
}

// -------------------- Media Class --------------------
class Media {
  plane!: Mesh;
  program!: Program;
  width = 0;
  widthTotal = 0;
  x = 0;
  extra = 0;

  constructor(
    private gl: GL,
    private geometry: Plane,
    private scene: Transform,
    private item: any,
    private index: number,
    private length: number,
    private bend: number
  ) {
    this.create();
  }

  create() {
    const uiTexture = createCardBaseTexture(this.gl, this.item);

    const productTexture = new Texture(this.gl);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.item.image;
    img.onload = () => (productTexture.image = img);

    this.program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = sin(p.x * 2.0 + uTime) * (uSpeed * 0.2);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;

        uniform sampler2D tUI;
        uniform sampler2D tProduct;
        uniform float uTime;

        varying vec2 vUv;

        void main() {

          // UI (glass card)
          vec4 ui = texture2D(tUI, vUv);

          // Image UV
          vec2 uv = (vUv - vec2(0.5, 0.55)) * 1.3 + 0.5;

          // ✅ 15px image radius (≈ 15 / 600)
          float radius = 0.025;

          vec2 d = abs(uv - 0.5);
          float maskImg = smoothstep(
            0.5,
            0.5 - radius,
            max(d.x, d.y)
          );

          vec4 img = texture2D(tProduct, uv);
          img.rgb *= maskImg;
          img.a *= maskImg;

          float bounds =
            step(0.0, uv.x) * step(uv.x, 1.0) *
            step(0.0, uv.y) * step(uv.y, 1.0);

          vec3 color = mix(ui.rgb, img.rgb, img.a * bounds);

          /* ---------- GLASS + GLOSS ---------- */

          // glass wash
          color = mix(color, vec3(1.0), 0.12);

          // glossy sweep
          float sweep = smoothstep(
            0.25,
            0.6,
            vUv.y + sin(vUv.x * 6.0 + uTime * 0.6) * 0.04
          );

          // fresnel edge light
          float fresnel = pow(
            1.0 - abs(vUv.y - 0.5) * 2.0,
            2.5
          );

          color += vec3(1.0) * sweep * 0.18;
          color += vec3(1.0) * fresnel * 0.06;

          // subtle depth gradient
          color *= mix(0.96, 1.04, vUv.y);

          // keep transparency
          gl_FragColor = vec4(color, ui.a);
        }
      `,
      uniforms: {
        tUI: { value: uiTexture },
        tProduct: { value: productTexture },
        uTime: { value: Math.random() * 10 },
        uSpeed: { value: 0 },
      },
    });

    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.plane.setParent(this.scene);
  }

  resize(screen: any, viewport: any) {
    const scale = screen.height / 1200;
    this.width = (viewport.width * (500 * scale)) / screen.width;
    this.widthTotal = (this.width + 1.5) * this.length;
    this.x = (this.width + 1.5) * this.index;
  }

  update(scroll: any, dir: string) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const half = scroll.viewport.width / 2;
    const nx = this.plane.position.x / half;

    this.plane.position.y = nx * nx * this.bend - this.bend * 0.5;
    this.plane.rotation.z = nx * -0.1;

    const s = 1 + (1 - Math.min(Math.abs(nx), 1)) * 0.15;
    this.plane.scale.set(this.width * s, (this.width / 0.73) * s, 1);

    this.program.uniforms.uTime.value += 0.02;
    this.program.uniforms.uSpeed.value = lerp(
      this.program.uniforms.uSpeed.value,
      (scroll.current - scroll.last) * 2,
      0.1
    );

    if (dir === "right" && this.plane.position.x + this.width / 2 < -half * 2)
      this.extra -= this.widthTotal;

    if (dir === "left" && this.plane.position.x - this.width / 2 > half * 2)
      this.extra += this.widthTotal;
  }
}

// -------------------- Component --------------------
export default function CircularCustomGallery({
  items,
  bend = 3.5,
}: {
  items?: any[];
  bend?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    container.appendChild(canvas);

    const renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });

    const gl = renderer.gl;
    const camera = new Camera(gl, { fov: 45 });
    camera.position.z = 20;

    const scene = new Transform();
    const geometry = new Plane(gl, { widthSegments: 40, heightSegments: 40 });

    const data =
      items && items.length
        ? [...items, ...items]
        : Array.from({ length: 8 }, (_, i) => ({
            image: `https://picsum.photos/seed/${i}/800/600`,
            text: `Item ${i + 1}`,
          }));

    const medias = data.map(
      (item, i) => new Media(gl, geometry, scene, item, i, data.length, bend)
    );

    const scroll = {
      ease: 0.05,
      current: 0,
      target: 0,
      last: 0,
      viewport: { width: 0, height: 0 },
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;

      renderer.setSize(w, h);
      camera.perspective({ aspect: w / h });

      const fov = (camera.fov * Math.PI) / 180;
      const vh = 2 * Math.tan(fov / 2) * camera.position.z;
      scroll.viewport = { width: vh * camera.aspect, height: vh };

      medias.forEach((m) =>
        m.resize({ width: w, height: h }, scroll.viewport)
      );
    };

    resize();
    window.addEventListener("resize", resize);

    let isDown = false;
    let startX = 0;
    let startTarget = 0;

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDown = true;
      startX = "touches" in e ? e.touches[0].clientX : e.clientX;
      startTarget = scroll.target;
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      scroll.target = startTarget + (startX - x) * 0.05;
    };

    const onUp = () => (isDown = false);

    const onWheel = (e: WheelEvent) => {
      scroll.target += e.deltaY * 0.004;
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    window.addEventListener("wheel", onWheel, { passive: true });

    let raf = 0;
    const loop = () => {
      scroll.current = lerp(scroll.current, scroll.target, scroll.ease);
      const dir = scroll.current > scroll.last ? "right" : "left";
      medias.forEach((m) => m.update(scroll, dir));
      renderer.render({ scene, camera });
      scroll.last = scroll.current;
      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("wheel", onWheel);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      container.removeChild(canvas);
    };
  }, [items, bend]);

  return (
    <div
      ref={containerRef}
      className="circular-gallery"
      style={{ width: "100%", height: "100vh", overflow: "hidden" }}
    />
  );
}
