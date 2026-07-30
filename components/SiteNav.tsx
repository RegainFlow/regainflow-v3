"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { NAV, type NavGroup } from "@/lib/site";

/** True for the group whose route we are currently on. */
function isCurrent(pathname: string, group: NavGroup) {
  return pathname === group.href || pathname.startsWith(`${group.href}/`);
}

/**
 * Desktop group: a real link to the landing route, with a separate disclosure
 * button beside it. Splitting them means the label always navigates — the
 * dropdown only ever adds a shortcut, and losing JavaScript loses nothing but
 * the shortcut.
 */
function DesktopGroup({
  group,
  current,
  open,
  onOpen,
  onClose,
}: {
  group: NavGroup;
  current: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const panelId = useId();

  return (
    <div
      className="rf-menu"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onClose();
        }
      }}
    >
      <span className="flex items-center gap-1">
        <Link
          href={group.href}
          className="rf-nav-link"
          data-current={current || undefined}
        >
          {group.label}
        </Link>
        <button
          type="button"
          className="rf-menu-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${group.label} sections`}
          onClick={() => (open ? onClose() : onOpen())}
        >
          <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
            <path
              d="M1 1 L5 5 L9 1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
        </button>
      </span>

      <ul id={panelId} className="rf-menu-panel" data-open={open}>
        {group.items.map((item, i) => (
          <li
            key={item.href}
            data-secondary={item.secondary || undefined}
            // Items arrive in reading order rather than all at once.
            style={{ "--rf-stagger": `${i * 40}ms` } as CSSProperties}
          >
            <Link href={item.href} className="rf-menu-item" onClick={onClose}>
              <span className="rf-menu-item-head">
                {item.index ? (
                  <span className="rf-menu-index">{item.index}</span>
                ) : null}
                <span className="rf-menu-label">{item.label}</span>
              </span>
              <span className="rf-menu-hint">{item.hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** `cta` is rendered on the server and slotted in, so it stays in the header
 *  bar at every width without this component owning its copy or destination. */
export default function SiteNav({ cta }: { cta: ReactNode }) {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  /** Escape and the close button: the user is staying put, so focus goes back
   *  to the control they came from. */
  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    triggerRef.current?.focus();
  }, []);

  /** Navigation: the destination takes focus, so we only close the panel. */
  const dismissMobile = useCallback(() => setMobileOpen(false), []);

  // Escape closes whichever layer is open, innermost first.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (mobileOpen) closeMobile();
      else setOpenGroup(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, closeMobile]);

  // A route change means the user got where they were going, so both layers
  // close. Adjusted during render rather than in an effect — an effect would
  // paint the new route with the menu still over it first. Covers the back
  // button too, which an onClick handler would miss.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenGroup(null);
    setMobileOpen(false);
  }

  // Hold focus inside the mobile panel while it covers the page, and stop the
  // page behind it from scrolling.
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const node = panelRef.current;
    const focusables = node?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusables?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    node?.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      node?.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <div className="ml-auto flex items-center gap-3 md:gap-8">
      <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
        {NAV.map((group) => (
          <DesktopGroup
            key={group.href}
            group={group}
            current={isCurrent(pathname, group)}
            open={openGroup === group.href}
            onOpen={() => setOpenGroup(group.href)}
            onClose={() => setOpenGroup((id) => (id === group.href ? null : id))}
          />
        ))}
      </nav>

      {cta}

      <button
        ref={triggerRef}
        type="button"
        className="rf-burger md:hidden"
        aria-expanded={mobileOpen}
        aria-controls="rf-mobile-nav"
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span className="sr-only">{mobileOpen ? "Close menu" : "Menu"}</span>
        <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true">
          {mobileOpen ? (
            <path
              d="M3 1 L17 13 M17 1 L3 13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          ) : (
            <path
              d="M0 1.5h20M0 7h20M0 12.5h20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </button>

      <div
        id="rf-mobile-nav"
        ref={panelRef}
        className="rf-mobile-nav md:hidden"
        data-open={mobileOpen}
        hidden={!mobileOpen}
      >
        <nav aria-label="Primary (mobile)" className="rf-shell py-8">
          {/* Every link closes the panel explicitly. The render-phase reset
              above only fires on a pathname change, and most of these targets
              are same-page anchors — which would leave a full-screen overlay
              sitting on top of the section just jumped to. */}
          {NAV.map((group) => (
            <div key={group.href} className="border-t border-rf-hairline py-5">
              <Link
                href={group.href}
                className="rf-h3 block"
                data-current={isCurrent(pathname, group) || undefined}
                onClick={dismissMobile}
              >
                {group.label}
              </Link>
              <ul className="mt-3 flex flex-col">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rf-menu-item"
                      onClick={dismissMobile}
                    >
                      <span className="rf-menu-item-head">
                        {item.index ? (
                          <span className="rf-menu-index">{item.index}</span>
                        ) : null}
                        <span className="rf-menu-label">{item.label}</span>
                      </span>
                      <span className="rf-menu-hint">{item.hint}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
