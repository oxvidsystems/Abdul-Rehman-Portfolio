"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Global "View Resume" popup. Fired from anywhere on the site (Hero CTA,
 * Contact CTA, ...) via `openResumeModal()` — a plain custom DOM event, so
 * unrelated components don't need shared state/context to trigger it.
 *
 * Mounted once in SiteShell so it sits above everything, same pattern as
 * ChatWidget.
 */
const OPEN_EVENT = "oxvid:open-resume";

export function openResumeModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OPEN_EVENT));
  }
}

export function ResumeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  /* Escape closes, and body scroll is locked while the popup is up. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Abdul Rehman — Resume"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm lg:p-10"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden bg-paper-0 shadow-lg">
        <div className="flex shrink-0 items-center justify-between border-b border-paper-300 bg-ink-900 px-5 py-3">
          <p className="font-mono text-micro tracking-widest text-paper-0">
            ABDUL REHMAN &nbsp;·&nbsp; RESUME
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/resume.pdf"
              download="Abdul-Rehman-Resume.pdf"
              className="font-mono text-micro tracking-widest text-paper-0/70 underline-offset-4 transition-colors hover:text-accent-mint hover:underline"
            >
              DOWNLOAD
            </a>
            <button
              type="button"
              onClick={close}
              aria-label="Close resume"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-paper-0/25 text-paper-0 transition-colors hover:border-accent-mint hover:text-accent-mint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal"
            >
              <span aria-hidden>&times;</span>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 bg-ink-100">
          <iframe
            src="/resume.pdf#view=FitH"
            title="Abdul Rehman — Resume"
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
