/**
 * The IndexNow key, served at the `keyLocation` that `pnpm blog publish`
 * names in its ping (`scripts/blog/remote.mts`). IndexNow checks that this file
 * holds the key before it trusts a submission for this host.
 *
 * From `INDEXNOW_KEY` rather than a committed `public/<key>.txt`, so the key
 * is set per environment and a preview deployment never vouches for
 * production. Unset, the file does not exist.
 */
export function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return new Response("Not found", { status: 404 });

  return new Response(key, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
