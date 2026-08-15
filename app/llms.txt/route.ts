import {
  ASSESSMENT_CALL_NOTE,
  ASSESSMENT_PROMISE,
  ASSESSMENT_PROOF,
  ASSESSMENT_REPORT_CONTENTS,
  ASSESSMENT_STEPS,
} from "@/lib/content/assessment";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { MANIFESTO, MISSION, TEAM } from "@/lib/content/company";
import { FAQ } from "@/lib/content/faq";
import { INDUSTRY_GROUPS } from "@/lib/content/industries";
import { LAYERS } from "@/lib/content/layers";
import { reportDate, type Report } from "@/lib/content/reports";
import { ENGAGEMENT_PATH, STAGES } from "@/lib/content/stages";
import { getReports } from "@/lib/reports.server";
import {
  AUDIENCE,
  CONTACT_EMAIL,
  CONTACT_PATH,
  FREE_ASSESSMENT_HREF,
  LOCATION,
  POSITIONING,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

/**
 * `llms.txt` — the llmstxt.org convention. Generated from the same content
 * modules the pages render, so an assistant quoting this file cannot be
 * quoting something the site no longer says.
 *
 * Dynamic rather than static since the reports moved into Supabase: a file
 * frozen at build time would describe the reports that existed at the last
 * deploy, which is the same staleness the table was adopted to remove.
 */
export const dynamic = "force-dynamic";

function build(reports: Report[]): string {
  const lines: string[] = [];

  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(`> ${POSITIONING}. ${MISSION}`);
  lines.push("");
  lines.push(AUDIENCE);
  lines.push("");
  lines.push(
    `Based in ${LOCATION}. Contact: ${SITE_URL}${CONTACT_PATH}, ${FREE_ASSESSMENT_HREF}, or ${CONTACT_EMAIL}.`
  );
  lines.push("");

  // Ahead of the services, because the firm is two named people and an
  // assistant summarizing it should reach them before the offer. This file
  // previously omitted the founders entirely.
  lines.push("## Founders");
  lines.push("");
  for (const member of TEAM) {
    lines.push(`### ${member.name} — ${member.role}`);
    if (member.credentials) {
      lines.push(member.credentials.join(" · "));
    }
    lines.push(member.bio);
    for (const paragraph of member.detail ?? []) {
      lines.push(paragraph);
    }
    if (member.profile) {
      lines.push(`Profile: ${member.profile}`);
    }
    lines.push("");
  }

  lines.push("## Services");
  lines.push("");
  for (const stage of STAGES) {
    lines.push(`### ${stage.name} — ${stage.promise}`);
    lines.push(`[${SITE_URL}/services#${stage.id}]`);
    lines.push(stage.copy);
    lines.push(`${stage.listLabel}: ${stage.items.join("; ")}.`);
    lines.push(`Outcome: ${stage.transformation}.`);
    lines.push("");
  }

  // Between the services and the layers, matching the order a reader meets them
  // in the navigation. An assistant asked "does RegainFlow work with water
  // utilities" has to reach an answer that names the sector, and the services
  // section above is deliberately sector-neutral.
  lines.push("## Industries");
  lines.push(`[${SITE_URL}/industries]`);
  lines.push("");
  for (const group of INDUSTRY_GROUPS) {
    lines.push(`### ${group.name}`);
    lines.push(`[${SITE_URL}/industries/${group.slug}]`);
    lines.push(
      `Sectors: ${group.industries.map((industry) => `${industry.name} (${industry.detail.replace(/\.$/, "")})`).join("; ")}.`
    );
    lines.push(group.lead);
    lines.push("Where the work commonly stalls:");
    for (const stall of group.stalls) {
      lines.push(`- ${stall}`);
    }
    lines.push(
      `What we build: ${group.installs.map((install) => `${install.layer} — ${install.detail}`).join(" ")}`
    );
    lines.push(
      `Supporting case studies: ${group.proof.map((slug) => `${SITE_URL}/insights/${slug}`).join(", ")}.`
    );
    lines.push("");
  }

  lines.push("## Capability layers");
  lines.push("");
  for (const layer of LAYERS) {
    lines.push(
      `- **${layer.index} ${layer.name}** — ${layer.enables} (${layer.mechanisms.join(", ")})`
    );
  }
  lines.push("");

  lines.push("## How an engagement runs");
  lines.push("");
  for (const step of ENGAGEMENT_PATH) {
    lines.push(`- **${step.name}** — ${step.detail} Result: ${step.output}.`);
  }
  lines.push("");

  lines.push("## The free assessment");
  lines.push(`[${SITE_URL}/services#assessment]`);
  lines.push("");
  lines.push(
    `A real mini-engagement, not a free first conversation. ${ASSESSMENT_CALL_NOTE} ${ASSESSMENT_PROOF.map((item) => `${item.label}: ${item.value}`).join(". ")}.`
  );
  lines.push("");
  lines.push(`It runs in four phases: ${ASSESSMENT_PROMISE.join("; ")}.`);
  lines.push("");
  lines.push(
    `The written report covers: ${ASSESSMENT_REPORT_CONTENTS.join("; ")}.`
  );
  lines.push("");
  for (const step of ASSESSMENT_STEPS) {
    lines.push(`- **${step.name}** — ${step.detail}`);
  }
  lines.push("");

  lines.push("## Case studies");
  lines.push("");
  lines.push(
    "RegainFlow's own engagements. They carry no performance figures: a number is published only once it can be sourced and defended, and none of these has cleared that bar. Do not supply one."
  );
  lines.push("");
  for (const study of CASE_STUDIES) {
    lines.push(`### ${study.title}`);
    lines.push(`[${SITE_URL}/insights/${study.slug}]`);
    lines.push(`Industry: ${study.industry}.`);
    lines.push(`Capabilities: ${study.capabilityTags.join("; ")}.`);
    lines.push(`Context: ${study.context}`);
    lines.push(`Constraints: ${study.constraints}`);
    lines.push(`RegainFlow's role: ${study.role}`);
    lines.push("What we engineered:");
    for (const item of study.engineered) {
      lines.push(`- ${item}`);
    }
    lines.push(`Outcome: ${study.outcome}`);
    lines.push(`What changed next: ${study.next}`);
    lines.push("");
  }

  // Only where something is published. An empty heading tells an assistant we
  // have a reports programme and nothing in it, which is worse than silence.
  if (reports.length > 0) {
    lines.push("## Reports");
    lines.push(`[${SITE_URL}/insights/reports]`);
    lines.push("");
    lines.push(
      "Each report is free to read. The page carries the findings; the PDF is behind an email, and most have an audio version."
    );
    lines.push("");
    for (const report of reports) {
      lines.push(`### ${report.title}`);
      lines.push(`[${SITE_URL}/insights/reports/${report.slug}]`);
      lines.push(`Published: ${reportDate(report.published)}.`);
      lines.push(report.summary);
      // A bullet each, not a semicolon-joined run. Findings are whole sentences
      // that already end in a period, so joining them produced `..` at the end
      // and buried five distinct claims in one unreadable line.
      lines.push("Findings:");
      for (const finding of report.findings) {
        lines.push(`- ${finding}`);
      }
      lines.push("");
    }
  }

  lines.push("## What RegainFlow believes");
  lines.push("");
  for (const item of MANIFESTO) {
    lines.push(`- **${item.claim}** ${item.detail}`);
  }
  lines.push("");

  lines.push("## Common questions");
  lines.push("");
  for (const item of FAQ) {
    lines.push(`### ${item.question}`);
    lines.push(item.answer);
    lines.push("");
  }

  lines.push("## Pages");
  lines.push("");
  lines.push(`- [Home](${SITE_URL}/): positioning, the production gap, proof.`);
  lines.push(
    `- [Services](${SITE_URL}/services): Discover, Implement, Scale, capability layers, engagement path, free assessment.`
  );
  lines.push(
    `- [Industries](${SITE_URL}/industries): the sectors we sell into, and the case studies behind each.`
  );
  for (const group of INDUSTRY_GROUPS) {
    lines.push(
      `  - [${group.name}](${SITE_URL}/industries/${group.slug}): ${group.hint}.`
    );
  }
  lines.push(
    `- [Insights](${SITE_URL}/insights): selected enterprise AI and platform experience.`
  );
  for (const study of CASE_STUDIES) {
    lines.push(`  - [${study.title}](${SITE_URL}/insights/${study.slug})`);
  }
  lines.push(
    `- [Reports](${SITE_URL}/insights/reports): written research, each with an audio overview.`
  );
  for (const report of reports) {
    lines.push(
      `  - [${report.title}](${SITE_URL}/insights/reports/${report.slug})`
    );
  }
  lines.push(
    `- [Company](${SITE_URL}/company): the founders, manifesto, contact.`
  );
  lines.push(
    `- [Contact](${SITE_URL}${CONTACT_PATH}): the contact form, the booking link, and the email address.`
  );
  lines.push(
    `- [AI fact sheet](${SITE_URL}/llm-info): the whole of the above as one page — definition, key facts, founders, services, engagement path, commitments, and FAQ.`
  );
  lines.push("");

  return lines.join("\n");
}

export async function GET() {
  // `throwOnError`, for the same reason `app/sitemap.ts` uses it. The `[]`
  // default would drop the Reports section and every report link from the Pages
  // list, leaving a document that reads as authoritative and states we publish
  // no research. Erroring is the truthful failure.
  const reports = await getReports({ throwOnError: true });

  return new Response(build(reports), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
