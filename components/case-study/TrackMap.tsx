import DitherReveal from "@/components/DitherReveal";
import type { Track } from "@/lib/content/case-studies";

/**
 * An engagement that ran in parallel tracks, laid out as the two different
 * pieces of work they were.
 *
 * This is the signature of any study that fills `tracks`, and the layout is
 * making an argument: the tracks sit side by side under one heading because
 * they came from one engagement, and they are separated by a real rule rather
 * than a gap because they solved genuinely different problems. Two identical
 * cards would say the opposite — that this was the same thing delivered twice.
 *
 * Each column runs key → what it was trying to achieve → the one idea it turned
 * on → the environment → what was demonstrated. The thesis is set apart because
 * it is the sentence a reader should leave with if they read nothing else in
 * the column.
 *
 * Motion is one staggered reveal per column and nothing else. `DitherReveal`
 * already returns children unanimated under `prefers-reduced-motion`, so this
 * needs no guard of its own.
 *
 * A server component: no state, and it renders on a dynamic route where a
 * client boundary would buy nothing.
 */
export default function TrackMap({ tracks }: { tracks: Track[] }) {
  return (
    <div className="rf-tracks">
      {tracks.map((track, i) => (
        // Staggered so the second column arrives just behind the first, which
        // is the one place this page uses motion to say "these are a pair".
        <DitherReveal key={track.key} delay={i * 120}>
          <article>
            <div className="flex items-center gap-3">
              <span className="rf-track-key" aria-hidden="true">
                {track.key}
              </span>
              {/* The key is decorative above; the heading carries it for a
                  screen reader so "Track A" is announced rather than a letter
                  floating loose in the outline. */}
              <h3 className="rf-h3">
                <span className="sr-only">Track {track.key}: </span>
                {track.label}
              </h3>
            </div>

            <p className="rf-track-thesis mt-5">{track.thesis}</p>

            <p className="rf-utility mt-8">Context</p>
            <ul className="mt-3 flex flex-col gap-2">
              {track.context.map((item) => (
                <li key={item} className="rf-body flex gap-3">
                  <span className="rf-route-tick" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="rf-utility mt-7">Demonstrated</p>
            <ul className="rf-tags mt-3">
              {track.demos.map((demo) => (
                <li key={demo} className="rf-tag">
                  {demo}
                </li>
              ))}
            </ul>
          </article>
        </DitherReveal>
      ))}
    </div>
  );
}
