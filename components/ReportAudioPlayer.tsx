"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { RF_EVENTS } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";

/**
 * The transport for the audio overview.
 *
 * A custom player is normally the wrong trade — the native control is
 * keyboard-operable, screen-reader-labelled, and handles the OS media session
 * for free, and most hand-rolled ones lose all three. This one is built to keep
 * them, and the four decisions that do it are worth stating because each looks
 * like an implementation detail and is not:
 *
 * 1. **A real `<audio>` element stays in the DOM.** Not a `new Audio()` in a
 *    ref. It is what `<noscript>` degrades to and what the browser hands to the
 *    OS.
 * 2. **The scrubber is `<input type="range">`.** Not a `div role="slider"`.
 *    Arrow keys, Home/End, Page Up/Down, the correct ARIA semantics, and every
 *    screen reader's slider affordance arrive already working. This is the
 *    single highest-value decision in the file.
 * 3. **Media Session is wired explicitly**, which is what *recovers* the iOS
 *    lock-screen behaviour a custom player would otherwise lose — and improves
 *    on the native control, because it puts the report cover on the lock screen
 *    instead of a generic glyph.
 * 4. **No volume control.** iOS ignores the `volume` property entirely, so a
 *    slider there is dead UI on the platform most likely to be used for a
 *    22-minute listen. Hardware buttons already do this.
 *
 * The mark is passed in as `children` rather than drawn here: it comes from the
 * raymarch in `lib/ascii/monogram.ts`, which runs on the server and has no
 * business in a client bundle.
 */

/** 1× is the floor; a 22-minute conversation is what makes the rest worth it. */
const RATES = [1, 1.25, 1.5] as const;

/** Both directions. Long enough to escape a tangent, short enough to re-hear a figure. */
const SKIP = 15;

/**
 * "22:20" → 1340. Used only to give the scrubber a sane `max` before metadata
 * lands; the real duration replaces it the moment the browser reports one.
 *
 * Returns 0 for anything unparseable, which the callers treat as "unknown"
 * rather than as zero-length.
 */
function parseLength(length?: string): number {
  if (!length) return 0;

  const parts = length.split(":").map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return 0;

  // Accepts m:ss and h:mm:ss. Reduced from the left so both shapes work.
  return parts.reduce((total, part) => total * 60 + part, 0);
}

/** Seconds → "3:41" / "1:02:03". `--:--` while nothing is known. */
function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "--:--";

  const whole = Math.floor(seconds);
  const h = Math.floor(whole / 3600);
  const m = Math.floor((whole % 3600) / 60);
  const s = whole % 60;

  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

export default function ReportAudioPlayer({
  src,
  length,
  slug,
  title,
  cover,
  children,
}: {
  src: string;
  length?: string;
  slug: string;
  title: string;
  cover: string;
  /** The RF mark, rendered on the server. */
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const played = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [rate, setRate] = useState<number>(RATES[0]);

  // Seeded from the row rather than left at 0. iOS frequently withholds
  // `loadedmetadata` until the first interaction, so without this the total
  // reads `--:--` until someone presses play — on the one platform where the
  // reader is most likely to want to know the length before committing.
  const seeded = parseLength(length);
  const [duration, setDuration] = useState(seeded);

  /**
   * The OS media session: lock screen, notification shade, headphone buttons,
   * and the macOS Now Playing widget.
   *
   * Feature-detected rather than assumed — Safari on older iOS and every
   * non-Chromium desktop browser vary in what they expose, and an unguarded
   * `setActionHandler` for an unsupported action throws.
   */
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const audio = audioRef.current;
    if (!audio) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: "RegainFlow",
      album: "Reports",
      artwork: [{ src: cover, type: "image/png" }],
    });

    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => void audio.play()],
      ["pause", () => audio.pause()],
      ["seekbackward", () => (audio.currentTime -= SKIP)],
      ["seekforward", () => (audio.currentTime += SKIP)],
      [
        "seekto",
        (details) => {
          if (details.seekTime != null) audio.currentTime = details.seekTime;
        },
      ],
    ];

    for (const [action, handler] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // An action this browser does not implement. The rest still register.
      }
    }

    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          // Same reason as above; nothing to undo if it never registered.
        }
      }
    };
  }, [title, cover]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) void audio.play();
    else audio.pause();
  }

  function skip(by: number) {
    const audio = audioRef.current;
    if (!audio) return;

    // Clamped, because assigning past the end fires `ended` on some browsers
    // and silently does nothing on others.
    audio.currentTime = Math.min(
      Math.max(audio.currentTime + by, 0),
      audio.duration || duration || 0,
    );
  }

  function cycleRate() {
    const audio = audioRef.current;
    if (!audio) return;

    const next = RATES[(RATES.indexOf(rate as (typeof RATES)[number]) + 1) % RATES.length];
    audio.playbackRate = next;
    setRate(next);
  }

  const max = duration || seeded || 0;

  return (
    <div className="rf-audio">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="rf-eyebrow">Audio overview</p>
        {length ? <p className="rf-utility">{length}</p> : null}
      </div>

      {/* No `controls`, so the element has no intrinsic size and draws nothing —
          which is how it stays invisible without an `sr-only` clip that would
          also have to be reasoned about. It is still a real, fully functional
          media element: the OS talks to this, not to the buttons below. */}
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
        onPlay={() => {
          setPlaying(true);

          // Once per page view. A listener who scrubs back to the start would
          // otherwise register as a second listener.
          if (played.current) return;
          played.current = true;
          track(RF_EVENTS.podcastPlayed, { report: slug });
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      >
        {/* `type="audio/mp4"` covers what Gemini's audio overview exports. An
            MP4 container with an AAC track plays through `<audio>` in every
            current browser, and a stray video track is ignored — so the
            `.mp4` / `.m4a` question does not need answering. */}
        <source src={src} type="audio/mp4" />
      </audio>

      <div className="rf-audio-body">
        <div className="rf-audio-mark" aria-hidden="true">
          {children}
        </div>

        <div className="rf-audio-main">
          <p className="rf-body max-w-[46ch]">
            The report as a conversation — the same findings, discussed. Useful
            if you would rather listen on the drive than read at a desk.
          </p>

          <div className="rf-audio-scrub">
            {/* A range input, not a div. Everything a scrubber has to support
                for a keyboard or a screen reader is already in this element. */}
            <input
              type="range"
              className="rf-audio-range"
              min={0}
              max={max || 1}
              // `any`, so a drag is continuous rather than stepping in whole
              // seconds across a 22-minute track.
              step="any"
              value={Math.min(current, max || 1)}
              disabled={!max}
              aria-label="Seek"
              aria-valuetext={`${clock(current)} of ${clock(max)}`}
              onChange={(event) => {
                const to = Number(event.target.value);
                setCurrent(to);
                if (audioRef.current) audioRef.current.currentTime = to;
              }}
              style={{
                // Fills the track left of the handle. A custom property rather
                // than a background gradient rebuilt in JS, so the CSS owns the
                // colours and this owns only the number.
                ["--rf-progress" as string]: `${max ? (current / max) * 100 : 0}%`,
              }}
            />

            <button
              type="button"
              className="rf-audio-rate"
              onClick={cycleRate}
              aria-label={`Playback speed: ${rate}×. Press to change.`}
            >
              {rate}×
            </button>
          </div>

          <div className="rf-audio-times">
            {/* `tabular-nums` in the CSS: without it the whole row shifts every
                time a digit changes. */}
            <span className="rf-utility">{clock(current)}</span>
            <span className="rf-utility">{clock(max)}</span>
          </div>
        </div>
      </div>

      <div className="rf-audio-transport">
        <button
          type="button"
          className="rf-audio-skip"
          onClick={() => skip(-SKIP)}
          aria-label={`Back ${SKIP} seconds`}
        >
          <span aria-hidden="true">↺{SKIP}</span>
        </button>

        <button
          type="button"
          className="rf-audio-play"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
        >
          {/* Drawn rather than typed. A glyph font would render the play
              triangle at a different weight per platform, and these sit inside
              a 44px target where that is visible. */}
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {playing ? (
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
            ) : (
              <path d="M8 5l11 7-11 7z" fill="currentColor" />
            )}
          </svg>
        </button>

        <button
          type="button"
          className="rf-audio-skip"
          onClick={() => skip(SKIP)}
          aria-label={`Forward ${SKIP} seconds`}
        >
          <span aria-hidden="true">{SKIP}↻</span>
        </button>
      </div>

      {/* The floor this site holds to: content is present when JavaScript is
          not (`docs/DESIGN.md` §6). Everything above is script-driven, so
          without this the audio would simply be gone. */}
      <noscript>
        <audio controls preload="metadata" className="rf-audio-native">
          <source src={src} type="audio/mp4" />
          <a href={src} className="rf-text-link">
            Download the audio overview
          </a>
        </audio>
      </noscript>
    </div>
  );
}
