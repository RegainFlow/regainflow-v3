import Image from "next/image";
import Link from "next/link";

import type { BlogAuthor } from "@/lib/content/blog-authors";

/**
 * Who wrote this, and why they are worth listening to.
 *
 * Google's helpful-content guidance asks "who created the content" and expects
 * the answer to be visible, not buried in markup; the research doc ranks a
 * byline with a bio page among the core trust signals. Facts only: the
 * credentials are the ones in `TEAM`, which are the ones the person stated.
 */
export default function AuthorBox({ author }: { author: BlogAuthor }) {
  const member = author.member;
  if (!member) return null;

  return (
    <aside className="rf-author-box" aria-label="About the author">
      <div className="rf-author-box-portrait">
        <Image src={member.image} alt="" fill sizes="96px" />
      </div>

      <div>
        <p className="rf-utility">Written by</p>
        <p className="rf-h3 mt-2">
          <Link href={author.href!} className="rf-author-box-name">
            {member.name}
          </Link>
        </p>
        <p className="rf-utility mt-1">{member.role}</p>
        <p className="rf-author-box-bio">{member.bio}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {member.credentials?.map((credential) => (
            <span key={credential} className="rf-tag">
              {credential}
            </span>
          ))}
          <Link href={author.href!} className="rf-nav-link">
            More from {member.name.split(" ")[0]} &rarr;
          </Link>
          {member.profile ? (
            <a
              href={member.profile}
              className="rf-nav-link"
              target="_blank"
              rel="noopener noreferrer me"
            >
              LinkedIn &#8599;
            </a>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
