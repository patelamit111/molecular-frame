"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { aspirinMedia } from "@/lib/site";

type HeroMediaProps = {
  active?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
    addEventListener?: (type: "change", listener: () => void) => void;
    removeEventListener?: (type: "change", listener: () => void) => void;
  };
};

export function HeroMedia({ active = true }: HeroMediaProps) {
  const [unavailable, setUnavailable] = useState(false);
  const [mobileLayout, setMobileLayout] = useState(true);
  const [saveData, setSaveData] = useState(false);
  const [posterReady, setPosterReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const updateLayout = () => setMobileLayout(query.matches);
    updateLayout();
    query.addEventListener("change", updateLayout);
    return () => query.removeEventListener("change", updateLayout);
  }, []);

  useEffect(() => {
    const connection = (navigator as NavigatorWithConnection).connection;
    const updateConnection = () => setSaveData(Boolean(connection?.saveData));
    updateConnection();
    connection?.addEventListener?.("change", updateConnection);
    return () => connection?.removeEventListener?.("change", updateConnection);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduceMotion || !active || mobileLayout || saveData) {
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
  }, [active, mobileLayout, reduceMotion, saveData]);

  return (
    <div
      className={
        posterReady ? "hero-media hero-media--poster-ready" : "hero-media"
      }
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
        loading="eager"
        fetchPriority={active ? "high" : "auto"}
        sizes="(max-width: 900px) calc(100vw - 32px), 48vw"
        aria-hidden="true"
        onLoad={() => setPosterReady(true)}
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
