# RegainFlow — landing page

Single landing page for RegainFlow, an AI systems engineering partner.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · npm.
No motion, canvas, WebGL, or 3D dependencies — the diagram is SVG and CSS.

## Requirements

Node.js **>= 20.9.0** (Next.js 16 refuses to start below this). Node 22 LTS recommended.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run start
npm run lint
npm run typecheck
```

## Structure

| Path | Purpose |
| --- | --- |
| `app/layout.tsx` | Fonts, metadata, skip link |
| `app/page.tsx` | Composes the page sections |
| `app/globals.css` | Palette tokens, type scale, routing-plane styles, entrance keyframes |
| `components/routing-plane/model.ts` | Nodes, routes, annotations, stages, entrance timing |
| `components/routing-plane/RoutingPlane.tsx` | Renders the diagram for a given stage |
| `lib/site.ts` | Navigation, contact destination |

### The routing plane

One data model drives every instance of the diagram. Geometry is authored twice —
a wide `plane` for tablet and desktop, a portrait `stack` for phones — so labels
never shrink below a readable size. Stages are ordered
(`disconnected → discovered → implemented → scaled`) and each element declares
the stage at which it becomes active.

The hero instance renders the finished `scaled` state on the server and plays a
one-shot CSS entrance sequence (~1.5s, tablet and desktop, motion permitting).
The process instance is the only client component: an `IntersectionObserver`
advances the stage as each copy panel crosses the middle of the viewport on
desktop. Without JavaScript, on phones, or under `prefers-reduced-motion`, both
instances render the complete system map.

## Content status

The following is not cleared for publication and is deliberately absent:

- **Experience in Practice** — the founding-team enterprise RAG proof point,
  along with the `#work` navigation item.

The following was authored during design and needs RegainFlow's commercial and
legal review before launch:

- the four "what this layer enables" lines in `components/CapabilityLayers.tsx`
- the three principle detail lines in `components/PartnershipModel.tsx`

No canonical URL, favicon, or social image is declared — no production domain or
approved brand asset exists yet. Add them before launch.
