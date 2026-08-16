"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.18,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || reduceMotion) return;

    let animation: Animation | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        animation = element.animate(
          [
            { opacity: 0, transform: "translate3d(0, 28px, 0)" },
            { opacity: 1, transform: "translate3d(0, 0, 0)" },
          ],
          {
            duration: 750,
            delay: delay * 1000,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "both",
          },
        );
        observer.disconnect();
      },
      { threshold: amount },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      animation?.cancel();
    };
  }, [amount, delay, reduceMotion]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
