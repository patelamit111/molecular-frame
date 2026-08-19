"use client";

import { ArrowRight } from "@phosphor-icons/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { useCompactMotion } from "@/components/use-compact-motion";

const cinematicEase = [0.16, 1, 0.3, 1] as const;

type HeroScrollSceneProps = {
  children: ReactNode;
  visual: ReactNode;
};

export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    mass: 0.22,
  });

  if (reduceMotion) return null;

  return (
    <motion.span
      className="site-scroll-progress"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

export function HeroScrollScene({
  children,
  visual,
}: HeroScrollSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const compactMotion = useCompactMotion();
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.24,
  });
  const copyY = useTransform(smoothProgress, [0, 1], [0, -64]);
  const copyOpacity = useTransform(
    smoothProgress,
    [0, 0.68, 1],
    [1, 1, 0.26],
  );
  const visualY = useTransform(smoothProgress, [0, 1], [0, 46]);
  const visualScale = useTransform(smoothProgress, [0, 1], [1, 1.055]);

  return (
    <div ref={sceneRef} className="section-shell hero-grid">
      <motion.div
        className="hero-copy"
        style={
          reduceMotion || compactMotion
            ? undefined
            : { y: copyY, opacity: copyOpacity }
        }
      >
        <motion.div
          className="hero-copy__inner"
          initial={
            reduceMotion || compactMotion ? false : { opacity: 0, y: 24 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : compactMotion ? 0.46 : 0.82,
            ease: cinematicEase,
          }}
        >
          {children}
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-visual"
        style={
          reduceMotion || compactMotion
            ? undefined
            : { y: visualY, scale: visualScale }
        }
      >
        <motion.div
          className="hero-visual__inner"
          initial={
            reduceMotion || compactMotion
              ? false
              : { opacity: 0, y: 34, scale: 0.975 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: reduceMotion ? 0 : compactMotion ? 0.5 : 1.05,
            delay: reduceMotion ? 0 : compactMotion ? 0.04 : 0.1,
            ease: cinematicEase,
          }}
        >
          {visual}
        </motion.div>
      </motion.div>
    </div>
  );
}

type CinematicStageProps = {
  children: ReactNode;
  className?: string;
};

export function CinematicStage({
  children,
  className,
}: CinematicStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const compactMotion = useCompactMotion();
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.28,
  });
  const y = useTransform(smoothProgress, [0, 0.28, 0.72, 1], [58, 0, 0, -28]);
  const scale = useTransform(
    smoothProgress,
    [0, 0.28, 0.72, 1],
    [0.94, 1, 1, 0.985],
  );
  const opacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.82, 1],
    [0.42, 1, 1, 0.72],
  );

  return (
    <motion.div
      ref={stageRef}
      className={className}
      style={reduceMotion || compactMotion ? undefined : { y, scale, opacity }}
    >
      {children}
    </motion.div>
  );
}

type ParallaxMediaProps = {
  children: ReactNode;
  className: string;
  strength?: number;
};

export function ParallaxMedia({
  children,
  className,
  strength = 28,
}: ParallaxMediaProps) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const compactMotion = useCompactMotion();
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.035, 1.01, 1.035]);
  const opacity = useTransform(scrollYProgress, [0, 0.22, 1], [0.5, 1, 1]);

  return (
    <motion.div
      ref={mediaRef}
      className={className}
      style={reduceMotion || compactMotion ? undefined : { opacity }}
    >
      <motion.div
        className={
          reduceMotion || compactMotion
            ? "parallax-media__inner parallax-media__inner--static"
            : "parallax-media__inner"
        }
        style={reduceMotion || compactMotion ? undefined : { y, scale }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function ProductionFlow({ items }: { items: string[] }) {
  const reduceMotion = useReducedMotion();
  const compactMotion = useCompactMotion();
  const itemVariants = {
    hidden: { opacity: 1, y: compactMotion ? 10 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: compactMotion ? 0.44 : 0.64,
        ease: cinematicEase,
      },
    },
  };

  return (
    <motion.div
      className="production-flow"
      role="list"
      aria-label="Reusable production system"
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.45 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduceMotion ? 0 : 0.14,
            delayChildren: reduceMotion ? 0 : 0.08,
          },
        },
      }}
    >
      <motion.span
        className="production-flow__progress"
        aria-hidden="true"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: reduceMotion ? 0 : 1.25, ease: cinematicEase }}
      />
      {items.map((item, index) => (
        <motion.div
          key={item}
          className="production-flow__item"
          role="listitem"
          variants={itemVariants}
        >
          <span>{item}</span>
          {index < items.length - 1 ? (
            <motion.span
              className="production-flow__arrow"
              aria-hidden="true"
              variants={{
                hidden: { opacity: 0, x: -8 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.45, ease: cinematicEase },
                },
              }}
            >
              <ArrowRight weight="regular" />
            </motion.span>
          ) : null}
        </motion.div>
      ))}
    </motion.div>
  );
}
