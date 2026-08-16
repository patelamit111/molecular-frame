import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
} from "@phosphor-icons/react/dist/ssr";
import { Brand } from "@/components/brand";
import { ConceptFilm } from "@/components/concept-film";
import { WatchFilmButton } from "@/components/film-modal";
import { HeroMedia } from "@/components/hero-media";
import { PilotForm } from "@/components/pilot-form";
import { ProcessStory } from "@/components/process-story";
import { Reveal } from "@/components/reveal";
import { siteConfig } from "@/lib/site";

const conceptFilms = [
  {
    title: "Dantrolene",
    scope: "RyR1 binding and calcium release",
    src: "/media/concepts/dantrolene-loop.mp4",
    poster: "/media/concepts/dantrolene-poster.webp",
    className: "concept-study concept-study--primary",
  },
  {
    title: "Atorvastatin",
    scope: "HMG-CoA reductase inhibition",
    src: "/media/concepts/atorvastatin-loop.mp4",
    poster: "/media/concepts/atorvastatin-poster.webp",
    className: "concept-study concept-study--wide",
  },
  {
    title: "Teprotumumab",
    scope: "IGF-1R pathway visualization",
    src: "/media/concepts/teprotumumab-loop.mp4",
    poster: "/media/concepts/teprotumumab-poster.webp",
    className: "concept-study concept-study--wide concept-study--offset",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  areaServed: "Worldwide",
  serviceType: [
    "Pharmaceutical mechanism of action films",
    "Scientific visualization",
    "Medical animation",
  ],
  audience: {
    "@type": "BusinessAudience",
    audienceType:
      "Pharmaceutical medical affairs, scientific communications, and brand teams",
  },
};

export default function Home() {
  return (
    <>
      <main id="main-content">
        <section className="hero-section">
          <div className="section-shell hero-grid">
            <div className="hero-copy">
              <p className="hero-eyebrow">AI-native pharma film studio</p>
              <h1>
                Pharma stories,
                <span>built at molecular speed.</span>
              </h1>
              <p className="hero-lede">
                AI-native films that make complex science clear, cinematic, and
                ready for rigorous review.
              </p>
              <div className="button-group">
                <Link href="#pilot" className="button">
                  Request a pilot
                  <ArrowUpRight aria-hidden="true" weight="bold" />
                </Link>
                <WatchFilmButton />
              </div>
            </div>

            <div className="hero-visual">
              <HeroMedia />
            </div>
          </div>
        </section>

        <section className="flagship-section" aria-labelledby="flagship-title">
          <div className="flagship-stage">
            <HeroMedia active={false} />
            <WatchFilmButton
              className="film-play-button"
              label="Play flagship film"
            />
          </div>
          <div className="section-shell flagship-copy">
            <Reveal>
              <p className="project-label">Independent concept film</p>
              <h2 id="flagship-title">Aspirin, seen at platelet scale.</h2>
            </Reveal>
            <Reveal className="flagship-description" delay={0.08}>
              <p>
                A concise visual story of COX-1 acetylation, reduced thromboxane
                signaling, and reduced platelet amplification.
              </p>
              <div className="source-links">
                <a
                  href="https://www.rcsb.org/structure/3N8Y"
                  target="_blank"
                  rel="noreferrer"
                >
                  Structural reference: PDB 3N8Y
                  <ArrowUpRight aria-hidden="true" />
                </a>
                <a
                  href="https://www.ncbi.nlm.nih.gov/books/NBK261078/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Mechanism reference: NCBI
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="work" className="work-section" aria-labelledby="work-title">
          <div className="section-shell">
            <Reveal className="section-heading">
              <h2 id="work-title">Science with a pulse.</h2>
              <p>
                Each study explores a different way to balance molecular detail,
                spatial understanding, and brand-level craft.
              </p>
            </Reveal>

            <div className="concept-grid">
              {conceptFilms.map((film, index) => (
                <Reveal
                  key={film.title}
                  className={film.className}
                  delay={index * 0.06}
                  amount={0.12}
                >
                  <div className="concept-media">
                    <ConceptFilm
                      src={film.src}
                      poster={film.poster}
                    />
                  </div>
                  <div className="concept-caption">
                    <div>
                      <p>Independent concept study</p>
                      <h3>{film.title}</h3>
                    </div>
                    <span>{film.scope}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <ProcessStory />

        <section className="system-section" aria-labelledby="system-title">
          <div className="section-shell system-layout">
            <Reveal className="system-copy">
              <h2 id="system-title">A studio now. A system underneath.</h2>
              <p>
                Every film is organized as reusable evidence, claims, shots, and
                masters. Revisions stay connected to the science behind them.
              </p>
            </Reveal>

            <Reveal className="production-system" delay={0.1}>
              <div className="production-system__image">
                <Image
                  src="/media/concepts/dantrolene-poster.webp"
                  alt="Molecular binding visualization from an independent Dantrolene concept study"
                  fill
                  sizes="(max-width: 768px) 100vw, 56vw"
                />
              </div>
              <div
                className="production-flow"
                role="list"
                aria-label="Reusable production system"
              >
                {["Evidence", "Claims", "Shots", "Masters"].map(
                  (item, index, all) => (
                    <div
                      key={item}
                      className="production-flow__item"
                      role="listitem"
                    >
                      <span>{item}</span>
                      {index < all.length - 1 ? (
                        <ArrowRight aria-hidden="true" />
                      ) : null}
                    </div>
                  ),
                )}
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="standards"
          className="standards-section"
          aria-labelledby="standards-title"
        >
          <div className="section-shell">
            <Reveal className="standards-heading">
              <p className="section-kicker">Scientific standards</p>
              <h2 id="standards-title">
                Show what is known. Mark what is simplified.
              </h2>
            </Reveal>

            <div className="standards-composition">
              <Reveal className="standards-image" amount={0.2}>
                <Image
                  src="/media/concepts/atorvastatin-poster.webp"
                  alt="Protein and ligand visualization from an independent Atorvastatin concept study"
                  fill
                  sizes="(max-width: 768px) 100vw, 54vw"
                />
              </Reveal>
              <Reveal className="standards-principles" delay={0.08}>
                <article>
                  <Check aria-hidden="true" weight="bold" />
                  <div>
                    <h3>Structural anchors</h3>
                    <p>
                      Use traceable references for molecules, proteins, and
                      clinically meaningful relationships.
                    </p>
                  </div>
                </article>
                <article>
                  <Check aria-hidden="true" weight="bold" />
                  <div>
                    <h3>Declared simplification</h3>
                    <p>
                      Separate exact structural views from conceptual scenes that
                      are designed for understanding.
                    </p>
                  </div>
                </article>
                <article>
                  <Check aria-hidden="true" weight="bold" />
                  <div>
                    <h3>Reviewable provenance</h3>
                    <p>
                      Keep source notes, claim context, and revision history tied
                      to the frames they inform.
                    </p>
                  </div>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="pilot" className="pilot-section" aria-labelledby="pilot-title">
          <div className="section-shell pilot-layout">
            <Reveal className="pilot-copy">
              <p className="pilot-kicker">Start with one important story</p>
              <h2 id="pilot-title">Bring us the mechanism that needs a film.</h2>
              <p>
                Tell us the audience, review context, and what must become clear.
                We will shape the right pilot.
              </p>
            </Reveal>
            <Reveal className="pilot-form-wrap" delay={0.1} amount={0.1}>
              <PilotForm />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell site-footer__inner">
          <div className="site-footer__brand">
            <Brand />
            <p>AI-native films for complex pharmaceutical science.</p>
          </div>
          <div className="site-footer__links">
            <Link href="/#work">Work</Link>
            <Link href="/#process">Process</Link>
            <Link href="/#standards">Standards</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
          <p className="site-footer__legal">
            Independent concept studies. Not medical advice.
          </p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
