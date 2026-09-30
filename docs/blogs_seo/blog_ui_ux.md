# Blog Design That Gets Read: An Evidence-Graded Guide to Blog UX, Engagement and Conversion (September 2026)

The best-supported blog design choices don't come from Mailchimp's 2022 list. They come from three sources. First, eyetracking and analytics research showing that most readers decide within the first screen and then scan. Second, typography and accessibility standards: large, high-contrast text, a constrained measure, and real headings. Third, a small number of well-measured publisher practices: subheads, answer-first intros, and article pages treated as the front door with clear next steps. Popup and "content upgrade" statistics are almost all vendor data and should be used only as rough priors.

## TL;DR

- **Design for the scanner first, then reward the committed reader.** NN/g eyetracking found 57% of viewing time goes to the first screenful and 74% to the first two. Chartbeat's 2-billion-visit dataset found 55% of pageviews get under 15 seconds of active attention, while two-thirds of engaged time happens below the fold. So: an answer-first intro, a visible start to the body text, descriptive subheads (NZZ's subhead test raised engaged time from 51 s to over 60 s), and a skimmable summary.
- **Typography and accessibility are the highest-return template fixes.** Use body text of at least 18px (Rello et al., CHI 2016, found readability and comprehension improved up to 18pt), a measure of about 60–75 characters, 1.5 line height, 4.5:1 contrast, 24×24px minimum targets, visible focus, and a light default with an optional dark mode. Most of this is research-backed or a WCAG 2.2 requirement. Mailchimp's font, color and "HTML tweak" SEO claims are not.
- **Convert with relevance and restraint, not interruption.** Popup benchmarks conflict by 5× (Omnisend 2.1%, Popupsmart 3.49%, Wisepops 4.82%, OptiMonk 11.09%) because the datasets, formats and definitions differ. Post-specific offers placed early (Backlinko's content upgrade went from 0.54% to 4.82%, an anecdote rather than an A/B test) and inline or end-of-post forms are safer bets. Nothing should cover the main content on arrival from search, which Google explicitly treats as intrusive.

## Evidence-strength key

- **[R] Research-backed:** peer-reviewed studies, NN/g or Baymard usability and eyetracking studies, or large first-party analytics datasets such as Chartbeat network data.
- **[S] Standard/official:** W3C WCAG 2.2, and Google Search Central or web.dev documentation.
- **[P] Practitioner consensus:** widely used, logically sound, but not rigorously tested.
- **[V] Vendor claim:** data published by a company selling the tool (popup builders, analytics vendors, case-study marketing). Directionally useful; the methods are opaque.

Chartbeat is both a large-data source and a vendor. Its network-wide aggregates (billions of pageviews) are treated here as [R]. Its customer case studies (e.g., NZZ) are treated as [V]-leaning, because customers who didn't improve rarely get case studies.

---

## Part 1 — The Mailchimp article: summary and critique

**What it says.** Mailchimp's "Do You Want The Best Blog Design? Follow These Tips" (published May 2022; page title "8 Blog Design Best Practices Everyone Should Follow") argues that a blog builds trust and therefore sales. It lists three must-haves: share buttons, an author name and photo, and search. Its design tips are to use at most 2–3 fonts and 2–3 complementary colors that match the main site, use subheads and whitespace, test one change at a time, and use images carefully.\[1\]

**What holds up.**
- An author name and photo are reasonable: they are a trust cue and part of how Google asks you to show who created content. [P/S]
- Limiting typefaces and colors is sound visual-design practice. [P]
- Subheads and whitespace are strongly supported by the scanning research below. [R]
- Testing one change at a time is standard experiment hygiene. It is often impractical on low-traffic blogs, though (see Part 9). [P]

**What is wrong, outdated or unsupported.**
1. **"Changing up the HTML even slightly can make a big difference in your Google rankings," and the implication that fonts or colors help visibility.**\[1\] There is no evidence that font or color choice is a ranking factor. Google's page-experience documentation points to Core Web Vitals, HTTPS, mobile-friendliness, avoiding intrusive interstitials, and clearly distinguishing main content.\[2\] Fonts matter to search only indirectly: heavy web fonts can slow Largest Contentful Paint (LCP) or cause layout shifts (CLS), and low contrast hurts accessibility and reading. The article treats design as an SEO lever when it is really a reading and performance lever.
2. **Alt text described as hover text.** Wrong. Alt text is the text alternative required by WCAG 1.1.1. Screen readers read it out, and it is displayed when an image fails to load. Hover tooltips come from the `title` attribute (old Internet Explorer showed alt on hover, which is probably where the confusion started). Decorative images should have an empty `alt=""`.
3. **An 8-second load-time threshold.** Obsolete. Google's current "good" LCP threshold is 2.5 seconds at the 75th percentile of page loads. Chartbeat's data suggests most visitors' attention budget is under 15 seconds in total, so an 8-second wait uses up most of it.\[3\]
4. **Fixed image dimensions such as 500×750.** Fixed pixel recommendations don't fit responsive design. The right practice is responsive images (`srcset`/`sizes`), modern formats, explicit `width`/`height` or `aspect-ratio` to prevent CLS, and `fetchpriority="high"` on the hero if it is the LCP element (web.dev).\[4\]
5. **Share buttons as a must-have.** Chartbeat found "no relationship whatsoever" between how much an article is shared and how much attention readers give it, and Slate's analysis found deeply read articles weren't necessarily the most tweeted.\[5\]\[6\] Share widgets also add third-party JavaScript that can hurt INP and LCP. A native share sheet on mobile (Web Share API) or a single "copy link" button is enough. [R/P]
6. **What's missing.** The article says nothing about reading behavior, line length, font size, contrast, mobile tap targets, performance budgets, table-of-contents design, next-read modules, newsletter placement, or measurement. The rest of this report covers those gaps.

---

## Part 2 — How people actually read blog pages

### 2.1 Eyetracking: scanning is the default [R]
- **NN/g's "How People Read Online" (2nd edition, 2020)** draws on three large eyetracking studies over 13 years, with more than 500 participants and more than 750 hours of sessions.\[7\]\[8\] Its headline: "People rarely read online — they're far more likely to scan than read word for word," and the fundamentals haven't changed across 20+ years.\[9\]
- NN/g names several recurring scanning patterns:
  - **F-pattern:** the failure mode when text lacks structure.
  - **Layer-cake:** eyes jump from heading to heading. This is the efficient pattern that good subheads enable.
  - **Spotted:** readers hunt for links, numbers or keywords.
  - **Commitment:** a motivated reader reads everything.
- Design implication: you can't force commitment, but you can make the layer-cake path pay off. Write every H2 so it works as a standalone summary.
- **How much gets read.** Nielsen's analysis of Weinreich et al.'s naturalistic browser-log study (ACM Transactions on the Web, 2008) estimated users have time to read "at most 28% of the words during an average visit; 20% is more likely."\[10\]\[11\]\[12\]

### 2.2 The fold still matters, but it's a boundary to cross, not a box to fill [R]
- **NN/g "Scrolling and Attention" (2018):** users spent about 57% of page-viewing time above the fold, about 17% on the second screenful, and 74% in the first two screenfuls (up to 2,160px). In 2010 the above-the-fold share was 80%.\[13\]\[14\] People scroll more than they used to, but attention still drops sharply at the fold. NN/g's earlier "Fold Manifesto" reported an 84% average difference in how users treat content above versus below the fold.\[15\]\[16\]
- **NN/g on long articles:** one scrolling page beats splitting an article across pages, because scrolling is cheaper than deciding whether to click "next."\[17\] (This fits with the SEO report's pagination advice.)

### 2.3 Publisher analytics: most people leave early; the ones who stay go deep [R, with caveats]
- **Chartbeat (Tony Haile, TIME, 2014; about 2 billion visits):**
  - 55% of pageviews got fewer than 15 seconds of active attention. On article pages alone, about one in three visitors fell under 15 seconds.\[3\]
  - About 66% of attention on a typical media page is below the fold.\[3\]
  - Attention does not track shares.\[5\]
- **Slate/Chartbeat (Farhad Manjoo, 2013):**
  - 38% of Slate arrivals bounced immediately.\[18\]
  - 5% of engaged visitors never scrolled.\[18\]
  - The median scroll was about halfway through an article, and slightly further across the web.\[18\]
  - Only 25% of Slate readers got past pixel 1,600.\[19\]
  - 86.2% of engaged time on Slate happened below the initial window.\[20\]
- **Chartbeat "Scrolling in the Deep":** viewership peaks at just over 80% around 550px, because many people scroll before the page finishes loading, so the very top is seen less. The area below the fold is viewed nearly three times as long as the top. Positions around 600–1,000px combine high viewership with high engagement,\[21\]\[22\] which makes that band the best spot for a key callout or an inline signup.
- **Reconciling the numbers you'll see quoted.** Figures like "35% leave before scrolling," "~50% drop at the fold" and "45% leave within 15 seconds" are variants of these Chartbeat and Slate datasets from different samples and years. The robust pattern is: about a third leave almost immediately, about half don't get far past the first screen, and a committed minority produces most of the total reading time. Don't treat any single percentage as a universal constant. Much of this data is from 2013–2016 news sites on older layouts.
- **Five reading modes:** Nir Grinberg's analysis of 7.7 million pageviews across 66,821 articles from 7 publishers (Chartbeat data, via Nieman Lab 2018) sorted reading into distinct modes (bouncing, skimming, reading, reading long, and so on).\[23\] This is why a single "average time on page" figure misleads.
- **Length and loyalty:** Pew Research Center's 2016 study "Long-Form Reading Shows Signs of Life in Our Mobile News World," using Parse.ly data on 117 million cellphone interactions, found that articles of 1,000+ words averaged about twice the engaged time of short-form stories (123 s vs 57 s), and returning visitors spent 277 s. The data covers phones only. Long content isn't the problem; unstructured long content is.

### 2.4 Publisher metrics worth copying
- **Financial Times "Quality Reads" [R/P]:** the share of pageviews where a reader probably read at least half the article, estimated from word count, average FT reading speed, and time on page. The FT pairs it with pageviews to sort content into "high performing," "niche but engaging," "need a closer look" (high views, low quality reads, which suggests a misleading headline or a piece that needs prompts to help readers through), and "candidates for cut."\[24\] FT analytics director McKinley Hyden said the metric correlated with conversion and renewal: "if we could have a higher percentage of Quality Reads, users were more likely to stay with us."\[25\] You can build a version of this for a blog in GA4 or any analytics tool.
- **NZZ (Neue Zürcher Zeitung) scroll-depth experiments [V – Chartbeat customer story, 2020]:**
  - Under NZZ's traditional structure (headline, teaser, image, body), 81% of readers reached the start of the body text. Moving the image further down raised both reaching the body and reading to the end by 4%.\[26\]
  - Testing structures from plain text to bullet points, "readers enjoyed subheadings the most." Subheads raised average engaged time about 20%, from 51 s to over 60 s.\[26\]
  - Other lessons: info-boxes placed out of context cause drop-off; repeating a pull-highlight that appears again in the body backfires; stock images with captions that paraphrase the headline add nothing; cryptic links stall scrolling; and readers scroll much deeper on desktop than on mobile.\[26\]

---

## Part 3 — The blog post page: element-by-element evidence

### 3.1 Typography
| Decision | Recommendation | Evidence |
|---|---|---|
| Body size | 18px minimum for long-form; 18–21px is common. Never below 16px on mobile. | **[R]** Rello, Pielot & Marcos (CHI 2016, n=104, Wikipedia articles, 10–26pt): readability (mean fixation duration) improved continuously up to 18pt, and comprehension was significantly better at 18 and 26pt. A companion study with dyslexic readers reached the same 18pt recommendation.\[27\]\[28\]\[29\] Caveat: the study's "points" were on its own display setup (CSS 18pt ≈ 24px), so treat it as "bigger than the old 12–14px defaults," not as an exact pixel value. |
| Line length (measure) | About 60–75 characters, e.g., `max-width: 65ch`; 80 is a firm ceiling. | **[P/R, contested]** Baymard cites Ruder's 50–60 and says up to 75 is acceptable, and advises 80 or fewer.\[30\] WCAG 1.4.8 (AAA) caps lines at 80 characters.\[31\] The screen research is mixed. Dyson & Kipping (1998): 100 cpl was read *faster* than 25 cpl with no loss of comprehension, but readers *judged* 55 cpl easiest.\[32\] Dyson & Haselgrove (2001): 55 cpl gave the best comprehension.\[33\] Shaikh: 95 cpl was fastest, 75 cpl gave the best news comprehension.\[34\] Bernard et al. (2002): no difference in reading time across 45/76/132 cpl.\[35\] Conclusion: long lines can be *read faster*, while moderate lines are *preferred* and often understood better. For a blog that wants people to keep reading, moderate wins. |
| Line height | About 1.5 for body text; tighter (1.1–1.3) for headings. | **[R/S]** Rello et al. found only marginal effects of line spacing, with both extremes (0.8 and 1.8) impairing reading.\[29\] WCAG 1.4.12 requires layouts not to break when users set line height to 1.5×, paragraph spacing to 2×, letter spacing to 0.12×, and word spacing to 0.16× the font size.\[36\] Build for those values. |
| Typefaces | 1–2 families; system fonts or a single variable font. | **[P]** The font count matters mostly for performance (Part 7). Serif vs sans makes little measurable difference on modern screens. |
| Contrast | 4.5:1 minimum for body text and 3:1 for large text (AA); aim for 7:1. | **[S]** WCAG 2.2 SC 1.4.3. Pale-grey "aesthetic" body text is the most common failure. |
| Dark mode | Light by default; respect `prefers-color-scheme` or offer a toggle. | **[R]** NN/g's literature review: positive polarity (dark text on light) gives better reading performance for normal-vision users, including older adults; dark mode can help users with cloudy ocular media such as cataracts. NN/g recommends letting users switch.\[37\] A 2026 Springer HCI study (n=28, smartphone) found light mode gave faster reading and lower workload, while dark mode was rated more comfortable, which is a trade-off rather than a winner.\[38\] |

### 3.2 Structure, hooks and the first screen
- **Answer or promise above the fold. [R/P]** Given the 57%/74% attention split and the 15-second budget, the first screen has to do two things: confirm the reader is in the right place, and give them a reason to scroll. Use an inverted-pyramid lede (the answer or key claim first), or a clear promise plus a short summary. NZZ's result (moving the image down to surface body text) and Chartbeat's 550px viewership peak both suggest that body text, or a summary box, should begin inside the first viewport on mobile.
- **Hero images. [R/V/P]** Full-screen decorative heroes push content below the fold and are often the LCP element. Use a modest hero, or none, on how-to and informational posts, and keep big art for essays and features where the image carries meaning. NN/g's "illusion of completeness" warning applies: if the first screen looks finished, people don't scroll. Let body text "peek" above the fold.\[39\]
- **Headings. [R/S]** Descriptive, front-loaded H2s and H3s support the layer-cake pattern (NN/g) and were NZZ's biggest engagement win. Use real `<h1>`–`<h3>` markup in order: screen-reader users navigate by headings (WCAG 1.3.1, 2.4.6), and the same structure helps machine summarization.
- **Paragraphs and chunking. [R]** Short paragraphs, bullets for parallel items, and bolded key phrases (sparingly) all support scanning, per NN/g.\[40\] Avoid walls of text *and* avoid confetti formatting.

### 3.3 Navigation aids inside the post
- **Table of contents. [R]**
  - NN/g's recent study of long content pages found participants "naturally engage with the table-of-contents links," and used and appreciated them.\[41\]
  - Use a TOC only on genuinely long posts. On short pages it just pushes content down.\[41\]
  - Label it clearly ("On this page" or "Contents").\[42\]
  - On desktop, a sticky TOC in a side rail works well.\[42\]
  - On mobile, NN/g warns that sticky, *collapsed* TOCs pinned to the top were often not noticed in testing. Prefer an in-content TOC at the top, and make the Back button return to the previous position on the page.\[42\]\[43\]
  - Accordions can replace a TOC on reference-style pages\[42\] but hide content from scanners, so don't collapse the main body of a blog post.
- **Sticky headers. [R/S]** Sticky site headers use up scarce mobile height and can cover focused elements.\[44\] WCAG 2.2 adds SC 2.4.11 *Focus Not Obscured (Minimum)* (AA), and NN/g-derived guidance (via Smashing Magazine) suggests:
  - keep them short;
  - hide on scroll-down and reveal on scroll-up, using a slide-in of about 300–400ms;\[44\]
  - set `scroll-padding-top` so anchor links don't land under the header.\[44\]
- **Reading-progress bars and reading-time labels. [No good evidence]**
  - No primary A/B test or peer-reviewed study was found showing that progress bars improve article completion.
  - The widely repeated "reading time boosts engagement by up to 40%" traces back to a CMS vendor blog (Simpleview, 2022) that names no study.\[45\]
  - Medium's frequently cited "optimal post is 7 minutes" (Data Lab, 2013) is about post length capturing the most total reading time, not about showing a label.\[46\]
  - Medium computes read time at about 265 words per minute, adjusted for images.\[47\]
  - Verdict: a read-time label is a cheap, honest expectation-setter (P). A progress bar is decoration. Add one only if you test it, and never let it cause layout shift.

### 3.4 Content blocks
- **TL;DR / key-takeaways boxes. [P/V]** These serve scanners, fit the layer-cake pattern, and give AI systems a clean summary. Mediahuis reported that an AI-generated article-summary feature coincided with "close to a 30% increase in premium article consumption" (INMA; member content, seen secondhand).\[48\] Keep boxes short (3–5 bullets) and don't repeat a sentence verbatim in the body: NZZ found repetition hurts.\[26\]
- **Pull quotes. [V/P]** Use them sparingly. NZZ's finding that highlighting a sentence later repeated in the body "will not do you any favors" argues against pull quotes that simply duplicate the text.\[26\] Prefer callouts that *add* something: a definition, a warning, a stat.
- **Info-boxes and callouts. [V]** Place them in context. NZZ saw drop-off when info-boxes pulled readers onto side topics.\[26\]
- **Images and data visualization. [V/P]** Use images that carry information (diagrams, annotated screenshots, charts), not stock photos (NZZ). Infogram and DC Thomson (2015, vendor, secondhand) claimed 62% longer dwell time and 317% more scrolls to the end for articles with data visuals.\[49\] The direction is plausible; the size is unverified. Always write real alt text and a text summary of the chart's key takeaway.
- **Video. [R]** Chartbeat's news-video analysis found viewers spent 3.6× more time per video than per article, and only 19% of video viewers were under 15 seconds, versus 53% of page visitors.\[50\] Video helps when it's the best format for the content. Load it with a click-to-play facade (Part 7).
- **Author box, dates and trust. [P/S]** A byline, a short bio with credentials, and visible "published / updated" dates support trust and Google's "who, how, why" guidance. Show the updated date honestly; don't refresh it without real changes.
- **Sidebars. [P]** The traditional sidebar full of widgets (tag clouds, archives, ads, social feeds) competes with content, narrows the measure, and falls to the bottom of mobile pages, where hardly anyone sees it. Default to a single centered column. Use the rail on wide screens only for a sticky TOC or one relevant CTA.
- **Share buttons. [R/P]** Minimal (see Part 1).

---

## Part 4 — Blog homepage, index and category pages

- **The article page is the real front door. [R]** Chartbeat's 2026 benchmark finds 67% of visits start on articles versus 33% on the homepage (this entry split couldn't be independently confirmed). The Measure (John Cassillo, August 2026), citing Chartbeat, reports that "In 2026, the recirculation rate for homepages in the Chartbeat network is 49%, a small increase from 48% in 2024," with sports homepages at 61%. Put design effort into post templates and next-read paths first, and the blog index second.
- **Index layout. [P]**
  - Lead with 1–3 featured or "start here" pieces, then the latest posts.
  - Use cards for visual, magazine-style content and dense lists (title, one-line deck, date, reading time) for text-heavy or technical blogs, where scanning titles matters more than thumbnails.
  - Whichever you use, make titles and decks carry the information scent; thumbnails alone don't.
- **Filtering and search. [P/R]**
  - Topic chips or categories that match your topic clusters (see the SEO report) are more useful than tag clouds.
  - Put search in the header on large archives.
  - Show result counts and zero-result suggestions.
- **"Start here" pages and hubs. [P]** A curated beginner path, or a hub per core topic, turns first-time visitors into series readers. It's the index-page version of Vox Media's story packages (see below).
- **Infinite scroll vs pagination vs load-more. [R, from e-commerce]** Baymard's large-scale usability testing (product lists) found:
  - Pagination was perceived as slow, and users browsed less.\[51\]
  - Infinite scroll can be "downright harmful," particularly for search results and on mobile,\[52\] because it hides the footer, loses the reader's place, and blocks goal-directed tasks.
  - "Load more," combined with lazy-loading batches, was the best overall.\[51\]
  - For blog archives: use a "Load more" button that is a real link to `/page/2/` so crawlers and no-JS users still get pagination (this ties back to the SEO report),\[53\] preserve the scroll position on Back, and keep the footer reachable.
  - These findings transfer from shopping lists to archive browsing only by analogy.
- **Newsletter prominence. [P]** On a newsletter-first blog, the index should carry one clear signup block above the fold or right after the featured posts, plus proof of value (sample issue, frequency, subscriber count if it's honest). Don't use a modal on arrival (Part 5).

---

## Part 5 — Engagement: what keeps people reading and coming back

### 5.1 Headlines, intros and narrative [P, partly R]
- Headlines should state a specific benefit or answer and match the content. The FT's "need a closer look" group (high views, low Quality Reads) is how misleading headlines show up in data.\[24\]
- Intros: lead with the answer or the stakes. NZZ's lesson to "think about how readers get to an article" means the intro should work for someone arriving from search, social or a newsletter, without assuming context.\[26\]
- Storytelling and "open loops" (posing a question the post resolves later) are practitioner techniques with no rigorous blog-specific evidence. They suit essays, but get in the way of how-to content, where readers want the answer now.

### 5.2 Next-read modules and recirculation [R/V]
- **Placement.**
  - Chartbeat's scroll data shows the committed readers are deep in the page, so an end-of-article "read next" is where the high-intent click happens.\[22\]
  - Chartbeat research cited by The Audiencers adds that the majority of clicks occur just above the fold, at 400–600px (secondhand).\[54\] That argues for a contextual link or "in this series" card early in the post as well.
  - Use both: one early contextual path, and a strong end-of-post module with 3–4 items. Keep the end module above comments and footers.
- **Relevance beats volume. [V]**
  - Newsweek's A/B tests of Google's Recommendations AI against its existing recommender reported click-through up 50–75%, subscription conversion up 10%, and revenue per visit up 10% (Google Cloud blog; vendor, no sample sizes).\[55\]
  - Stanford GSB and Outbrain research (Besbes, Gur, Zeevi, 2016) found that recommending by "engageability" (how likely readers are to click onward from an article) rather than raw click-through produced "a significant increase in the number of clicks" in a live pilot.\[56\]\[57\]
- **Series and packages. [R-ish, observational]** Vox Media's story-package template (Recode 100, 2018) produced 2.4 pageviews per session versus 1.2 for standard articles, and package readers were more likely to scroll halfway. Time per page was lower, partly because the stories were shorter,\[58\] and this was a comparison between content types, not a randomized test.
- **Auto-loading the next article.** Contently's 2016 redesign loaded a related article beneath each finished one, based on pre-redesign data showing a 70%+ finish rate and readers of four stories being more than 3× as likely to return.\[59\] No post-redesign results were published. Given Baymard's infinite-scroll concerns and the SEO and URL complications, prefer an explicit "Next in series" card. [V/P]
- **In-body contextual links. [V/P]** NZZ: "cryptic and confusing links prevent readers from scrolling further."\[26\] Use descriptive anchor text that says where the link goes, and open internal links in the same tab.

### 5.3 Interactive elements, comments and community [P/V]
- Calculators, checklists, quizzes and templates are the strongest engagement and link assets when they *do the reader's job*, such as estimating, deciding or configuring. They're also natural content upgrades. The evidence is mostly vendor case studies; there are no neutral benchmarks.
- Comments help only if they're moderated and the author takes part. Otherwise they add weight (third-party scripts) and spam. Many newsletter-first blogs move community to email replies, Discord or Substack-style threads.

### 5.4 What moves engaged time, pages per session and return visits
Across the evidence, three things show real effects:
1. structure that supports scanning (subheads, per NZZ);
2. relevant onward paths (Vox packages; Newsweek recommendations);
3. habit channels (email). The FT's RFV model, which scores recency, frequency and volume of a reader's visits, underpinned its growth to one million digital subscribers by 2019.\[60\]

Design features without an evidence base (progress bars, share counts, tag clouds) rank last.

---

## Part 6 — Conversion design: signup placement, popups and Google's rules

### 6.1 Why the benchmarks conflict [V throughout]
| Source | Reported average | Dataset notes |
|---|---|---|
| Omnisend (2025 data) | 2.1% of displays, down from 2.3% in 2024 | 1.24B popup displays (up 54% from 803M) and 26.4M emails collected; excludes forms with fewer than 1,000 yearly views and "extreme 50%+ conversion outliers"; its customer base leans e-commerce\[61\] |
| Popupsmart (2025) | 3.49% | 10,000+ campaigns\[62\] |
| Wisepops (2026 report) | 4.82%, up from 4.65% | About 1B displays;\[63\] Shopify stores average 8.11%\[64\] |
| OptiMonk | 11.09% | Own customer dataset; definitions differ |

The spread is structural, not a sign that anyone is lying:\[65\]
- **Denominators differ:** conversions per display versus per visitor.
- **Formats differ:** cart-abandonment and discount popups convert far above plain newsletter asks.\[62\]
- **Customer bases differ:** Shopify versus content sites.
- **Aggregation differs:** mean versus median, with or without outliers.
- **Self-selection:** vendors publish the averages of customers who stay on their platforms.

Even internal "top 10%" figures don't match. Wisepops' report cites 57.7% for its top decile, while its product page says top performers convert "up to 20%."\[63\]\[64\] For a content blog without a discount offer, a realistic planning range for a well-targeted modal is low single digits, and inline forms convert lower per view but without the costs of interrupting readers.

Directional findings that recur across vendors:
- Multi-step ("click-triggered two-step") forms edge out single-step: Omnisend 2.3% vs 2.0%; Wisepops 5.17% vs 4.62%.\[66\]
- Mobile can match or beat desktop when the design is mobile-native: Wisepops reports 4.98% on mobile vs 3.67% on desktop, and Omnisend's 2026 report found "Desktop-only popups averaged 1.4%, while mobile-only and desktop+mobile both averaged 2.2%."
- Exit-intent converts lower than other triggers. Omnisend's 2026 report ("Email popup performance in 2025: Data from 1.24 billion displays") puts onExit at about 1.8%, against about 2.1% for scroll-down and 2.3% for page-count triggers, noting that "Exit-intent popups often function as a 'last resort' message," because those visitors are already leaving.

### 6.2 Placement menu, ranked for blogs
1. **Content upgrade or post-specific offer (inline, early and at the end). [V/anecdotal]** Brian Dean's Backlinko post went from 0.54% to 4.82% after adding a checklist offer at the top and bottom: 4,700+ visitors and 370 conversions, compared with the previous month rather than in an A/B test.\[67\]\[68\] Grow and Convert, reviewing Backlinko's posts, found that posts mentioning the upgrade at the top converted 315% better than those mentioning it only at the end, which fits the scroll data (most readers never reach the end).\[69\] Cost: you need a relevant asset per post or per topic cluster.
2. **Inline signup block in the 600–1,000px band or after the first major section. [P, informed by Chartbeat viewership data]** It gets seen without interrupting.\[21\]
3. **End-of-post block. [P]** Seen by the smaller group of committed readers, who have the highest intent. Pair it with "read next."
4. **Click-triggered two-step (a button that opens the form). [V]** It isn't intrusive, because the user asked for it.
5. **Slide-in or small bottom banner after meaningful engagement (for example, scroll past 50% or 30+ seconds engaged). [V/P]** It takes up a "reasonable amount of screen space."\[70\] The often-repeated "6–10 second delay" rule comes from vendor data: Omnisend's 2026 report found a 6–10 s delay converted at 2.4% (its "sweet spot"), against 1.9% at 0–1 s and 1.8% at 31–60 s. That's a small gap from a single vendor. Given Chartbeat's 15-second attention finding, engagement-based triggers make more sense than a timer.
6. **Exit-intent (desktop). [V]** Lower conversion, low reader cost.\[71\] On mobile, "exit intent" relies on proxies such as scroll-up speed and misfires often.
7. **Entry modals. [S-risk]** Avoid on pages that receive search traffic.

### 6.3 Google's intrusive interstitials guidance [S]
Google Search Central, "Interstitials and dialogs" (updated December 2025), says intrusive interstitials "may frustrate [users] and erode their trust" and "make it hard for Google… to understand your content, which may lead to poor search performance." It recommends "banners that take up only a small fraction of the screen" instead of full-page interstitials.\[72\] Page-experience guidance lists avoiding intrusive interstitials alongside Core Web Vitals.\[2\]

- **Risky:** a popup covering main content immediately on arrival from search or while reading; a standalone interstitial that has to be dismissed; a layout whose top section looks like an interstitial.\[73\]\[74\]
- **Generally acceptable:** legally required notices (cookie consent, age checks), login walls for private content, and reasonably sized banners.\[70\]
- Exit-intent is widely described by practitioners as outside the policy's focus, because the original 2016 policy targeted the moment of arrival from search.\[71\]\[74\] Treat that as practitioner interpretation, not a Google guarantee.

---

## Part 7 — Performance-conscious design (Core Web Vitals without repeating the SEO report)

Targets, at the 75th percentile of page loads: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 [S]. Design decisions that drive each metric:

- **Hero image → LCP.**
  - Give the LCP image `fetchpriority="high"` (and preload it if it's a CSS background).\[4\]
  - Never lazy-load it.
  - Lazy-load everything below the fold.\[75\]
  - Use AVIF or WebP with `srcset`/`sizes`.
  - web.dev notes that images start at Low priority by default, so explicit priority lets the hero start loading much earlier. [S]\[4\]
- **Web fonts → LCP and CLS.**
  - Use one or two WOFF2 files: a variable font, subset.
  - Preload only the font the first-screen text needs.\[76\]
  - Use `font-display: swap` for body text or `optional` for strict CLS, and match fallback metrics (`size-adjust`) to avoid reflow when the font swaps.\[76\]\[77\]
  - System font stacks remove the problem entirely. [S/P]\[77\]
- **Embeds (YouTube, social posts, podcasts) → LCP and INP.** Use click-to-load facades (a static thumbnail plus a play button), and reserve their dimensions. [S/P]\[77\]
- **Ads and popups → CLS and INP.**
  - Reserve fixed slots for ads.
  - Never insert elements above content that's already rendered.
  - Load popup scripts after interaction or when idle.
- **Share and analytics widgets → INP.** Audit third-party JavaScript; each widget costs main-thread time. [S/P]
- **Animation.**
  - Animate only `transform` and `opacity`.
  - Avoid scroll-jacking.
  - Respect `prefers-reduced-motion` (Part 8).
- **Evidence the discipline pays off.** ProPublica's 2021 article-page redesign cut first-load network requests by 50% and page weight by 40% "without reducing interactivity or graphics."\[78\] A lean template doesn't mean a plain one.

---

## Part 8 — Mobile-first specifics

Mobile is about half of global traffic: StatCounter Global Stats' "Desktop vs Mobile Market Share Worldwide" puts it at 50.13% for August 2026, against 49.87% for desktop. Readers also scroll less deeply on mobile than on desktop (NZZ), and older Chartbeat data found average engaged time of 68 s on mobile versus 160 s on desktop.\[26\]\[50\]

- **Type and measure.** Use 18px or larger body text. On phones the viewport keeps the measure short on its own (about 35–50 characters), so don't shrink the font to fit more text.\[31\]
- **Tap targets.** WCAG 2.2 SC 2.5.8 (AA): targets at least 24×24 CSS px, or spaced so a 24px circle around each doesn't overlap a neighbor. Links inside sentences are exempt. 44–48px is the comfortable platform norm and the AAA level (2.5.5, 44×44). [S]\[79\]
- **Thumb reach. [P]** Put persistent actions (TOC toggle, subscribe, share) within easy thumb reach at the bottom rather than the top corners, and keep them few. Steven Hoober's observational research on how people hold phones is the usual reference.
- **Sticky elements budget. [P/S]** At most one sticky element at a time: header *or* bottom bar, not both plus a cookie banner plus a slide-in. Hide on scroll-down. Make sure focus isn't obscured (WCAG 2.4.11).
- **Mobile TOC. [R]** An in-content list at the top, or a clearly labeled expandable "Contents" control. NN/g found pinned, collapsed sticky TOCs often went unnoticed.\[42\]
- **Images. [S/P]** Serve images at the size they're displayed on mobile, reserve their aspect ratio, and avoid full-bleed heroes that fill the first screen.
- **Popups on mobile. [S]** These carry the highest risk under Google's interstitial guidance. Use small bottom banners or inline forms.\[80\]

---

## Part 9 — Accessibility as UX [S]

- **Alt text (the correct definition).** A concise text equivalent of an image's *purpose*, read out by screen readers (WCAG 1.1.1). Decorative images get `alt=""`. Charts need the takeaway in text. It isn't hover text and isn't a place for keywords.
- **Semantic headings and landmarks** (`<main>`, `<article>`, `<nav>`, and a single H1 followed by ordered H2s and H3s). These are the screen-reader equivalent of the layer-cake scan.
- **Focus states.** Visible focus (2.4.7) that isn't hidden by sticky UI (2.4.11, new in 2.2). Don't remove outlines without a replacement.
- **Color contrast.** 1.4.3 (4.5:1 for text) and 1.4.11 (3:1 for UI components and focus indicators). Links need to be identifiable by more than color alone (1.4.1): underline links in body text.
- **Text spacing and reflow.** 1.4.12 (see the typography table)\[36\] and 1.4.10 (no horizontal scrolling at 320px width).
- **Reduced motion.** Honor `prefers-reduced-motion`. WCAG 2.3.3 (AAA) covers motion triggered by interaction, and autoplay parallax or scroll-jacking harms users with vestibular disorders.
- **Why it's also engagement.** Every item here (bigger, higher-contrast, well-structured, stable text) is the same thing the reading research rewards for all users.

---

## Part 10 — Metrics, instrumentation and testing

- **GA4 basics.**
  - An *engaged session* is one lasting longer than 10 seconds (the threshold can be raised), or one with a key event, or one with 2+ page views.
  - *Engagement rate* is engaged sessions divided by sessions.
  - *Average engagement time* counts only foreground time.
  - For blogs, report engagement time per page view by template and topic, not site-wide averages.
- **The GA4 scroll limitation.** Enhanced Measurement fires a single `scroll` event at 90% depth, once per page.\[81\] It tells you who (nearly) finished and nothing about where others dropped off.\[82\] Fix: add a GTM Scroll Depth trigger at 25/50/75/90%, send it as a separate event name (to avoid double-counting at 90%), register the threshold as a custom dimension, and switch off the built-in scroll event if you replicate it.\[83\]\[84\]\[85\]
- **Build a Quality Read metric (FT-style).** Flag a "quality read" when engaged time is at least 50% of (word count ÷ about 230–265 wpm) *and* scroll depth reached 50%.\[86\] Track the quality-read rate against pageviews per post, and use the FT's four-quadrant triage.\[87\]
- **Qualitative tools.**
  - Microsoft Clarity (free) and Hotjar provide scroll and click heatmaps and session recordings. Clarity flags rage clicks, dead clicks and quick-backs.
  - Use them to find why readers drop at a specific block, such as an out-of-context info-box, a slow embed or a misleading link, which is the NZZ method.\[26\]
  - Recordings need consent handling in the EU. One analytics vendor claims consent rejection and ad blockers remove a large share of events (vendor claim, unverified here), so treat all client-side numbers as samples, not censuses.\[83\]
- **A/B testing on blogs.**
  - Most blogs lack the traffic for many-variant tests. Prioritize big, template-level changes (TOC on/off, summary box, signup placement) tested at the template level across many posts, or run pre/post comparisons with a holdout set of posts.
  - Run tests for full weekly cycles.
  - Judge on engaged time, quality-read rate, recirculation clicks and signups per 1,000 views, not bounce rate alone.
- **Benchmarks.** No neutral, current, blog-specific engagement benchmark exists. Chartbeat's numbers are news-publisher data, and vendor "healthy scroll depth" ranges have no disclosed method.\[83\] Benchmark against your own trailing 90 days per template.

---

## Part 11 — Exemplars and documented redesigns

**Documented outcomes (the few with numbers):**
- **Vox Media story packages (2018):** 2.4 vs 1.2 pageviews per session; more halfway scrolls (observational). [R-ish]\[58\]
- **Newsweek recommendations:** click-through +50–75%, subscription conversion +10%, revenue per visit +10% (vendor A/B claims). [V]\[55\]
- **NZZ:** subheads raised engaged time from 51 s to over 60 s; image repositioning added 4% to body-start and read-to-end rates. [V]\[26\]
- **ProPublica (2021):** 50% fewer requests and 40% lighter pages with no loss of interactivity. [primary, performance only]\[78\]
- **Backlinko content upgrade:** 0.54% → 4.82% (pre/post anecdote). [V/anecdotal]\[88\]

**Commonly cited exemplars (Stripe, Ahrefs, Smashing Magazine, Intercom, Wait But Why, Morning Brew, Ness Labs).** This research found **no public before/after metrics** for redesigns of these blogs. They are worth studying for patterns rather than for proof:
- editorial typography and a generous measure (Stripe, Smashing);
- TOC-plus-author-credential article templates (Ahrefs);
- long-form narrative with illustrations built in (Wait But Why);
- newsletter-first framing (Morning Brew, Ness Labs).

Copy the patterns that match the evidence above, not the aesthetics.

---

## Part 12 — 2025–2026 trends, evaluated

- **Summary-first, AI-legible pages. [P, with supporting R]** TL;DR boxes, question-shaped H2s, and definition-style first sentences serve both human scanners (layer-cake) and AI summarizers. The Mediahuis summary result is encouraging but secondhand. Tie-back to the SEO report: in the AI Overviews era, design for the clicks you do get. Those visitors arrive with higher intent and should find depth fast.
- **Editorial and magazine layouts. [P]** Wider type, pull-out figures, and fewer widgets. Good when the performance and accessibility rules above are kept; bad when they bring full-screen heroes and scroll-jacking.
- **Personalized recirculation. [V]** ML "read next" can beat hand-curated lists (Newsweek), but small blogs can get most of the value from well-maintained series and topic-cluster links.
- **Audio versions and TTS. [P]** Low-cost with modern text-to-speech, and useful for accessibility and commuters. No neutral data on engagement lift was found.
- **Newsletter-first blogs. [R/P]** The FT's RFV and Quality Reads work shows habit and depth predict retention better than volume.\[89\] Design the blog as the archive and discovery layer of the newsletter.
- **Reading-progress UI, share counts, sidebars full of widgets:** declining, and the evidence supports that.

---

## Part 13 — Prioritized blog design checklist

### A. Post template (do in this order)
1. **[S] Performance:** LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 on mobile field data. Hero with `fetchpriority="high"`, no lazy-loading above the fold, at most 2 subset WOFF2 fonts (or system fonts), facades for embeds, reserved space for ads.
2. **[R] Type:** body 18–20px (never <16px), line height about 1.5, `max-width: ~65ch` (60–75 characters), contrast ≥4.5:1 (aim 7:1), light default with an optional dark mode.
3. **[R] First screen:** H1, a one-sentence deck, byline and updated date, and *the answer or key promise plus the start of the body* visible on a 390×844 phone. No full-screen decorative hero on informational posts.
4. **[R/V] Structure:** descriptive H2 every 200–400 words, short paragraphs, bullets for parallel items, real heading markup.
5. **[P/V] Key-takeaways box** (3–5 bullets) near the top of posts over about 1,000 words. Don't repeat its sentences in the body.
6. **[R] TOC** for long posts only: sticky side rail on desktop; labeled list at the top on mobile (not a pinned collapsed bar); Back returns the reader to their place.
7. **[S] Accessibility:** meaningful alt text, underlined body links, visible focus not hidden by sticky UI, 24×24px minimum targets (44px preferred), survives WCAG 1.4.12 spacing overrides, honors `prefers-reduced-motion`.
8. **[V/P] Contextual next step early** (a series card or descriptive in-body link within the first 600px).
9. **[V/P] Inline signup or content upgrade** after the first major section (about 600–1,000px), matched to the post's topic.
10. **[R/V] End-of-post module:** "Next in series" plus 3 relevant reads, then the end-of-post signup, *above* comments and footer.
11. **[P] Author box** with credentials, and honest published/updated dates.
12. **[P] Remove or minimize:** widget sidebars, share-count bars, auto-playing media, progress bars (unless tested), stock images that repeat the headline.

### B. Blog index / category template
1. **[R] Article pages first:** 67% of visits start there,\[90\] so fix the post template before the homepage.
2. **[P]** 1–3 featured or "Start here" items, then latest posts. Cards for visual content, dense lists for text-first blogs. Titles and decks carry the information scent.
3. **[P]** Topic filters that match your topic clusters, header search on large archives, and hub pages per core topic.
4. **[R/S]** "Load more" button as a crawlable link to paginated URLs, scroll position kept on Back, footer reachable. No pure infinite scroll.
5. **[P]** One prominent newsletter block with proof of value; no entry modal.

### C. Conversion elements
1. **[V]** Post-specific content upgrades on your top 10 traffic posts first, offered near the top *and* at the end.
2. **[P]** Inline and end-of-post forms on every post, with one field (email) and a specific promise (topic, frequency, sample).
3. **[V]** Click-triggered two-step forms for upgrades.
4. **[V/S]** At most one timed or behavioral overlay: a small slide-in or bottom banner after engagement (for example, 50% scroll or 30+ s engaged), with frequency caps and suppression for subscribers. Exit-intent on desktop only.
5. **[S]** No full-screen or content-covering modal on arrival from search, especially on mobile. Legal and cookie notices are fine; keep them compact.
6. **[V]** Judge popups and forms on *your* signups per 1,000 views, confirmed-subscriber rate and unsubscribe rate, not vendor averages.

### D. Measurement setup
1. GTM scroll events at 25/50/75/90% (separate from GA4's built-in 90% event), registered as a custom dimension.
2. A Quality Read metric (FT-style) per post, plotted against pageviews.
3. Recirculation click-through on early and end-of-post modules, tracked separately.
4. Clarity or Hotjar heatmaps on the top 20 posts, reviewed each quarter.
5. Template-level tests or holdout comparisons, run in full weeks.

---

## Caveats

- **Age and context of the core data.** The Chartbeat and Slate scroll and attention studies are mostly from 2013–2016 and come from news sites. NN/g's fold study is from 2018. Baymard's pagination findings come from e-commerce. The patterns have held up well, but the specific percentages shouldn't be quoted as current blog constants.
- **Vendor data.** Popup benchmarks, content-upgrade results, the Infogram data-visualization lift, the Newsweek recommender results and Chartbeat customer stories come from companies with a commercial interest. Use them as directional priors and validate on your own site.
- **Typography studies** have small or specific samples (e.g., Rello's n=104 Wikipedia readers; the dyslexia study n=28; mixed line-length results). The "optimal" line length is genuinely contested between reading speed and preference or comprehension.
- **Not found despite searching:** primary evidence that reading-progress bars or read-time labels improve engagement; public before/after metrics for Stripe, Ahrefs, Smashing, Intercom, Wait But Why, Morning Brew or Ness Labs redesigns; and verified Klaviyo or Sleeknote benchmark figures, which this report therefore doesn't cite. The "6–10 second popup delay" rule rests only on Omnisend's own 2026 vendor data (2.4% at 6–10 s vs 1.9% at 0–1 s), not on neutral evidence.
- **Google policy interpretation.** The interstitial guidance is principle-based. The "exit-intent is exempt" belief is practitioner interpretation, and page-experience signals are a light ranking factor compared with relevance and content quality.

## Sources

1. [8 Blog Design Best Practices Everyone Should Follow | Mailchimp](https://mailchimp.com/resources/blog-design/)
2. [Understanding Google Page Experience | Google Search Central | Documentation | Google for Developers](https://developers.google.com/search/docs/appearance/page-experience)
3. [Chartbeat CEO Tony Haile: What You Get Wrong about the Internet](https://time.com/12933/what-you-think-you-know-about-the-web-is-wrong/)
4. [Optimize resource loading with the Fetch Priority API | Articles | web.dev](https://web.dev/articles/fetch-priority)
5. [What You Think You Know About the Web is Wrong](https://www.researchgate.net/publication/280113737_What_You_Think_You_Know_About_the_Web_is_Wrong)
6. [How people read online: Why you won’t finish this article.](https://slate.com/technology/2013/06/how-people-read-online-why-you-wont-finish-this-article.html)
7. [Writing for the Web | How People Read on the Web - Center for Parent Information and Resources](https://www.parentcenterhub.org/web-reading/)
8. [How People Read Online: The Eyetracking Evidence | NN/g Report - NN/G](https://www.nngroup.com/reports/how-people-read-web-eyetracking-evidence/)
9. [How People Read Online: New and Old Findings - NN/G](https://www.nngroup.com/articles/how-people-read-online/)
10. [PDF Analytics: What Page-by-Page Reading Data Tells You | PDFTrackr](https://pdftrackr.com/pdf-analytics-tutorial)
11. [Screen reading](https://en.wikipedia.org/wiki/Screen_reading)
12. [How Little Do Users Read? - NN/G](https://www.nngroup.com/articles/how-little-do-users-read/)
13. [Average Scroll Depth: What Studies Actually Show (2026)](https://bigdelta.com/blog/scroll-depth-benchmarks)
14. [Scrolling and Attention - NN/G](https://www.nngroup.com/articles/scrolling-and-attention/)
15. [The interaction cost: Scrolls vs Clicks](https://blogs.abseth.com/clicks-vs-scrolls)
16. [Above the fold](https://en.wikipedia.org/wiki/Above_the_fold)
17. [Scrolling and Attention (Jakob Nielsen's Original Research Study) - NN/G](https://www.nngroup.com/articles/scrolling-and-attention-original-research/)
18. [How people read online: You might finish this article.](http://www.slate.com/articles/technology/technology/2013/06/how_people_read_online_you_might_finish_this_article.html)
19. [How People Read Online \[Infographic\]](https://www.cmswire.com/cms/customer-experience/how-people-read-online-infographic-021421.php)
20. [Chances Are You Won't Finish This Article - Fast Company](https://www.fastcompany.com/1672785/chances-are-you-wont-finish-this-article)
21. [Scroll behavior across the web - Chartbeat](https://chartbeat.com/resources/research/scroll-behavior-across-the-web/)
22. [Scrolling in the Deep: What reader data shows us about on-page interactions - Chartbeat](https://chartbeat.com/resources/research/scrolling-in-the-deep/)
23. [The five ways we read online (and what publishers can do to encourage the “good” ones) | Nieman Journalism Lab](https://www.niemanlab.org/2018/04/the-five-ways-we-read-online-and-what-publishers-can-do-to-encourage-the-good-ones/)
24. [How the Financial Times brought data into the Newsroom](https://www.ftstrategies.com/en-gb/insights/how-the-financial-times-brought-data-into-the-newsroom)
25. [Testing, metrics, products: FT uses data to ace the subscription game - WAN-IFRA](https://wan-ifra.org/2023/06/testing-metrics-products-ft-uses-data-to-ace-the-subscription-game/)
26. [Challenging the status quo: Neue Zürcher Zeitung's reader engagement story](https://chartbeat.com/resources/customer/content-scroll-depth-use-case/)
27. [\[PDF\] Make It Big!: The Effect of Font Size and Line Spacing on Online Readability | Semantic Scholar](https://www.semanticscholar.org/paper/Make-It-Big!:-The-Effect-of-Font-Size-and-Line-on-Rello-Pielot/6d76a24fd2ddb58aaec63d9142f1b9171021787f)
28. [Size Matters (Spacing not): 18 Points for a Dyslexic-friendly Wikipedia](https://pielot.org/pubs/Rello2013-W4A-SizeMatters.pdf)
29. [Optimal Font Size for Web Pages (CHI 2016) – Martin's Blog](https://pielot.org/2016/01/optimal-font-size-for-web-pages/)
30. [Readability: The Optimal Line Length – Baymard](https://baymard.com/blog/line-length-readability)
31. [Optimal Line Length for Readability: The 50–75 Character Rule Explained (2026) | UXPin](https://www.uxpin.com/studio/blog/optimal-line-length-for-readability/)
32. [The Effects of Line Length and Method of Movement on Patterns of Reading from Screen | Visible Language](https://journals.uc.edu/index.php/vl/article/view/5671)
33. [The influence of reading speed and line length on the effectiveness of reading from screen - ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1071581901904586)
34. [(PDF) The Effect of Line Length and Passage Type on Reading Speed, Comprehension, and User Satisfaction](https://www.researchgate.net/publication/250841956_The_Effect_of_Line_Length_and_Passage_Type_on_Reading_Speed_Comprehension_and_User_Satisfaction)
35. [(PDF) The Effects of Line Length on Children and Adults' Online Reading Performance](https://www.researchgate.net/publication/252707646_The_Effects_of_Line_Length_on_Children_and_Adults'_Online_Reading_Performance)
36. [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
37. [Dark Mode vs. Light Mode: Which Is Better? - Slashdot](https://hardware.slashdot.org/story/20/02/16/2041240/dark-mode-vs-light-mode-which-is-better)
38. [Dark Mode vs. Light Mode: Effects on Mobile Focus, Readability, and Task Performance | Springer Nature Link](https://link.springer.com/chapter/10.1007/978-3-032-30552-7_26)
39. [Scrolling and the Illusion of Completeness | Digital Communications team blog](https://digitalcommunications.wp.st-andrews.ac.uk/2020/09/21/scrolling-and-the-illusion-of-completeness/)
40. [How do people read reports and just what is an F Pattern?](https://freshspectrum.com/how-do-people-read-reports-and-just-what-is-an-f-pattern/)
41. [In-Page Links for Content Navigation - NN/G](https://www.nngroup.com/articles/in-page-links-content-navigation/)
42. [Table of Contents: The Ultimate Design Guide - NN/G](https://www.nngroup.com/articles/table-of-contents/)
43. [Anchors OK? Re-Assessing In-Page Links - NN/G](https://www.nngroup.com/articles/in-page-links/)
44. [Designing Sticky Menus: UX Guidelines — Smashing Magazine](https://www.smashingmagazine.com/2023/05/sticky-menus-ux-guidelines/)
45. [Adding reading time on blogs boosts engagement by up to 40%](https://www.simpleviewinc.com/blog/stories/post/adding-read-time-on-blogs-boosts-engagement-by-up-to-40/)
46. [The Optimal Post is 7 Minutes. Understanding which Medium posts get… | by Mike Sall | Data Lab | Medium](https://medium.com/data-lab/the-optimal-post-is-7-minutes-74b9f41509b)
47. [214991667 Read time](https://help.medium.com/hc/en-us/articles/214991667-Read-time)
48. [INMA: Case studies highlight product optimisation, AI-powered initiatives](https://www.inma.org/blogs/product-initiative/post.cfm/case-studies-highlight-product-optimisation-ai-powered-initiatives)
49. [scrollytelling - CX Fusion](https://cxfusion.io/en/scrollytelling/)
50. [How Engaged Are Your Video Viewers? An Investigation of News Video Consumption - Chartbeat](https://chartbeat.com/resources/general/investigating-news-video/)
51. [Infinite Scrolling, Pagination Or “Load More” Buttons? Usability Findings In eCommerce — Smashing Magazine](https://www.smashingmagazine.com/2016/03/pagination-infinite-scrolling-load-more-buttons/)
52. [Infinite Scrolling, Pagination or ‘Load More’ Buttons? (and other UX links this week) | by Fabricio Teixeira | UX Collective](https://uxdesign.cc/infinite-scrolling-pagination-or-load-more-buttons-and-other-ux-links-this-week-a056611f734a?gi=3070551d6ed7)
53. [Pagination, Load More, or Infinite Scroll – Ilana Davis](https://www.ilanadavis.com/blogs/articles/pagination-load-more-or-infinite-scroll)
54. [Why recirculation should be one of your KPIs and how to increase it | Audiencers](https://theaudiencers.com/why-recirculation-should-be-one-of-your-kpis-and-how-to-increase-it-with-takeaways-from-the-independent/)
55. [Jump to Content](https://cloud.google.com/blog/products/ai-machine-learning/how-newsweek-increased-total-revenue-with-recommendations-ai)
56. [March 16, 2016](https://www.gsb.stanford.edu/insights/risk-clicky-content)
57. [IDEAS home Printed from https://ideas.repec.org/p/ecl/stabus/3148.html](https://ideas.repec.org/p/ecl/stabus/3148.html)
58. [Recirculate! Vox Media’s new structure for story packages gives readers context (and helps them stick around)](https://www.niemanlab.org/2018/03/recirculate-vox-medias-new-structure-for-story-packages-gives-readers-context-and-helps-them-stick-around/)
59. [4 data points convinced us redesign content strategist](https://contently.com/strategist/2016/03/22/4-data-points-convinced-us-redesign-content-strategist)
60. [Goals of Audience Engagement | Audience Engagement for Journalism](https://www.audienceengagementforjournalism.com/audience-engagement/goals-of-audience-engagement)
61. [Email Signup Rate Benchmarks: What's Good in 2026](https://bdow.com/stories/email-signup-benchmarks/)
62. [Popup Conversion Rate: What's a Good Rate & How to Improve It](https://www.superpopups.com/blog/improve-popup-conversion-rate)
63. [Pop-up Statistics: What Actually Converts and What Doesn't](https://bdow.com/stories/pop-up-statistics/)
64. [Popup Builder | Increase conversions and sales](https://wisepops.com/popups)
65. [What 1.24 Billion Popup Displays Tell Us About Conversion in 2025](https://www.omnisend.com/blog/email-popup-statistics/)
66. [50+ Popup Statistics: What Converts, What It’s Worth, and How to Optimize](https://www.crazyegg.com/blog/popup-statistics/)
67. [How To Boost Conversions by 785% in One Day (The Content Upgrade)](https://backlinko.com/increase-conversions)
68. [How To Use Content Upgrades To Increase Email Subscribers](https://instapage.com/blog/content-upgrades-increase-email-subscribers)
69. [The #1 Problem with Content Upgrades and What I've Learned To Do Instead](https://www.growandconvert.com/conversion-rate-optimization/content-upgrade-alternatives/)
70. [Is Page Experience a Google Ranking Factor? (2026 Guide)](https://www.clickrank.ai/page-experience-a-google-ranking-factor/)
71. [Pop Ups, Website Dialogues, Interstitials and How They Impact Google Rankings](https://www.hobo-web.co.uk/pop-ups-website-dialogs-interstitials-and-how-they-impact-google-rankings/)
72. [Interstitials and dialogs | Google Search Central | Documentation | Google for Developers](https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials)
73. [Interstitials and dialogs: How to fix intrusive pop-ups and overlays](https://searchengineland.com/guide/interstitials-and-dialogs)
74. [BruceClay - What Are Intrusive Interstitials and Why Are They Bad for SEO?](https://www.bruceclay.com/blog/page-experience-intrusive-interstitials/)
75. [A Quick Way to Fix LCP: Four Changes That Cut Time to Paint - Apogee Watcher](https://apogeewatcher.com/blog/quick-way-to-fix-lcp)
76. [Font Subsetting for Web Performance: 4 Tools to Reduce Font File Size and Improve LCP - DEV Community](https://dev.to/apogeewatcher/font-subsetting-for-web-performance-4-tools-to-reduce-font-file-size-and-improve-lcp-4n11)
77. [Images, Fonts, Third-Party Scripts: LCP and CLS - DEV Community](https://dev.to/helloashish99/images-fonts-third-party-scripts-lcp-and-cls-idc)
78. [2021 article page redesign](https://www.propublica.org/article/2021-article-page-redesign)
79. [Target Size (Minimum) — WCAG 2.2 SC 2.5.8 (AA) | wcag22aa.org](https://wcag22aa.org/new-criteria/target-size/)
80. [No Intrusive Interstitials | Thrive Internet Marketing Agency](https://thriveagency.com/no-intrusive-interstitials/)
81. [What is Scroll Event in Google Analytics 4? | Graphed Blog](https://www.graphed.com/blog/what-is-scroll-event-in-google-analytics-4)
82. [GTM Scroll Tracking Guide — Track 25%, 50%, 75% Scroll Depth in GA4 | MeasureU](https://measureu.com/resources/gtm-scroll-tracking-guide/)
83. [GA4 Scroll Depth Tracking: The 90% Problem (2026) - Clickport](https://clickport.io/blog/track-scroll-depth-ga4)
84. [How to Track Scroll Depth in GA4 (Step by Step)](https://tickle4.com/how-to-track-scroll-depth-in-ga4/)
85. [How to Set Up Scroll Depth Tracking in Google Tag Manager](https://gtmhelper.app/blog/scroll-depth-tracking-gtm)
86. [How the Financial Times measures quality reads](https://onemanandhisblog.com/2019/04/how-the-financial-times-measures-quality-reads/)
87. [How publishers are measuring engagement to drive editorial and business success - Pugpig | The mobile publishing platform for newspapers, magazines and more](https://www.pugpig.com/2023/11/03/how-publishers-are-measuring-engagement-to-drive-editorial-and-business-success/)
88. [Scrappy Cabin - step-by-step recipes to grow your business](https://www.scrappycabin.com/snacks/one-day-two-links-785-increase-in-conversions)
89. [Why Financial Publishers Struggle With Reader Engagement & How to Fix It](https://www.norkon.net/why-financial-publishers-struggle-with-reader-engagement-how-to-fix-it/)
90. [Is the homepage dead? - Chartbeat](https://chartbeat.com/resources/general/is-the-homepage-dead/)
