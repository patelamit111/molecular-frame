"use client";

import { Play, X } from "@phosphor-icons/react";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { filmCatalog, type FilmId } from "@/lib/site";

type FilmContextValue = {
  openFilm: (filmId?: FilmId) => void;
};

const FilmContext = createContext<FilmContextValue | null>(null);

export function FilmModalProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [activeFilmId, setActiveFilmId] = useState<FilmId>("aspirin");
  const [mediaError, setMediaError] = useState(false);
  const [mediaMounted, setMediaMounted] = useState(false);
  const activeFilm = filmCatalog[activeFilmId];

  const openFilm = useCallback((filmId: FilmId = "aspirin") => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    setActiveFilmId(filmId);
    setMediaError(false);
    setMediaMounted(true);
    dialog.showModal();
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        void videoRef.current?.play().catch(() => undefined);
      });
    });
  }, []);

  const closeFilm = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const handleClose = useCallback(() => {
    videoRef.current?.pause();
    document.body.classList.remove("modal-open");
    openerRef.current?.focus();
  }, []);

  return (
    <FilmContext.Provider value={{ openFilm }}>
      {children}
      <dialog
        ref={dialogRef}
        className="film-dialog"
        aria-labelledby="film-title"
        onClose={handleClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeFilm();
        }}
      >
        <div className="film-dialog__panel">
          <div className="film-dialog__header">
            <div>
              <p className="film-dialog__label">{activeFilm.label}</p>
              <h2 id="film-title">{activeFilm.title}</h2>
            </div>
            <button
              type="button"
              className="icon-button"
              onClick={closeFilm}
              aria-label="Close film"
              autoFocus
            >
              <X aria-hidden="true" />
            </button>
          </div>

          {!mediaMounted ? null : mediaError ? (
            <div className="film-dialog__fallback" role="status">
              <p>The film could not load in this preview.</p>
              <Link
                href="/#contact"
                className="text-link"
                onClick={closeFilm}
              >
                Open the project brief
              </Link>
            </div>
          ) : (
            <video
              key={activeFilmId}
              ref={videoRef}
              className="film-dialog__video"
              controls
              playsInline
              preload="metadata"
              poster={activeFilm.poster}
              onError={() => setMediaError(true)}
            >
              <source src={activeFilm.film} type="video/mp4" />
              <track
                kind="captions"
                src={activeFilm.captions}
                srcLang="en"
                label="English"
                default
              />
              Your browser does not support HTML video.
            </video>
          )}
          <p className="film-dialog__note">{activeFilm.note}</p>
        </div>
      </dialog>
    </FilmContext.Provider>
  );
}

type WatchFilmButtonProps = {
  className?: string;
  label?: string;
  filmId?: FilmId;
  ariaLabel?: string;
};

export function WatchFilmButton({
  className = "button button--secondary",
  label = "Watch film",
  filmId = "aspirin",
  ariaLabel,
}: WatchFilmButtonProps) {
  const context = useContext(FilmContext);
  if (!context) {
    throw new Error("WatchFilmButton must be used inside FilmModalProvider");
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => context.openFilm(filmId)}
      aria-label={ariaLabel}
    >
      <Play aria-hidden="true" weight="fill" />
      {label}
    </button>
  );
}
