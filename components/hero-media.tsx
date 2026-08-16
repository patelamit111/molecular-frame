"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { aspirinMedia } from "@/lib/site";

export function HeroMedia() {
  const [unavailable, setUnavailable] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduceMotion) {
      video.pause();
      video.currentTime = 0;
      return;
    }
    void video.play().catch(() => undefined);
  }, [reduceMotion]);

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
      {!unavailable ? (
        <video
          ref={videoRef}
          className="hero-media__video"
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload="metadata"
          poster={aspirinMedia.poster}
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
