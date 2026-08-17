import {
  Activity,
  Archive,
  ArrowLeftRight,
  ArrowRight,
  CalendarClock,
  ClipboardList,
  Clock,
  Database,
  FileSearch,
  FileSpreadsheet,
  Files,
  Gauge,
  GitCompareArrows,
  KeyRound,
  Repeat,
  Route,
  ScrollText,
  Search,
  ShieldCheck,
  Target,
  TriangleAlert,
  Unlink,
  Users,
  Waypoints,
  Workflow,
} from "lucide-react";

/**
 * The icon set, and **the only module in this repository that may import
 * `lucide-react`.**
 *
 * Content modules hold an `IconName` — a plain string — never a component.
 * `lib/content/*` is imported by the server renderer, `app/llms.txt/route.ts`,
 * and `lib/seo.ts`, none of which have any use for React elements; putting a
 * component in `MANIFESTO` or `PRINCIPLES` would drag the icon library into a
 * text route and a JSON-LD builder. `lib/analytics/events.ts:6-11` states the
 * same constraint for its own reasons and is worth reading. The indirection is
 * one lookup and it keeps the dependency in one file.
 *
 * `ICONS` is closed, the way `AI_GLYPHS` is closed in `brand/ai-glyphs.tsx`.
 * `IconName` is derived from its keys, so a name that does not exist fails the
 * typecheck rather than rendering an empty box — which is the failure mode you
 * would otherwise only notice in a screenshot.
 *
 * ## Why Lucide, and why these props
 *
 * Lucide draws with `fill="none" stroke="currentColor"` on a 24×24 grid, which
 * is exactly the convention the hand-drawn SVGs in `SiteNav.tsx` already use.
 * (Phosphor was the other candidate and is filled paths at every weight — its
 * stroke cannot be tuned at all, so it could not have been matched to this.)
 *
 * Two corrections make it read as house rather than as library:
 *
 * - `strokeWidth={1.4}` here, matching the header chevron. Lucide ships `2`,
 *   which is visibly heavier than any other stroke on the site.
 * - `butt` caps and `miter` joins, applied in `.rf-icon` (`app/globals.css`).
 *   Lucide ships round terminals; nothing else here is round — not a border,
 *   not a card, not the isometric models. Rounded icons among them look
 *   borrowed. Do not drop that rule.
 *
 * ## Where icons are allowed
 *
 * On **parallel lists**, where the items are siblings and order means nothing.
 * Sequences keep their numbers — see `.rf-index` — because an icon cannot say
 * that Discover comes before Implement. `docs/DESIGN.md` holds the full rule.
 */
const ICONS = {
  activity: Activity,
  archive: Archive,
  calendarClock: CalendarClock,
  clipboardList: ClipboardList,
  clock: Clock,
  compare: GitCompareArrows,
  database: Database,
  dependencies: Waypoints,
  duplicates: Files,
  fileSearch: FileSearch,
  hardHat: TriangleAlert,
  handoff: ArrowLeftRight,
  keys: KeyRound,
  nextStep: ArrowRight,
  opportunity: Target,
  path: Route,
  rebuild: Repeat,
  search: Search,
  security: ShieldCheck,
  spreadsheet: FileSpreadsheet,
  team: Users,
  trail: ScrollText,
  unmeasured: Gauge,
  unreconciled: Unlink,
  workflow: Workflow,
} as const;

export type IconName = keyof typeof ICONS;

/**
 * Always decorative. Every call site pairs the icon with the text it belongs
 * to, so announcing it would read the same item twice — `aria-hidden` is not a
 * shortcut here, it is the correct semantic. If an icon ever needs to carry
 * meaning on its own, give that call site a real label rather than changing
 * this default.
 */
export default function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Glyph = ICONS[name];

  return (
    <Glyph
      className={className ? `rf-icon ${className}` : "rf-icon"}
      strokeWidth={1.4}
      aria-hidden="true"
      focusable={false}
    />
  );
}
