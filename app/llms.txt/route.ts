import {
  ASSESSMENT_PROOF,
  ASSESSMENT_STEPS,
} from "@/lib/content/assessment";
import {
  CASE_STUDIES,
  EXPERIENCE_DISCLAIMER,
} from "@/lib/content/case-studies";
import { MANIFESTO, MISSION } from "@/lib/content/company";
import { FAQ } from "@/lib/content/faq";
import { LAYERS } from "@/lib/content/layers";
import { ENGAGEMENT_PATH, STAGES } from "@/lib/content/stages";
import {
  AUDIENCE,
  BOOKING_HREF,
  CONTACT_EMAIL,
  LOCATION,
  POSITIONING,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

/**
 * `llms.txt` — the llmstxt.org convention. Generated from the same content
 * modules the pages render, so an assistant quoting this file cannot be
 * quoting something the site no longer says.
 */
export const dynamic = "force-static";

function build(): string {
  const lines: string[] = [];

  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(`> ${POSITIONING}. ${MISSION}`);
  lines.push("");
  lines.push(AUDIENCE);
  lines.push("");
  lines.push(`Based in ${LOCATION}. Contact: ${BOOKING_HREF} or ${CONTACT_EMAIL}.`);
  lines.push("");

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
  lines.push(EXPERIENCE_DISCLAIMER);
  lines.push(
    "Company, customer, and internal program names are withheld. Only confirmed figures are stated; a study with no figure had none to confirm.",
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
  lines.push(`- [Company](${SITE_URL}/company): who we are, manifesto, contact.`);
  lines.push(
    `- [AI fact sheet](${SITE_URL}/llm-info): the whole of the above as one page — definition, key facts, founders, services, engagement path, commitments, and FAQ.`,
  );
  lines.push("");

  return lines.join("\n");
}

export function GET() {
  return new Response(build(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
