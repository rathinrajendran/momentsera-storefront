"use client";

import { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import styles from "./DarkVeilUpdated.module.css";

const vertex = `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision mediump float;

uniform vec2 uResolution;
uniform float uTime;

float circle(
  vec2 uv,
  vec2 pos,
  float radius
) {
  return smoothstep(
    radius,
    radius - 0.25,
    length(uv - pos)
  );
}

void main() {

  vec2 uv =
    gl_FragCoord.xy / uResolution.xy;

  uv -= 0.5;

  uv.x *=
    uResolution.x / uResolution.y;

  float t = uTime * 0.18;

  vec2 p1 = vec2(
    sin(t * 0.8) * 0.35,
    cos(t * 1.2) * 0.28
  );

  vec2 p2 = vec2(
    cos(t * 0.6) * 0.42,
    sin(t * 1.1) * 0.30
  );

  float c1 =
    circle(uv, p1, 0.75);

  float c2 =
    circle(uv, p2, 0.65);

  // White background
  vec3 bg =
    vec3(1.0, 1.0, 1.0);

  // White glow
  vec3 glow1 =
    vec3(1.0, 1.0, 1.0) * c1;

  // Blue glow
  vec3 glow2 =
    vec3(0.18, 0.45, 1.0) * c2;

  vec3 color =
    bg +
    glow1 * 0.08 +
    glow2 * 0.32;

  gl_FragColor =
    vec4(color, 1.0);
}
`;

interface DarkVeilUpdatedProps {
  speed?: number;
}

export default function DarkVeilUpdated({
  speed = 1,
}: DarkVeilUpdatedProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    );

  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const parent =
      canvas.parentElement;

    if (!parent) return;

    const renderer = new Renderer({
      canvas,
      alpha: true,
      dpr: 1,
    });

    const gl = renderer.gl;

    const geometry =
      new Triangle(gl);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: {
          value: 0,
        },

        uResolution: {
          value: [0, 0],
        },
      },
    });

    const mesh = new Mesh(gl, {
      geometry,
      program,
    });

    const resize = () => {
      const width =
        parent.clientWidth;

      const height =
        parent.clientHeight;

      renderer.setSize(
        width,
        height
      );

      program.uniforms.uResolution.value =
        [width, height];
    };

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    const fadeTimeout =
      setTimeout(() => {
        setVisible(true);
      }, 100);

    let frame = 0;

    let animationId = 0;

    let lastTime = 0;

    // Optimized FPS
    const FPS = 30;

    const frameDelay =
      1000 / FPS;

    const update = (
      time: number
    ) => {
      if (
        time - lastTime >
        frameDelay
      ) {
        lastTime = time;

        frame +=
          0.01 * speed;

        program.uniforms.uTime.value =
          frame;

        renderer.render({
          scene: mesh,
        });
      }

      animationId =
        requestAnimationFrame(
          update
        );
    };

    animationId =
      requestAnimationFrame(
        update
      );

    // Pause animation when hidden
    const handleVisibility =
      () => {
        if (document.hidden) {
          cancelAnimationFrame(
            animationId
          );
        } else {
          animationId =
            requestAnimationFrame(
              update
            );
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      cancelAnimationFrame(
        animationId
      );

      clearTimeout(
        fadeTimeout
      );

      window.removeEventListener(
        "resize",
        resize
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      geometry.remove();

      program.remove();
    };
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.darkveilCanvas} ${
        visible
          ? styles.isVisible
          : ""
      }`}
    />
  );
}