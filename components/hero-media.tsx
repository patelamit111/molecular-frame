"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { aspirinMedia } from "@/lib/site";

type HeroMediaProps = {
  active?: boolean;
};

export function HeroMedia({ active = true }: HeroMediaProps) {
  const [unavailable, setUnavailable] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const mobileLayout = window.matchMedia("(max-width: 900px)").matches;
    if (reduceMotion || !active || mobileLayout) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    let startTimer: number | undefined;
    const queuePlayback = () => {
      startTimer = window.setTimeout(() => {
        video.preload = "auto";
        void video.play().catch(() => undefined);
      }, 300);
    };

    if (document.readyState === "complete") {
      queuePlayback();
    } else {
      window.addEventListener("load", queuePlayback, { once: true });
    }

    return () => {
      window.removeEventListener("load", queuePlayback);
      if (startTimer !== undefined) window.clearTimeout(startTimer);
    };
  }, [active, reduceMotion]);

  return (
    <div
      className="hero-media"
      role="img"
      aria-label="Aspirin platelet-inhibition film preview"
    >
      <div className="aspirin-fallback" aria-hidden="true">
        <span className="aspirin-fallback__cell aspirin-fallback__cell--one" />
        <span className="aspirin-fallback__cell aspirin-fallback__cell--two" />
        <span className="aspirin-fallback__cell aspirin-fallback__cell--three" />
        <span className="aspirin-fallback__signal" />
      </div>
      <Image
        className="hero-media__poster"
        src={aspirinMedia.poster}
        alt=""
        fill
        preload={active}
        fetchPriority={active ? "high" : "auto"}
        sizes="(max-width: 900px) calc(100vw - 32px), 48vw"
        aria-hidden="true"
      />
      {!unavailable ? (
        <video
          ref={videoRef}
          className="hero-media__video"
          muted
          loop
          playsInline
          preload="none"
          onError={() => setUnavailable(true)}
          aria-hidden="true"
        >
          <source src={aspirinMedia.loop} type="video/mp4" />
        </video>
      ) : null}
      <div className="hero-media__scrim" aria-hidden="true" />
      <div className="hero-media__caption">
        <span>Aspirin</span>
        <p>Platelet inhibition, visualized</p>
      </div>
    </div>
  );
}
