"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type ConceptFilmProps = {
  src: string;
  poster: string;
  className?: string;
};

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
    addEventListener?: (type: "change", listener: () => void) => void;
    removeEventListener?: (type: "change", listener: () => void) => void;
  };
};

export function ConceptFilm({
  src,
  poster,
  className,
}: ConceptFilmProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [showPoster, setShowPoster] = useState(false);
  const [allowPlayback, setAllowPlayback] = useState(false);

  useEffect(() => {
    const compactQuery = window.matchMedia(
      "(max-width: 900px), (pointer: coarse)",
    );
    const connection = (navigator as NavigatorWithConnection).connection;
    const updatePolicy = () => {
      setAllowPlayback(!compactQuery.matches && !connection?.saveData);
    };
    updatePolicy();
    compactQuery.addEventListener("change", updatePolicy);
    connection?.addEventListener?.("change", updatePolicy);
    return () => {
      compactQuery.removeEventListener("change", updatePolicy);
      connection?.removeEventListener?.("change", updatePolicy);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShowPoster(true);
        observer.disconnect();
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion || !allowPlayback) {
      video?.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.28 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [allowPlayback, reduceMotion]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      poster={showPoster ? poster : undefined}
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
