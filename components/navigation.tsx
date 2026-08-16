"use client";

import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/brand";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#process", label: "Process" },
  { href: "/#standards", label: "Standards" },
];

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const trigger = toggleRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    firstLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      (previousFocus ?? trigger)?.focus();
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Brand onClick={() => setMenuOpen(false)} />

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/#pilot" className="button button--compact desktop-cta">
          Request a pilot
          <ArrowUpRight aria-hidden="true" weight="bold" />
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <List aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            ref={menuRef}
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile navigation"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
          >
            <div className="mobile-menu__links">
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#pilot"
                className="button"
                onClick={() => setMenuOpen(false)}
              >
                Request a pilot
                <ArrowUpRight aria-hidden="true" weight="bold" />
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
