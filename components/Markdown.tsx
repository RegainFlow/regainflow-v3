import Image from "next/image";
import Link from "next/link";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { Bars, Callout, Steps } from "@/components/BlogFigures";
import BlogVideo from "@/components/BlogVideo";
import {
  parseBars,
  parseCallout,
  parseImageSize,
  parseSteps,
  parseVideo,
} from "@/lib/blog-figures";
import { isLoopbackImage } from "@/lib/content/blog";

/**
 * A blog post body. Server-rendered, so the text is in the HTML a crawler sees.
 *
 * - **Raw HTML is not rendered** — react-markdown's default, left alone. The
 *   body comes from a table row, and an escaped `<script>` is the right outcome.
 * - **Headings get ids** from `rehype-slug`, which `lib/blog-toc.ts` mirrors, so
 *   the table of contents and deep links resolve.
 * - `#` is demoted to an `<h2>`: the page owns the one `<h1>`.
 * - An image alone in a paragraph becomes a `<figure>`, with its markdown title
 *   as the caption: `![alt](src "caption")`. It keeps its own shape: a
 *   `#<w>x<h>` size on the URL (the pipeline writes it) renders it at that
 *   ratio, and without one it is letterboxed, never cropped.
 * - ` ```callout `, ` ```steps `, ` ```bars ` and ` ```video ` fences render
 *   as figures — see `lib/blog-figures.ts`. A malformed one falls through to a
 *   code block.
 * - GFM footnotes render as the post's "Sources" list.
 *
 * `insertBefore` places a node (the inline CTA) immediately before the heading
 * with that id. Done here rather than by splitting the markdown in two, because
 * a split would orphan every footnote referenced above the cut.
 */
export default function Markdown({
  children,
  insertBefore,
}: {
  children: string;
  insertBefore?: { id: string; node: ReactNode };
}) {
  const components: Components = {
    h1: ({ id, children }) => <h2 id={id}>{children}</h2>,
    h2: ({ id, children }) => (
      <>
        {insertBefore && id === insertBefore.id ? insertBefore.node : null}
        <h2 id={id}>{children}</h2>
      </>
    ),
    a: ({ href = "", children, ...rest }) => {
      // Footnote references and back-links carry data attributes GFM relies on.
      const data = Object.fromEntries(
        Object.entries(rest).filter(([key]) => key.startsWith("data-")),
      );

      // Same-site links go through the router and stay in the tab, as the
      // research asks for internal links; anything else opens a new tab rather
      // than taking the reader out of the article.
      return href.startsWith("/") || href.startsWith("#") ? (
        <Link href={href} {...data}>
          {children}
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" {...data}>
          {children}
        </a>
      );
    },
    p: ({ node, children }) => {
      const only = node?.children.length === 1 ? node.children[0] : undefined;

      if (only?.type === "element" && only.tagName === "img") {
        const { src, alt, title } = only.properties as {
          src?: string;
          alt?: string;
          title?: string;
        };

        if (src) {
          const image = parseImageSize(src);
          const text = alt ?? "";
          const common = {
            src: image.src,
            sizes: "(min-width: 1024px) 704px, 100vw",
            unoptimized: isLoopbackImage(image.src),
          };

          return (
            <figure className="rf-figure rf-figure-image">
              {image.width && image.height ? (
                <div className="rf-figure-frame">
                  <Image {...common} alt={text} width={image.width} height={image.height} />
                </div>
              ) : (
                <div className="rf-figure-frame rf-figure-frame-unsized">
                  <Image {...common} alt={text} fill />
                </div>
              )}
              {title ? <figcaption>{title}</figcaption> : null}
            </figure>
          );
        }
      }

      return <p>{children}</p>;
    },
    pre: ({ children }) => {
      const code = isValidElement(children)
        ? (children as ReactElement<{ className?: string; children?: ReactNode }>)
        : null;
      const language = code?.props.className?.replace(/^language-/, "");
      const text = String(code?.props.children ?? "").trim();

      if (language === "callout") {
        const figure = parseCallout(text);
        if (figure) return <Callout figure={figure} />;
      }
      if (language === "steps") {
        const figure = parseSteps(text);
        if (figure) return <Steps figure={figure} />;
      }
      if (language === "bars") {
        const figure = parseBars(text);
        if (figure) return <Bars figure={figure} />;
      }
      if (language === "video") {
        const figure = parseVideo(text);
        if (figure) return <BlogVideo figure={figure} />;
      }

      return <pre>{children}</pre>;
    },
    table: ({ children }) => (
      // Focusable so a keyboard user can scroll a wide table.
      <div className="rf-table-wrap" tabIndex={0} role="region" aria-label="Table">
        <table>{children}</table>
      </div>
    ),
    section: ({ children, ...rest }) =>
      "data-footnotes" in rest ? (
        <section className="rf-footnotes" data-footnotes>
          {children}
        </section>
      ) : (
        <section>{children}</section>
      ),
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
      remarkRehypeOptions={{
        footnoteLabel: "Sources",
        footnoteLabelTagName: "h2",
        // Visible, not the `sr-only` default: a cited source is a trust
        // signal for every reader, not only for a screen reader.
        footnoteLabelProperties: { className: [] },
        footnoteBackLabel: "Back to the text",
      }}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
}

