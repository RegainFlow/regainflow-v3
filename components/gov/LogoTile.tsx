import Image from "next/image";

import type { Logo } from "@/lib/content/gov";

/**
 * A customer or employer mark on a transparent ground, in its own colours — see `Logo`
 * in `lib/content/gov.ts` for why it is never recoloured. The tile is fixed
 * height and the mark is contained, so a wide wordmark and a squarer lockup sit
 * on the same line without one dwarfing the other.
 */
export default function LogoTile({
  logo,
  name,
  size = "md",
}: {
  logo: Logo;
  name: string;
  size?: "sm" | "md";
}) {
  return (
    <span className={`rf-logo-tile rf-logo-tile-${size}`}>
      <Image
        src={logo.src}
        alt={`${name} logo`}
        width={logo.width}
        height={logo.height}
        unoptimized={logo.src.endsWith(".svg")}
        sizes="200px"
      />
    </span>
  );
}
