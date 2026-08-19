import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Brand } from "@/components/brand";
import { ConceptFilm } from "@/components/concept-film";
import { WatchFilmButton } from "@/components/film-modal";
import { HeroMedia } from "@/components/hero-media";
import { PilotForm } from "@/components/pilot-form";
import { Reveal } from "@/components/reveal";
import { CinematicStage, HeroScrollScene } from "@/components/scroll-scenes";
import { siteConfig, type FilmId } from "@/lib/site";

type ConceptStudy = {
  title: string;
  scope: string;
  src: string;
  poster: string;
  className: string;
  filmId?: FilmId;
};

const conceptFilms: readonly ConceptStudy[] = [
  {
    title: "Linsitinib",
    scope: "Human scale to IGF-1R signaling",
    src: "/media/concepts/linsitinib/linsitinib-hero-loop.mp4",
    poster: "/media/concepts/linsitinib/linsitinib-poster.webp",
    className: "concept-study concept-study--feature",
    filmId: "linsitinib",
  },
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

const offerings = [
  {
    number: "01",
    title: "Mechanism-of-action films",
    description:
      "Bring molecular interactions, pathways, and patient relevance into one clear visual narrative.",
  },
  {
    number: "02",
    title: "Scientific and medical storytelling",
    description:
      "Turn dense evidence into memorable films for medical affairs, education, and stakeholder engagement.",
  },
  {
    number: "03",
    title: "Launch, congress, and campaign content",
    description:
      "Extend a flagship story into cutdowns, silent loops, social assets, and presentation-ready visuals.",
  },
] as const;

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
    "Pharmaceutical launch and congress content",
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
          <HeroScrollScene visual={<HeroMedia />}>
            <>
              <p className="hero-eyebrow">Scientific films for pharma</p>
              <h1>
                Make the science
                <span>impossible to miss.</span>
              </h1>
              <p className="hero-lede">
                Cinematic mechanism-of-action and medical films that turn
                complex science into clear, memorable stories.
              </p>
              <div className="button-group">
                <Link href="#work" className="button">
                  View selected work
                  <ArrowRight aria-hidden="true" weight="bold" />
                </Link>
                <WatchFilmButton label="Watch featured film" />
              </div>
            </>
          </HeroScrollScene>
        </section>

        <section
          id="work"
          className="flagship-section"
          aria-labelledby="flagship-title"
        >
          <CinematicStage className="flagship-stage">
            <HeroMedia active={false} />
            <WatchFilmButton
              className="film-play-button"
              label="Watch film"
            />
          </CinematicStage>
          <div className="section-shell flagship-copy">
            <Reveal distance={42}>
              <p className="project-label">Featured independent concept film</p>
              <h2 id="flagship-title">Aspirin, seen at platelet scale.</h2>
            </Reveal>
            <Reveal
              className="flagship-description"
              delay={0.08}
              direction="right"
              distance={32}
            >
              <p>
                A molecular-scale story of platelet inhibition, designed to make
                a familiar mechanism feel immediate and memorable.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="work-section" aria-labelledby="work-title">
          <div className="section-shell">
            <Reveal className="section-heading">
              <p className="section-kicker">Selected work</p>
              <h2 id="work-title">More from the gallery.</h2>
              <p>
                Independent studies across molecular, pathway, anatomical, and
                human scale.
              </p>
            </Reveal>

            <div className="concept-grid">
              {conceptFilms.map((film, index) => (
                <Reveal
                  key={film.title}
                  className={film.className}
                  delay={index * 0.06}
                  amount={0.12}
                  direction={
                    index === 0
                      ? "up"
                      : index === 1
                        ? "left"
                        : index === 2
                          ? "right"
                          : "up"
                  }
                  distance={index === 0 ? 34 : index === 3 ? 38 : 46}
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
                    <div className="concept-caption__meta">
                      <span>{film.scope}</span>
                      {film.filmId ? (
                        <WatchFilmButton
                          filmId={film.filmId}
                          className="concept-watch-button"
                          label="Watch film"
                          ariaLabel={`Watch the ${film.title} concept film`}
                        />
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="services"
          className="services-section"
          aria-labelledby="services-title"
        >
          <div className="section-shell services-layout">
            <Reveal className="services-heading" direction="left" distance={34}>
              <p className="section-kicker">What we create</p>
              <h2 id="services-title">
                Films built for the moment the science needs to land.
              </h2>
              <p>
                From a flagship film to the supporting content around it, we
                create visual stories for the audiences and channels that matter.
              </p>
            </Reveal>

            <div className="services-list">
              {offerings.map((offering, index) => (
                <Reveal
                  key={offering.title}
                  className="service-item"
                  delay={index * 0.07}
                  direction="right"
                  distance={28}
                >
                  <span className="service-item__number" aria-hidden="true">
                    {offering.number}
                  </span>
                  <h3>{offering.title}</h3>
                  <p>{offering.description}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="pilot-section"
          aria-labelledby="contact-title"
        >
          <div className="section-shell pilot-layout">
            <Reveal className="pilot-copy" direction="left" distance={34}>
              <p className="pilot-kicker">Start a project</p>
              <h2 id="contact-title">Have a complex story to tell?</h2>
              <p>
                Tell us the science, the audience, and the moment it needs to
                serve. We will come back with a focused way to bring it to screen.
              </p>
            </Reveal>
            <Reveal
              className="pilot-form-wrap"
              delay={0.1}
              amount={0.1}
              direction="right"
              distance={34}
            >
              <PilotForm />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell site-footer__inner">
          <div className="site-footer__brand">
            <Brand />
            <p>Cinematic films for complex pharmaceutical science.</p>
          </div>
          <div className="site-footer__links">
            <Link href="/#work">Work</Link>
            <Link href="/#services">Services</Link>
            <Link href="/#contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
          <p className="site-footer__legal">
            Independent concept studies are clearly labeled. Not medical advice.
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
