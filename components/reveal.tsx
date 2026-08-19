"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
  direction?: "up" | "left" | "right";
  distance?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.18,
  direction = "up",
  distance = 30,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || reduceMotion) return;

    let animation: Animation | undefined;
    const previousOpacity = element.style.opacity;
    const previousTransform = element.style.transform;
    const previousWillChange = element.style.willChange;
    const compactMotion = window.matchMedia(
      "(max-width: 900px), (pointer: coarse)",
    ).matches;
    const travel = compactMotion ? Math.min(distance, 12) : distance;
    const x = direction === "left" ? -travel : direction === "right" ? travel : 0;
    const y = direction === "up" ? travel : 0;
    const initialTransform = `translate3d(${x}px, ${y}px, 0) scale(0.985)`;

    element.style.opacity = "0";
    element.style.transform = initialTransform;
    element.style.willChange = "transform, opacity";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        animation = element.animate(
          [
            { opacity: 0, transform: initialTransform },
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
          ],
          {
            duration: compactMotion ? 420 : 750,
            delay: delay * 1000,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "both",
          },
        );
        animation.addEventListener(
          "finish",
          () => {
            animation?.cancel();
            animation = undefined;
            element.style.opacity = previousOpacity;
            element.style.transform = previousTransform;
            element.style.willChange = previousWillChange;
          },
          { once: true },
        );
        observer.disconnect();
      },
      { threshold: amount },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      animation?.cancel();
      element.style.opacity = previousOpacity;
      element.style.transform = previousTransform;
      element.style.willChange = previousWillChange;
    };
  }, [amount, delay, direction, distance, reduceMotion]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
