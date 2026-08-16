"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type ConceptFilmProps = {
  src: string;
  poster: string;
  className?: string;
};

export function ConceptFilm({
  src,
  poster,
  className,
}: ConceptFilmProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) {
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
  }, [reduceMotion]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
