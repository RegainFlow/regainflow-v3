import {
  ASSESSMENT_PROOF,
  ASSESSMENT_STEPS,
} from "@/lib/content/assessment";
import { CASE_STUDIES } from "@/lib/content/case-studies";
import { MANIFESTO, MISSION, TEAM } from "@/lib/content/company";
import { FAQ } from "@/lib/content/faq";
import { LAYERS } from "@/lib/content/layers";
import { reportDate, type Report } from "@/lib/content/reports";
import { getReports } from "@/lib/reports.server";
import { ENGAGEMENT_PATH, STAGES } from "@/lib/content/stages";
import {
  AUDIENCE,
  BOOKING_HREF,
  CONTACT_EMAIL,
  CONTACT_PATH,
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
    `Based in ${LOCATION}. Contact: ${SITE_URL}${CONTACT_PATH}, ${BOOKING_HREF}, or ${CONTACT_EMAIL}.`,
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
    if (member.resume) {
      lines.push(`Resume: ${member.resume}`);
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

  lines.push("## Capability layers");
  lines.push("");
  for (const layer of LAYERS) {
    lines.push(
      `- **${layer.index} ${layer.name}** — ${layer.enables} (${layer.mechanisms.join(", ")})`,
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
    `The first conversation costs nothing and carries no obligation. ${ASSESSMENT_PROOF.map((item) => `${item.label}: ${item.value}`).join(". ")}.`,
  );
  lines.push("");
  for (const step of ASSESSMENT_STEPS) {
    lines.push(`- **${step.name}** — ${step.detail}`);
  }
  lines.push("");

  lines.push("## Selected enterprise AI and platform experience");
  lines.push("");
  lines.push(
    "Only confirmed figures are stated; a study with no figure had none to confirm.",
  );
  lines.push("");
  for (const study of CASE_STUDIES) {
    lines.push(`### ${study.title}`);
    lines.push(`[${SITE_URL}/insights/${study.slug}]`);
    lines.push(`Industry: ${study.industry}. Category: ${study.group}.`);
    lines.push(`Challenge: ${study.challenge}`);
    lines.push(`Solution: ${study.solution}`);
    lines.push(`Key capabilities: ${study.capabilities.join("; ")}.`);
    if (study.technologies) {
      lines.push(`Technologies: ${study.technologies}`);
    }
    lines.push(`Impact: ${study.impact}`);
    if (study.metric) {
      lines.push(`Confirmed result: ${study.metric}.`);
    }
    lines.push("");
  }

  // Only where something is published. An empty heading tells an assistant we
  // have a reports programme and nothing in it, which is worse than silence.
  if (reports.length > 0) {
    lines.push("## Reports");
    lines.push(`[${SITE_URL}/insights/reports]`);
    lines.push("");
    lines.push(
      "Each report is free to read. The page carries the findings; the PDF is behind an email, and most have an audio version.",
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
  lines.push(`- [Services](${SITE_URL}/services): Discover, Implement, Scale, capability layers, engagement path, free assessment.`);
  lines.push(`- [Insights](${SITE_URL}/insights): selected enterprise AI and platform experience.`);
  for (const study of CASE_STUDIES) {
    lines.push(`  - [${study.title}](${SITE_URL}/insights/${study.slug})`);
  }
  lines.push(
    `- [Reports](${SITE_URL}/insights/reports): written research, each with an audio overview.`,
  );
  for (const report of reports) {
    lines.push(
      `  - [${report.title}](${SITE_URL}/insights/reports/${report.slug})`,
    );
  }
  lines.push(`- [Company](${SITE_URL}/company): the founders, manifesto, contact.`);
  lines.push(
    `- [Contact](${SITE_URL}${CONTACT_PATH}): the contact form, the booking link, and the email address.`,
  );
  lines.push(
    `- [AI fact sheet](${SITE_URL}/llm-info): the whole of the above as one page — definition, key facts, founders, services, engagement path, commitments, and FAQ.`,
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
