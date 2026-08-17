/**
 * Failure vocabulary for the case study pipeline.
 *
 * This script spends money and writes to a live table, so "it broke" is not a
 * useful answer. Every failure resolves to one of six kinds, and the kind picks
 * the exit code — which is the only thing a caller reading `$?` can act on.
 *
 * The distinction that earns its keep is 5 versus 6: a database write that
 * failed *after* an image was uploaded either cleaned up after itself or did
 * not, and only one of those is safe to re-run blindly.
 */

export type ErrorKind =
  | "validation"
  | "config"
  | "remote"
  | "remote-exhausted"
  | "rolled-back"
  | "orphaned";

/** Exit codes. Documented in SKILL.md, so they are part of the interface. */
export const EXIT: Record<ErrorKind, number> = {
  validation: 1,
  config: 2,
  remote: 3,
  "remote-exhausted": 4,
  "rolled-back": 5,
  orphaned: 6,
};

export class PipelineError extends Error {
  constructor(
    message: string,
    readonly kind: ErrorKind,
    /** Extra lines printed under the message. Field lists, paths to clean up. */
    readonly detail?: string,
  ) {
    super(message);
    this.name = "PipelineError";
  }
}

/** Every validation failure at once. One run, one list, rather than a game of
 *  fix-one-rerun with an image generation in the middle of it. */
export function failValidation(problems: string[], headline: string): never {
  throw new PipelineError(
    `${headline} (${problems.length} problem${problems.length === 1 ? "" : "s"})`,
    "validation",
    problems.map((p) => `  - ${p}`).join("\n"),
  );
}

/**
 * Retry only what retrying can fix.
 *
 * 429 and 5xx are the remote saying "not now"; every other 4xx is it saying
 * "not ever", and repeating a moderation refusal three times is three refusals.
 * Network-layer errors have no status and are treated as transient, because a
 * dropped socket is the same class of problem as a 503.
 */
export function isRetryable(status: number | undefined): boolean {
  if (status === undefined) return true;
  return status === 429 || status >= 500;
}

const BACKOFF_MS = [1000, 3000, 9000];

export async function withRetry<T>(
  label: string,
  attempt: (tryNumber: number) => Promise<T>,
): Promise<T> {
  let last: unknown;

  for (let i = 0; i <= BACKOFF_MS.length; i += 1) {
    try {
      return await attempt(i + 1);
    } catch (error) {
      last = error;

      const status =
        error instanceof RemoteError ? error.status : (undefined as undefined);

      if (error instanceof PipelineError) throw error;
      if (!isRetryable(status) || i === BACKOFF_MS.length) break;

      const wait = retryAfterMs(error) ?? BACKOFF_MS[i];
      console.warn(
        `  ${label} failed (${status ?? "network"}); retrying in ${wait}ms`,
      );
      await sleep(wait);
    }
  }

  if (last instanceof RemoteError && !isRetryable(last.status)) {
    throw new PipelineError(`${label}: ${last.message}`, "remote", last.detail);
  }

  throw new PipelineError(
    `${label} failed after ${BACKOFF_MS.length + 1} attempts`,
    "remote-exhausted",
    last instanceof Error ? last.message : String(last),
  );
}

/** A remote said no, and said it with a status code. */
export class RemoteError extends Error {
  constructor(
    message: string,
    readonly status: number | undefined,
    readonly detail?: string,
  ) {
    super(message);
    this.name = "RemoteError";
  }
}

/** Honour `Retry-After` when the remote bothers to send one. Seconds only —
 *  the HTTP-date form is legal and nobody sends it. */
function retryAfterMs(error: unknown): number | undefined {
  if (!(error instanceof RemoteError) || !error.detail) return undefined;
  const match = /retry-after:\s*(\d+)/i.exec(error.detail);
  return match ? Number(match[1]) * 1000 : undefined;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Flags, hand-rolled.
 *
 * `report-cover.mjs` parses its own argv and the note there applies: a parser
 * dependency for a handful of flags is a dependency to audit forever. This is
 * the general version of the same walk — long flags only, `--flag value` or
 * `--flag=value`, and `--` stops parsing.
 */
export interface Flags {
  positionals: string[];
  booleans: Set<string>;
  values: Map<string, string[]>;
}

export function parseFlags(
  argv: string[],
  spec: { boolean?: string[]; string?: string[] } = {},
): Flags {
  const booleanNames = new Set(spec.boolean ?? []);
  const stringNames = new Set(spec.string ?? []);

  const flags: Flags = {
    positionals: [],
    booleans: new Set(),
    values: new Map(),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--") {
      flags.positionals.push(...argv.slice(i + 1));
      break;
    }

    if (!arg.startsWith("--")) {
      flags.positionals.push(arg);
      continue;
    }

    const eq = arg.indexOf("=");
    const name = (eq === -1 ? arg.slice(2) : arg.slice(2, eq)).trim();
    const inlineValue = eq === -1 ? undefined : arg.slice(eq + 1);

    if (booleanNames.has(name)) {
      flags.booleans.add(name);
      continue;
    }

    if (!stringNames.has(name)) {
      throw new PipelineError(`Unknown flag: --${name}`, "validation");
    }

    const value = inlineValue ?? argv[++i];

    if (value === undefined) {
      throw new PipelineError(`--${name} needs a value`, "validation");
    }

    flags.values.set(name, [...(flags.values.get(name) ?? []), value]);
  }

  return flags;
}

export function one(flags: Flags, name: string): string | undefined {
  return flags.values.get(name)?.at(-1);
}

/** Required environment, read late and named when missing. Mirrors the shape
 *  `lib/supabase.ts` uses, for the same reason: a blank page beats a stack. */
export function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new PipelineError(
      `${name} is not set.`,
      "config",
      `Add it to .env.local. See .env.example.`,
    );
  }

  return value;
}
