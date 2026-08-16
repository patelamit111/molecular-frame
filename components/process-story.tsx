"use client";

import {
  Atom,
  MagnifyingGlass,
  PencilLine,
  ShieldCheck,
  type Icon,
} from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { useRef } from "react";

type ProcessItem = {
  title: string;
  description: string;
  detail: string;
  icon: Icon;
};

const processItems: ProcessItem[] = [
  {
    title: "Evidence first",
    description:
      "We begin with the source material, claim boundaries, and the audience that needs to understand it.",
    detail: "References, labels, manuscripts, structures",
    icon: MagnifyingGlass,
  },
  {
    title: "Narrative architecture",
    description:
      "The mechanism becomes a precise visual argument before a single frame enters production.",
    detail: "Script, claim map, storyboard, visual rules",
    icon: PencilLine,
  },
  {
    title: "Controlled generation",
    description:
      "Deterministic scientific anchors guide AI-assisted image, motion, voice, and finishing passes.",
    detail: "Locked assets, shot recipes, version history",
    icon: Atom,
  },
  {
    title: "Review-ready delivery",
    description:
      "Every scene is packaged for clear feedback, traceable revisions, and channel-specific masters.",
    detail: "Review cuts, captions, source notes, masters",
    icon: ShieldCheck,
  },
];

export function ProcessStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.72", "end 0.72"],
  });

  return (
    <section id="process" ref={sectionRef} className="process-section">
      <div className="section-shell process-layout">
        <div className="process-intro">
          <p className="section-kicker">From source to screen</p>
          <h2>More control at every frame.</h2>
          <p>
            AI accelerates production. A structured scientific workflow keeps
            the story coherent and reviewable.
          </p>
        </div>

        <div className="process-track">
          <div className="process-line" aria-hidden="true">
            <motion.span
              style={
                reduceMotion
                  ? { scaleY: 1 }
                  : { scaleY: scrollYProgress }
              }
            />
          </div>
          {processItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <article
                key={item.title}
                className="process-item"
              >
                <div className="process-item__icon" aria-hidden="true">
                  <IconComponent weight="regular" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>{item.detail}</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
