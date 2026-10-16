"use client";

import Image from "next/image";
import { useState } from "react";

import Icon from "@/components/Icon";
import { RF_EVENTS } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";
import type { VideoFigure } from "@/lib/blog-figures";

/**
 * A YouTube video behind a click-to-load facade.
 *
 * The player is roughly a megabyte of third-party script, and most readers
 * never press play, so the page ships a still and a button instead
 * (`docs/blogs_seo/blog_ui_ux.md`, Part 7). The box is 16:9 from the first
 * paint, so swapping in the iframe moves nothing.
 *
 * `youtube-nocookie.com` keeps YouTube's cookies off the page until the reader
 * opts in by pressing play. The id was validated by `parseVideo`, so the URL is
 * built rather than trusted.
 */
export default function BlogVideo({ figure }: { figure: VideoFigure }) {
  const [playing, setPlaying] = useState(false);
  const label = `Play video: ${figure.title}`;

  return (
    <figure className="rf-figure rf-figure-video">
      <div className="rf-video">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${figure.youtube}?autoplay=1&rel=0`}
            title={figure.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="rf-video-facade"
            aria-label={label}
            onClick={() => {
              track(RF_EVENTS.blogVideoPlayed, { video: figure.youtube });
              setPlaying(true);
            }}
          >
            <Image
              src={`https://i.ytimg.com/vi/${figure.youtube}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 1024px) 704px, 100vw"
            />
            <span className="rf-video-play">
              <Icon name="play" className="h-6 w-6" />
            </span>
          </button>
        )}
      </div>
      {figure.caption ? <figcaption>{figure.caption}</figcaption> : null}
    </figure>
  );
}
