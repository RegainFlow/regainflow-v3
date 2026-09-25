import Image from "next/image";
import type { ReactNode } from "react";

import DocHeader from "@/components/gov/DocHeader";
import { RF_EVENTS } from "@/lib/analytics/events";

/**
 * A gov document, shown two ways at once: the PDF as it will arrive, and the
 * same content laid out as a page underneath.
 *
 * The preview is page one of the real file, rendered to an image by
 * `pnpm gov:pdf` — so it is exactly what downloads, and it looks the same on a
 * phone as on a desktop. Clicking it opens the PDF full size.
 *
 * The preview band is hidden in print (`.rf-doc-preview-band`), which matters:
 * the past performance PDF is printed *from* this page, and without that rule
 * it would contain a picture of itself.
 */
export default function DocumentPage({
  eyebrow,
  title,
  lead,
  pdf,
  fileName,
  document,
  preview,
  pages,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  /** Same-origin path, so `download` is honoured. */
  pdf: string;
  fileName: string;
  /** Analytics name, e.g. `capability_statement`. */
  document: string;
  preview: { src: string; width: number; height: number };
  /** Shown beside the preview, e.g. "One page". */
  pages: string;
  children: ReactNode;
}) {
  return (
    <>
      {/* The printed page has no header, so it carries its own masthead.
          This is also the top of the generated past performance PDF. */}
      <div className="rf-print-only rf-shell">
        <div className="flex items-baseline justify-between border-b border-rf-hairline pb-3">
          <span className="rf-wordmark">RegainFlow</span>
          <span className="rf-utility">gov.regainflow.com</span>
        </div>
      </div>

      <DocHeader eyebrow={eyebrow} title={title} lead={lead} />

      <section className="rf-section rf-doc-preview-band">
        <div className="rf-shell rf-grid items-center gap-y-8 py-12 md:py-16">
          <a
            href={pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="rf-doc-preview col-span-full sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-auto lg:col-span-5"
            aria-label={`Open ${fileName} full size`}
            data-rf-event={RF_EVENTS.govPdfViewed}
            data-rf-document={document}
            data-rf-location="gov"
          >
            <Image
              src={preview.src}
              alt={`Preview of ${fileName}, page one`}
              width={preview.width}
              height={preview.height}
              sizes="(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 90vw"
              priority
            />
          </a>

          <div className="col-span-full md:col-span-6 md:pl-6 lg:col-span-6 lg:col-start-7 lg:pl-0">
            <p className="rf-eyebrow">PDF preview · {pages}</p>
            <h2 className="rf-h2 mt-4">What you download is what you see.</h2>
            <p className="rf-body mt-4 max-w-[48ch]">
              This is the file itself, ready to attach to a response or forward
              to a contracting officer. The full content is laid out below if
              you would rather read it here.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={pdf}
                download={fileName}
                className="rf-cta-primary"
                data-rf-event={RF_EVENTS.govPdfDownloaded}
                data-rf-document={document}
                data-rf-location="gov"
              >
                Download PDF
              </a>
              <a
                href={pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="rf-cta-secondary"
                data-rf-event={RF_EVENTS.govPdfViewed}
                data-rf-document={document}
                data-rf-location="gov"
              >
                Open full size &#8599;
              </a>
            </div>
          </div>
        </div>
      </section>

      {children}
    </>
  );
}
