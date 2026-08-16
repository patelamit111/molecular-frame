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
import { aspirinMedia } from "@/lib/site";

type FilmContextValue = {
  openFilm: () => void;
};

const FilmContext = createContext<FilmContextValue | null>(null);

export function FilmModalProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [mediaError, setMediaError] = useState(false);

  const openFilm = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    setMediaError(false);
    dialog.showModal();
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => {
      void videoRef.current?.play().catch(() => undefined);
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
              <p className="film-dialog__label">Independent concept film</p>
              <h2 id="film-title">Aspirin: platelet inhibition</h2>
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

          {mediaError ? (
            <div className="film-dialog__fallback" role="status">
              <p>The film could not load in this preview.</p>
              <Link
                href="/#pilot"
                className="text-link"
                onClick={closeFilm}
              >
                Open the pilot brief
              </Link>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="film-dialog__video"
              controls
              playsInline
              preload="metadata"
              poster={aspirinMedia.poster}
              onError={() => setMediaError(true)}
            >
              <source src={aspirinMedia.film} type="video/mp4" />
              <track
                kind="captions"
                src={aspirinMedia.captions}
                srcLang="en"
                label="English"
                default
              />
              Your browser does not support HTML video.
            </video>
          )}
          <p className="film-dialog__note">
            Simplified scientific visualization. Not medical advice.
          </p>
        </div>
      </dialog>
    </FilmContext.Provider>
  );
}

type WatchFilmButtonProps = {
  className?: string;
  label?: string;
};

export function WatchFilmButton({
  className = "button button--secondary",
  label = "Watch the film",
}: WatchFilmButtonProps) {
  const context = useContext(FilmContext);
  if (!context) {
    throw new Error("WatchFilmButton must be used inside FilmModalProvider");
  }

  return (
    <button type="button" className={className} onClick={context.openFilm}>
      <Play aria-hidden="true" weight="fill" />
      {label}
    </button>
  );
}
