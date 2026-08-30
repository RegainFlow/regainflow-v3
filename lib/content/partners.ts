/**
 * The partner network — firms we bring into an engagement by name.
 *
 * `/company#about` states that there is no bench behind the two founders. That
 * is true, and it is the reason this module exists: when work needs capability
 * RegainFlow does not staff, the choice is to name the firm doing it or to
 * quietly subcontract it. `MANIFESTO` already settled which one — *"Nobody gets
 * used. Not our people, not yours, not a subcontractor two layers down. Paid
 * what the work is worth, credited where it was earned."* This is where that
 * credit is paid.
 *
 * ## This module must never reach `peopleJsonLd()`
 *
 * `lib/seo.ts` builds `Person` nodes from `TEAM` in `lib/content/company.ts`,
 * and those nodes assert employment at RegainFlow. A partner's founders are not
 * RegainFlow staff. Do not add them to `TEAM`, do not render them inside
 * `/llm-info#people`, and do not pass `PartnerPerson` to anything in `lib/seo.ts`.
 * The type is deliberately separate from `TeamMember` rather than shared, so
 * there is no structural way to feed one into the other by accident.
 *
 * There is also no partner JSON-LD on `/company`, and that is considered rather
 * than missing. Schema.org has no honest predicate for a delivery partner —
 * `memberOf`, `subOrganization`, and `parentOrganization` each assert a
 * corporate relationship that does not exist — and `lib/seo.ts` is explicit
 * that structured data must never assert something the page does not visibly
 * say. Naming a partner in prose is the claim we can defend.
 *
 * ## Naming
 *
 * "Partner network", never "partnership". `components/PartnershipModel.tsx`
 * already owns `id="partnership"` on the home page and means the *client
 * delivery* model, and `POSITIONING` calls RegainFlow itself "an AI engineering
 * & transformation partner". Three senses of one word is two too many; the
 * qualifier is what keeps them apart.
 */

/** Section copy. Held here rather than inline, per the content-module rule. */
export const PARTNERS_EYEBROW = "Partner network";

export const PARTNERS_HEADLINE =
  "No bench. A short list of firms we vouch for.";

export const PARTNERS_LEAD =
  "When an engagement needs capability we do not staff, we bring in a partner by name rather than quietly subcontracting it. You know who is doing the work, and they are paid and credited for it.";

export interface PartnerPerson {
  name: string;
  role: string;
  /**
   * One line. Kept short for the same reason `TeamMember.bio` is, minus the
   * JSON-LD reason — there is none here, and there must not be.
   *
   * **No figures in a bio.** A number sitting in running prose on this domain
   * reads as ours. Anything quantified goes in `claims`, which renders under a
   * visible attribution line.
   */
  bio: string;
  /** Drop a photograph at this path and the layout does not move. */
  image?: string;
}

export interface Partner {
  name: string;
  /** Their own site. Rendered as the one outbound link in the section. */
  url: string;
  location: string;
  /** One line: what the firm is. */
  summary: string;
  /** Why we work with them, in RegainFlow's voice. A paragraph per element. */
  detail: string[];
  /** Their service lines, in their words. Rendered as `.rf-tag` chips. */
  specialties: string[];
  /**
   * Figures the partner publishes about their own engagements.
   *
   * These are their claims, not ours, and on this domain an unattributed number
   * becomes a RegainFlow claim by placement — against the rule that a published
   * number has to be one we can explain how we measured. So the attribution is
   * structural: the renderer prints "Figures published by {name}" above the
   * list, rather than each string having to carry its own hedge. Write them as
   * plain outcomes and let the label do the work.
   *
   * "100% outcomes guaranteed" is deliberately absent. It is a marketing
   * promise rather than a measurement, and it is out of register with a
   * manifesto that says we measure what we claimed we would.
   */
  claims?: string[];
  /**
   * The **light/reversed** lockup. This site is dark only; a dark-on-light mark
   * disappears on Void. Optional, and that is load-bearing — the section
   * renders name-only until a usable asset exists, so shipping does not wait on
   * one.
   */
  logo?: string;
  people: PartnerPerson[];
}

export const PARTNERS: Partner[] = [
  {
    name: "Stable Solutions",
    url: "https://stablesolutions.pro",
    location: "Orlando, Florida",
    logo: "/brand/partners/stable-solutions.png",
    summary:
      "An R&D firm that researches, builds, and operates AI automation, custom software, and growth programs for mid-market and enterprise clients. Founded in 2023.",
    detail: [
      "Research before deployment is their stated first principle. We make the same argument about the boring layer: what decides whether a system survives is the work done before anybody sees a demo. We have never had to sell them on it, and that is most of why the relationship holds. They are also a few miles away, so the hard conversations happen in person.",
      "What we route to them is the work either side of AI engineering — the application layer around a system we built, and the growth programs that decide whether anyone outside the organization ever uses it. They lead those engagements under their own name.",
    ],
    specialties: [
      "AI & Automation",
      "App & Web Development",
      "Digital Growth Strategies",
    ],
    claims: [
      "60% reduction in manual processing tasks, for a national mortgage company.",
      "18+ hours reclaimed weekly, for a law firm client.",
      "300% growth in online reviews in six months, for an international law firm.",
      "4.5M+ monthly views across the content engines behind their growth practice.",
    ],
    people: [
      {
        name: "Rafael Olivera-Cintron",
        role: "Co-founder & CEO",
        bio: "An MIT computer-engineering alumnus and former ESRI product engineer. Leads the research and product side of every engagement they take.",
        image: "/brand/partners/rafael.jpg",
      },
      {
        name: "Malik Byrd",
        role: "Co-founder & COO",
        bio: "A digital-growth strategist who runs operations and growth, and turns what the research produces into demand a client can measure.",
        image: "/brand/partners/malik.jpg",
      },
    ],
  },
];
