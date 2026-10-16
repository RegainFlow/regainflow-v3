# Blog & Blog-Page SEO in September 2026: What Actually Works, What's Proven, and What's Myth

The strongest bet for blog SEO in 2026 is also the simplest one: publish non-commodity, first-hand content on a technically clean, well-linked site. Google now says in writing that optimizing for AI Overviews and AI Mode "is optimizing for the search experience, and thus still SEO." It also says llms.txt, content "chunking," AI-specific rewriting and special schema are unnecessary. The big change is economic, not tactical. Every rigorous study, including two randomized field experiments, shows AI Overviews cutting organic clicks on the informational queries that blogs have always depended on.\[1\] The goal is therefore no longer just "rank and get the click." It is to be the cited, remembered source and turn fewer, better visits into customers.

## TL;DR
- **Google-confirmed:** Google's AI features run on the same core ranking and quality systems as normal search, using retrieval-augmented generation and "query fan-out." Google's May 2026 guide lists llms.txt, chunking, Markdown copies of pages, special schema and fan-out page farming as unnecessary, and says the last of these can breach the scaled content abuse policy. FAQ rich results were retired on May 7, 2026. You can now measure AI visibility for free: Search Console's generative AI report (all sites since August 31, 2026) and Bing's AI Performance report both show impressions or citations, but neither shows clicks.
- **Traffic reality:** The best evidence puts the click loss on queries that trigger an AI Overview at roughly 35–40% causally. Agarwal & Sen's randomized experiment measured −39.8% outbound organic clicks. Observational studies measure 34.5% to 61% declines. Branded queries are the exception and informational/how-to queries the worst hit. Being cited recovers some clicks. AI-referred visits are small in volume (1.08% of web visits in Conductor's 2026 benchmarks report) but convert better: Adobe Digital Insights' Q1 2026 report, covering more than 1 trillion US retail visits, found them converting 42% better than non-AI traffic in March 2026.
- **What to do:** Prioritize, in this order:
  1. Technical eligibility: indexable, snippet-eligible, fast on mobile.
  2. Original experience, data and opinion in every post.
  3. Tight topic clusters with strong internal links, pruning or merging weak posts.
  4. Substantive refreshes of pages in positions 4–20, with honest update dates.
  5. Measuring citations, branded-search lift and conversions by source, not just sessions.

---

## How to read this report: evidence tiers
- **[G] Google/Bing-confirmed:** stated in Google Search Central or Bing Webmaster documentation or official blogs.
- **[I] Strong independent evidence:** randomized experiments, Pew, HTTP Archive, and large studies with disclosed methods.
- **[V] Vendor/weaker:** tool vendors or agencies studying their own data, single case studies, or figures only available second-hand. These are useful for direction, not as benchmarks.

---

## Key Findings

1. **"GEO/AEO is still SEO" is now official Google policy [G].** The May 2026 guide, "Optimizing your website for generative AI features on Google Search," says Google's AI features use RAG, which relies on "our core Search ranking systems to retrieve relevant, up-to-date web pages." They also use query fan-out, meaning several related sub-queries run at once.
2. **Non-commodity content is Google's single most emphasized lever [G].** Google contrasts "7 Tips for First-Time Homebuyers" (commodity) with "Why We Waived the Inspection & Saved Money: A Look Inside the Sewer Line" (non-commodity). It says unique, useful content "will likely influence your website's presence in generative AI search in the long run more than any of the other suggestions in this guide."
3. **Ranking and being cited have drifted apart [I/V].** Ahrefs found that 37.9% of AI Overview citations rank in the top 10 (March 2026, 863K keywords, 4M URLs).\[2\] The July 2025 figure was 76%, but part of the drop reflects Ahrefs' improved parsing.\[3\]\[4\] BrightEdge puts the overlap near 17%.\[5\] Standalone assistants overlap even less. Ahrefs' August 2025 study of 15,000 prompts found that only 12% of links cited by ChatGPT, Gemini and Copilot appear in Google's top 10 for the same prompt. Perplexity was the outlier at nearly 1 in 3.
4. **AI assistants favour fresher content, but Google's AI Overviews do not [V, large sample].** In Ahrefs' 17M-citation study, AI-cited URLs averaged 1,064 days old against 1,432 days for organic results, which is 25.7% "fresher." AI Overviews actually cited slightly *older* content than the organic results did.
5. **The click loss is real and causal [I].** Two randomized field experiments in 2026 agree on the direction. Neither found a gain in user satisfaction that would justify the loss.\[1\]
6. **Blog-index hygiene matters more when crawl and quality signals are site-wide [G].** Paginated pages each need their own URL and a self-referencing canonical.\[6\] Scaled, thin archives are a quality liability.

---

## 1. Google's Official Guidance (the ground truth)

### The May 2026 generative AI optimization guide [G]
Google published the guide in May 2026 and announced it through the Search Central Blog. It sits in a new "Generative AI fundamentals" section. The user's brief says it was updated in July 2026; this report did not independently check what changed in that revision. The guide's main points:

- **Eligibility is the same as normal Search.** A page must be indexed and eligible for snippets to appear in AI features, and crawlable, publicly accessible content is required.
- **Content attributes it asks for:**
  - a unique point of view, such as a first-hand review rather than "a summary of existing content";
  - clear organization into paragraphs, sections and headings;
  - high-quality images and video, since the AI features can show them too.
- **Explicit warning about fan-out farming.** Creating "separate content for every possible variation of how people might search (for example… fan-out queries)" mainly to manipulate rankings "violates Google's scaled content abuse spam policy."
- **The mythbusting list.** Google says site owners can ignore the following for Google Search:
  - llms.txt files, which are treated "like any other text file";
  - chunking content for AI;
  - AI-specific rewriting to capture every long-tail variation;
  - special schema or Markdown versions of pages;
  - inauthentic mentions.
  - It also says structured data is not required, and that there is "no special schema.org markup to add."\[7\]
- **Its test for any decision:** "Is this content that my visitors would find satisfying?"

**Interpretation:** Google is telling publishers that the growing GEO/AEO services industry is selling, at best, repackaged SEO. Be sceptical of any agency whose main deliverable is llms.txt files, FAQ schema or "chunk-optimized" rewrites aimed at Google. Note the scope: this guidance covers Google only. llms.txt costs little and may matter to other AI platforms, but no evidence here shows that it does.

### Helpful, people-first content and E-E-A-T [G]
Google's "Creating helpful, reliable, people-first content" page is still the core rubric. It asks:
- who created the content (a clear author and byline);
- how it was made (including disclosing automation where readers would expect it);
- why it exists (for people, not for rankings).

On word count it is direct: Google has no preferred length.

On dates it is just as direct. It asks whether you are "changing the date of pages to make them seem fresh when the content has not substantially changed," and whether you are adding or removing content to seem fresh, and answers "(No, it won't)."\[8\] John Mueller put it this way in 2022: "Changing the date without doing anything else is just noise & useless."\[9\]

E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) is a framework from Google's quality rater guidelines, not a single ranking factor. The new guide's stress on first-hand experience is how it shows up in practice.

### Spam policies: scaled content abuse [G]
Google's spam policies give these examples of scaled content abuse:
- using generative AI "to generate many pages without adding value for users";
- scraping or automatically transforming content (synonymizing, translating) "where little value is provided";
- stitching content together from several pages;
- creating multiple sites to hide the scale;
- publishing keyword-laden pages that make little sense to a reader.\[10\]

The policy is technology-neutral. The test is purpose and value, not whether a human or a model wrote the text.\[11\]\[12\] Enforcement can be algorithmic or a manual action, which appears in Search Console under Security & Manual Actions.\[13\]

### Guidance on AI-generated content [G]
Google's generative AI content guidance, also in the Generative AI fundamentals section, allows AI assistance as long as the result meets Search Essentials and the spam policies. The new guide repeats this: "If you're using generative AI tools to assist in content creation, be sure that your work meets the standards."

### Core updates, 2025–2026 [G, dates via Search Status Dashboard coverage]
| Update | Rollout |
|---|---|
| March 2025 core | Mar 13 – Mar 27, 2025 |
| June 2025 core | Jun 30 – Jul 17, 2025 |
| December 2025 core | Dec 11 – Dec 29, 2025 |
| March 2026 spam | Mar 24–25, 2026 (under 20 hours) |\[14\]
| March 2026 core | Mar 27 – Apr 8, 2026 |
| May 2026 core | May 21 – Jun 2, 2026 |\[15\]

Google described both 2026 core updates as "a regular update designed to better surface relevant, satisfying content for searchers from all types of sites" and issued no new guidance. Independent analysts, including Glenn Gabe, judged May 2026 the more powerful of the two.

**Treat these claims with caution:**
- Some vendor blogs say the March 2026 core update "explicitly named scaled content abuse" and caused 50–80% traffic drops for AI sites.\[16\] That goes beyond what Google said [V].
- A reported August 18–21, 2026 spam update aimed at scaled AI content appears only in low-authority sources.\[17\] It was not verified for this report [V].

### Search Console: generative AI performance reports [G]
- **Timeline:** Google introduced the reports on its Search Central Blog in June 2026. It noted that "as of August 31, 2026, we've rolled out this control to all websites worldwide."\[18\]
- **What the reports show:** impressions in AI Overviews, AI Mode and generative AI features in Discover, broken down by page, country and device. The usual 1,000-row limit applies. The data was always part of the "Web" totals in the standard Performance report.
- **What they don't show:** no clicks.\[19\] At launch the data was also reportedly unavailable through the Search Analytics API [V].
- **The opt-out control:** a property-level "Search generative AI" setting lets you exclude your site from these AI features. Google says it is not used as a ranking signal in regular Search and has no effect on AI training, which is governed separately by Google-Extended. The UK CMA has given Google until March 2027 to offer page-level controls.

**Interpretation:** Opting out gives up AI impressions without any ranking benefit elsewhere. For most blogs that is a bad trade unless you have evidence that AI answers are cannibalizing pages with direct revenue.

### Bing Webmaster Tools and its AI Performance report [G]
- **Launch:** public preview in February 2026.\[20\]
- **Metrics:** total citations, average cited pages, grounding queries (the phrases Bing's AI used to retrieve your content), page-level citation activity and trends. These cover Microsoft Copilot, Bing and partner surfaces.
- **Additions:** a grounding query-to-page mapping in March 2026, then preview features called Intents, Topics, Citation Share and Compare in June 2026.
- **Limits:** the data is sampled, and it has no click data.
- **Microsoft's advice:** "accurate and up to date content is important for inclusion and citation." It also recommends IndexNow for fast change notification and Bing Places for local details.

**Interpretation:** Bing's grounding queries are the only first-party view of the language AI systems use to retrieve your pages. Export them monthly and treat them as briefs for new content.

---

## 2. AI Search Visibility: How Citations Work

### How citations get selected
- **Google [G]:** RAG plus fan-out. The model retrieves pages ranking for a set of related sub-queries, not only the head query.\[21\] That explains why many cited pages don't rank in the top 10 for the original query: they rank for a fan-out query instead.\[22\] This is an inference, but it is consistent with Google's own description.
- **Other assistants [I/V]:** In Ahrefs' test of 15,000 long-tail prompts (August 2025), only 12% of links cited by ChatGPT, Gemini and Copilot appeared in Google's top 10 for the same prompt, with ChatGPT's in-text citations at 8%. Perplexity was the outlier at 28.6%. More than 80% came from pages that didn't rank for the query at all. AI Overviews follow the search results; standalone assistants follow them much less.

### The overlap numbers, reconciled
| Study | Metric | Figure | Caveat |
|---|---|---|---|
| Ahrefs, Jul 2025 | AIO citations in top 10 | 76% | Sampled only the ~3 most visible citations\[2\]\[4\] |
| BrightEdge, 2025–Feb 2026 | AIO citations in top 10 | ~17% | Different parser and dataset\[3\] |
| Ahrefs, Mar 2026 (863K keywords, 4M URLs) | AIO citations in top 10 | 37.9% (31.2% in positions 11–100; 31.0% beyond 100)\[2\]\[23\] | Part of the drop is improved parsing\[4\]\[24\] |
| Ahrefs, Aug 2025 (15K queries) | Assistant citations in Google top 10 | ~12%\[2\] | Long-tail queries |

**Bottom line:** Ranking still matters for Google's AI features, since most AI Overviews contain at least one top-10 source.\[4\] But a top-10 ranking for one phrase no longer guarantees a citation.\[25\] Coverage across a topic, which lets you win the fan-out sub-queries, is the better target. YouTube made up 5.6% of all AIO citations, and 18.2% of the cited URLs that ranked outside the top 100, so video is a real channel for getting cited [V].\[23\]

### Freshness
In Ahrefs' 16.975M-URL study (July 2025) [V, large sample]:
- AI-cited URLs averaged 1,064 days old against 1,432 for organic results, 25.7% fresher.
- ChatGPT cited URLs 393 days newer than organic results in its in-text references and 458 days newer in its end-of-answer citations.
- Google's AI Overviews cited content 16 days *older* than organic, on average.
- Assistants still "prefer citing long-lived content."

**Interpretation:** Freshness matters most for ChatGPT and Perplexity visibility. It matters little for AI Overviews, which behave like classic ranking. Frequently repeated claims such as "half of all citations are under 13 weeks old" or "pages not updated for 3 months are 3x as likely to lose citations" come from other vendors (Amsive, AirOps) and could not be checked against a primary source here [V].

### Platform differences, in brief
- **AI Overviews:** tied most closely to Google rankings. Not biased toward freshness.
- **AI Mode:** conversational. The least click-friendly in experiments (see section 3).
- **ChatGPT:** the strongest freshness bias. The dominant source of AI referral traffic: Conductor's 2026 benchmarks report found that on average 87.4% of AI referral traffic across 10 industries comes from ChatGPT. The exception was Utilities, where Gemini drove 21% [V].
- **Perplexity:** uses its own index. Overlaps Google's top 10 more than other assistants.\[2\]
- **Copilot/Bing:** the only platform with first-party citation reporting, via Bing Webmaster Tools.

### Evidence vs. myth
| Tactic | Verdict |
|---|---|
| llms.txt | **Myth for Google [G]**; unproven elsewhere |
| "Chunking" content for AI | **Unnecessary per Google [G]**; clear sections and headings still help readers |
| Special or FAQ schema for AI | **No special schema needed [G]**; FAQ rich results retired May 7, 2026\[7\]\[26\] |
| Fan-out page farms | **Spam risk [G]** |
| Original data, first-hand experience | **Supported [G + I]** |
| Topic breadth and fan-out coverage within one strong page or cluster | **Supported by overlap data [I/V]** |
| Genuine updates | **Supported for assistants [V]**; date-only changes useless [G] |
| Brand mentions across the web | Correlated with AIO mentions (Ahrefs: brands in the top quartile for web mentions earn over 10× more AIO mentions) [V];\[27\] *inauthentic* mentions are called out by Google [G] |

---

## 3. Traffic Impact: Reconciling the CTR and Zero-Click Studies

### The studies
| Study | Design and sample | Key finding | Reliability |
|---|---|---|---|
| **Agarwal & Sen (ISB/CMU), SSRN, Apr 2026, revised Jun 2026** | Randomized field experiment; 1,065 US desktop Chrome users (Prolific); 2 weeks, Jan–Feb 2026 | When shown, AIOs cut outbound organic clicks **39.8%** and raised zero-click searches **34.5%**; sponsored clicks unchanged; no gain in satisfaction; downstream engagement unchanged | **Highest (causal)**, but not peer-reviewed; desktop only |
| **Wang, Gleason, Bart, Wilson, Metaxa (UPenn/Northeastern), arXiv, Aug 18, 2026** | Preregistered field experiment, N=1,100, recruited Mar 17–19, 2026 | Removing AI features raised publisher click-through **+8.8 pp**; forcing AI Mode cut it **−18.8 pp** and lowered trust and satisfaction | **High (causal)**; extension couldn't hide every AIO, so the no-AI effect is likely understated |
| **Pew Research, Jul 2025** | 900 US adults' real browsing; 68,879 searches, March 2025\[28\] | Clicked a traditional result on **8%** of visits with an AI summary vs **15%** without; clicked links inside the summary on **1%**; session ended **26% vs 16%**\[19\]\[29\] | **High (behavioral panel)**, but correlational; March 2025 data |
| **Ahrefs, Apr 2025 → Feb 2026 update** | 300K keywords, aggregated desktop GSC data\[19\] | Position-1 CTR effect **−34.5%** (Mar 2025), then **−58%** (Dec 2025 vs Dec 2023; CTR 0.073 → 0.016 against a 0.037 forecast); position 2 lost about half its clicks, position 10 about 20%\[19\]\[30\] | **Medium-high**; large, but a modelled counterfactual |
| **Seer Interactive, Sep 2025** | 3,119 informational queries, 42 orgs, 25.1M organic impressions | Organic CTR **1.76% → 0.61% (−61%)**; paid **19.7% → 6.34%**; being cited gave **+35%** organic and **+91%** paid CTR\[28\]\[31\]\[32\] | **Medium**; client data, informational queries only |\[33\]\[34\]
| **Seer Interactive, 2026 update (Apr 24, 2026)** | 53 brands, 5.47M queries, 2.43B impressions, Jan 2025 – Feb 2026 | AIO-query organic CTR fell to **1.3%** (Dec 2025), then recovered to **2.4%** (Feb 2026) against **3.2%** in Jan 2025; Seer says "we cannot claim causation" | **Medium**; widely reported cited/uncited split (~2.1% vs ~0.9%) is second-hand |
| **Amsive, Apr 2025** | 700K keywords, 10 sites, 5 industries\[35\] | Average **−15.49%**; non-branded **−19.98%**; with a featured snippet **−37.04%**; branded queries triggered AIOs only **4.79%** of the time, and CTR on those **rose 18.68%**\[35\]\[36\] | **Medium**; small site sample; some aggregators wrongly call it "peer-reviewed"\[28\] |
| **SparkToro/Similarweb, 2026** | Similarweb US desktop and mobile-web panel, Jan–Apr 2026\[37\]\[38\] | **68.01%** of US Google searches zero-click (vs 60.45% in 2024, Datos panel); only **276** open-web clicks per 1,000 searches (vs 374)\[39\] | **Medium**; panel changed between years; excludes the Google app\[37\]\[39\] |
| **BrightEdge** | Proprietary | AIO coverage grew 58% YoY (Feb 2025 – Feb 2026) to more than half of queries | **Low-medium [V]**; second-hand |

### How to reconcile them
- **Different questions.** The experiments measure the *causal* effect of an AI Overview being shown. Ahrefs and Seer measure CTR changes on keywords that trigger AIOs over time, which mixes in other SERP changes and market trends. SparkToro measures all zero-click behaviour, whatever the cause.
- **The most defensible number is about −40%** in outbound organic clicks when an AIO appears, from Agarwal & Sen, with Pew's near-halving pointing the same way. Seer's −61% and Ahrefs' −58% are larger. They cover informational subsets and position 1, where losses concentrate, and include long-run CTR erosion that also affects non-AIO queries (Seer found 32–41% CTR declines even on queries *without* AIOs in 2025).
- **Seer's 2026 rebound is real but modest.** CTR recovered from 1.3% to 2.4% but stayed below the January 2025 baseline. Seer itself warns against predicting from it.
- **AI Mode is the bigger long-term threat.** Only 0.34% of searches moved into AI Mode during SparkToro's Jan–Apr 2026 window.\[37\] But forced AI Mode cut clicks by 18.8 pp in the Wang experiment, and Google reported at I/O 2026 that AI Mode has passed 1 billion monthly users (AI Overviews: 2.5 billion).\[22\]\[38\]
- **Zero-click measurements conflict.** Datos/SparkToro's Q4 2025 report says 56% of *desktop* searches were zero-click; SparkToro/Similarweb says 68% for desktop plus mobile web in 2026.\[39\]\[40\] Panels and definitions differ, so don't mix them in one trend line.
- **Publishers are hit hardest.** The Reuters Institute's 2026 report, using Chartbeat data from more than 2,500 news sites, found Google organic traffic down 33% globally and 38% in the US.

### Which queries are most affected
- **Most affected:** informational, question-style, how-to and comparison queries, especially long, natural-language ones.
  - Pew found that 36% of full-sentence queries (noun plus verb) triggered a summary.
  - Seer's no-AIO informational queries actually improved CTR, from 2.93% to 3.97% across 901M impressions. Finding informational topics that *don't* trigger AIOs is a practical opportunity.
- **Least affected:** branded queries (rarely trigger AIOs, and CTR rose when they did, per Amsive)\[36\] and transactional or shopping queries.

### What AI-referred traffic is worth
- **Adobe Digital Insights, Q1 2026 AI Traffic Report (Apr 16, 2026; more than 1 trillion US retail visits) [I]:** AI-referred retail visitors converted 42% better than non-AI traffic (channels such as paid search and email) in March 2026, a record high. In March 2025 they converted 38% worse. They also spent 48% more time on product pages, and revenue per visit was 37% higher.
- **Seer, one B2B client [V]:** ChatGPT referrals converted at 15.9%.\[41\]
- **Ahrefs, its own site [V]:** AI search was 0.5% of traffic but drove 12.1% of signups.\[42\]\[43\]
- **Semrush's June 2025 study of 500+ topics [V]:** the average AI search visitor is "4.4 times as valuable as the average visit from traditional organic search, based on conversion rate."
- **Volume is still small.** Conductor's 2026 AEO/GEO Benchmarks Report (13,770 domains, 3.3B sessions, May–Sep 2025) puts AI referrals at 1.08% of web visits, "growing by roughly 1% each month" [V]. SE Ranking saw ChatGPT's referral share across 101,574 sites rise from 0.23% to 0.32% between April and May 2026 [V].\[44\]

**Interpretation:** The direction (higher intent, better conversion) is consistent across sources. The multiples (4× to 23×) come from vendors with a stake in the answer and small bases.\[43\] Budget on "better per visit, small in volume," not on "23×."

---

## 4. Blog Post Best Practices

| Element | Best practice | Tier |
|---|---|---|
| **Search intent** | Match the dominant format (guide, comparison, list, tool) shown in the current results. For informational topics likely to trigger AIOs, aim to be the source cited *and* offer something the summary can't: a tool, template, data or opinion | G (people-first) + I |
| **Non-commodity content** | Every post needs at least one element only you can supply: first-hand testing, original data, screenshots of real work, a named expert's view, cost breakdowns, failures | **G (top priority in the May 2026 guide)** |
| **Structure** | Descriptive H2/H3 headings; paragraphs and sections; answer the core question early, then go deeper. A table of contents helps long posts (jump links can appear in results), but it is a usability choice, not a ranking factor | G (organization) + practitioner consensus |
| **Length** | Google has no preferred word count. Cover the topic, and its likely fan-out sub-questions, completely and stop. Padding hurts | **G** |
| **Title links** | Unique, descriptive and specific; lead with the topic; avoid boilerplate and keyword stuffing. Google may rewrite titles that are misleading or generic | G (title link docs) |
| **Meta descriptions** | Write a unique, accurate summary. Google often generates its own snippet, so treat this as a CTR aid, not a ranking factor | G |
| **URL slugs** | Short, readable, descriptive words; no dates in blog slugs if you plan to update posts; don't change URLs without redirects | G (URL structure) + consensus |
| **Images and video** | Original, relevant images with descriptive alt text and file names; embed video where it helps. Google's AI features can show images and video, and YouTube is a large AIO citation source | **G** + V |
| **Author bylines and bios** | A visible byline linked to an author page showing credentials and experience; Person markup is optional | G (who/how/why) |
| **Dates** | Show "Published" and/or "Last updated" visibly, matching `datePublished`/`dateModified`. Only change the date after substantial changes; never use future dates | **G** |
| **Structured data** | Article/BlogPosting, BreadcrumbList, Organization, and ProfilePage for author pages where relevant. It must match visible content. It is **not** required for AI features. **FAQ rich results were retired May 7, 2026** (reports dropped June 2026, API August 2026); existing FAQPage markup is harmless but gives no rich result in Google\[26\]\[45\] | **G** |
| **Internal links** | Link from each post to its pillar page and two to five related posts using descriptive anchor text; link *to* new posts from strong existing pages | G (crawlable links) + consensus |
| **External links** | Cite primary sources. It builds trust with readers and fits Google's "trustworthy" criteria; use `rel="sponsored"` or `rel="nofollow"` for paid or untrusted links | G |

---

## 5. Blog Index, Category Pages and Site Architecture

- **Blog homepage:** Treat it as a hub, not just a reverse-chronological feed. Feature pillar pages and the best evergreen posts, and link every main category. Crawlable `<a href>` links are required [G].
- **Category pages:** Index them if they are curated and useful, ideally with a unique intro and hand-picked top posts so they can rank for broad topics. If they are just a thin list of posts, improve them or merge them.
- **Tag pages:** Most blogs create far more tags than they need. Tags with one or two posts produce thin, near-duplicate archives. Consolidate them, or noindex them while keeping the links crawlable. This is practitioner consensus, not Google policy, but it follows from the scaled and thin content principles.
- **Pagination [G, Google's pagination documentation]:**
  - give every paginated page a unique URL and a *self-referencing* canonical;\[6\]\[46\]
  - don't canonicalize pages 2+ to page 1;\[6\]
  - link pages sequentially with `<a href>`, and consider linking back to page 1;\[6\]\[47\]
  - `rel=next/prev` is no longer used for indexing;\[48\]
  - for "load more" or infinite scroll, back the pattern with paginated URLs that Googlebot can reach without scrolling or clicking.
- **Sitemaps [G]:** Include every canonical post URL with accurate `lastmod` dates. A sitemap aids discovery but doesn't replace internal links. On Bing, pair it with IndexNow.
- **Topic clusters and pillar pages:** Build one comprehensive pillar per core topic, with cluster posts that each target a distinct sub-intent and link both ways. This mirrors how query fan-out retrieves sub-topics, and it is the constructive alternative to the fan-out page farms Google warns against. The inference is strong and consistent with the overlap data, but no experiment proves it.
- **Click depth and orphan pages:** Keep important posts within about three clicks of the homepage. Find orphans by comparing a crawl with the sitemap and Search Console, then link them in or retire them.
- **Keyword cannibalization:** If several posts target the same intent, merge them into the strongest URL with 301 redirects. The Signature Headstones case below involved cleaning up 50+ posts competing for the same keywords.
- **Subdomain vs. subfolder:** Google has long said both can work. Most practitioners prefer `/blog/` so links and signals consolidate with the main site. The HubSpot example below shows a separate, sprawling blog subdomain can build up off-topic risk.

---

## 6. Technical SEO for Blogs

### Core Web Vitals [G thresholds; I pass rates]
- **Thresholds**, measured at the 75th percentile of real users: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1.\[49\]\[50\]
- **2025 Web Almanac pass rates** (CrUX, July 2025):
  - all three metrics: 48% of mobile origins, 56% of desktop;\[51\]\[52\]
  - mobile by metric: LCP 62% (the hardest), INP 77% (desktop 97%), CLS 81%;\[53\]\[54\]
  - home pages pass less often than secondary pages (45% vs 56% on mobile), so audit blog templates separately;\[55\]
  - good TTFB on only 44% of mobile pages.\[49\]
- **Common blog failures:**
  - oversized hero images and lazy-loading applied to the LCP image, which hurt LCP;
  - ad and embed slots without reserved space, and late-loading fonts, which hurt CLS;
  - heavy page-builder themes, and stacks of plugins and third-party scripts (ads, chat, analytics), which hurt INP.
- **Perspective:** Core Web Vitals are part of page experience signals. A 2026 study cited by Search Engine Land found only a weak correlation with AI Overview citations.\[56\] Fix clear failures, but don't expect speed to outrank content quality.

### Other technical essentials [G]
- **Mobile-first indexing:** Google indexes the mobile version. Content, links, structured data and images must be the same on mobile.
- **JavaScript:** Render the main content and links in HTML, using server-side rendering or static generation. Google's AI guide notes that SEO with JavaScript frameworks "is generally more complex."
- **Crawl budget:** Mostly a concern for very large or fast-changing sites. Most blogs should cut URL bloat (tags, parameters, date archives, attachment pages) rather than worry about budget.
- **Canonicalization:** Self-referencing canonicals on posts. Handle syndication and duplicates deliberately.
- **Snippet controls:** `nosnippet` and `max-snippet` limit how your content appears *and* your eligibility for AI features, because Google requires snippet eligibility.
- **WordPress specifics:**
  - redirect or noindex attachment pages;
  - prune tag archives;
  - make sure the SEO plugin outputs correct canonicals and `dateModified`;
  - choose a lightweight theme;
  - audit plugin JavaScript.
  - One benchmark reports WordPress INP pass rates around 85.89% [V].\[52\]\[57\]

---

## 7. Content Maintenance: Refresh, Rewrite, Prune, Consolidate

### Decision framework
| Situation | Action |
|---|---|
| Page ranks in positions 4–20 with real impressions | **Refresh**: update facts, add first-hand detail and missing sub-topics, improve the title, strengthen internal links. Highest ROI because demand is proven |
| Page is outdated, off-intent or thin, but the topic matters | **Rewrite and republish** at the *same URL* with a new "Last updated" date. Google says fresh dates make sense after substantial changes |
| Several posts on the same intent | **Consolidate** into the best URL and 301 the rest |
| No traffic, no links, off-topic, no business value | **Prune**: remove with a 410 or redirect to the closest relevant page, or noindex |
| Evergreen page, still accurate and performing | Leave it alone; re-check annually |

### Cadence
- Review top commercial and "money" posts quarterly.
- Audit the whole library once a year.
- Update fast-moving topics (tools, pricing, AI, regulations) whenever facts change.
- Assistants' freshness bias [V] adds a reason to keep pages about fast-moving topics current. It does not justify date-bumping, which Google calls useless.

### Checking the famous refresh statistics
- **"106% more traffic" (HubSpot) [V, dated]:**
  - Source: a post by Pamela Vaughan from about June 2015.
  - HubSpot increased "monthly organic search views of old posts we've optimized by an average of 106%" and "more than doubled" leads from them.\[58\]
  - The analysis also found 76% of monthly blog views and 92% of leads came from old posts.\[59\]
  - Limits: one company's own blog, hand-picked posts, before/after averages, no control group, an undisclosed sample size, and data about 11 years old. Some re-quotes wrongly call it a 106% gain in *conversion rates*.\[60\]
  - **Verdict:** directionally credible, not a benchmark.
- **Backlinko "Content Relaunch" [V]:** a 260.7% lift on a *single* page in 14 days. An anecdote.\[61\]
- **Ahrefs' own republish [V]:** a 2018 link reclamation post that never beat an estimated 350 monthly visits was rewritten in August 2024. Traffic "tripled" (+302%) by October 2025.\[62\]
- **Single Grain, 42 refreshed posts, +96% [V]:** only found second-hand. Unverified.\[63\]

---

## 8. AI-Assisted Content Workflows

**Google's position [G]:** AI assistance is acceptable. Mass-producing pages "without adding value" is scaled content abuse, whoever or whatever wrote them.\[10\]\[11\]

**What works (practitioner consensus, consistent with Google):**
- AI for research synthesis, outlines, first drafts of *structure*, transcription (turning expert interviews into drafts), summarizing, and QA (fact-check prompts, readability, internal link suggestions).
- Human-owned inputs: the angle, original data, examples, opinions and final accountability. The byline should belong to a real person who reviewed the post.
- Named editorial checkpoints: brief approval, fact verification against primary sources, adding experience or expertise, review by a qualified expert for health, finance and legal topics, and final human edit.
- Publishing velocity capped by editorial capacity, not by generation capacity.

**Risks:**
- commodity output that Google's guide says AI can "easily" reproduce, and which will therefore rarely be cited;
- factual errors and hallucinated sources;
- near-duplicate pages across a cluster;
- fan-out page farms, which Google now names in the scaled content abuse context.

**Data point [V]:** Ahrefs found 86.5% of top-20 pages are at least partly AI-generated, with no correlation between AI share and AIO citation order.\[27\] AI use itself isn't penalized; value is what gets judged.

---

## 9. Measurement: KPIs Beyond Sessions

| KPI | Tool | Notes |
|---|---|---|
| AI impressions by page | **Search Console, generative AI report** (all sites since Aug 31, 2026) | Impressions only, no clicks; UI export |
| AI citations, grounding queries, citation share | **Bing Webmaster Tools, AI Performance** | Sampled; no clicks; the grounding queries are gold for content briefs |
| Citation share across ChatGPT, Perplexity, Gemini, AIO | Third-party trackers (e.g., Ahrefs Brand Radar, Semrush, OtterlyAI) | Prompt-sample based; responses vary run to run, so trend them rather than trusting single readings [V] |
| AI referral sessions and conversions | GA4 with a custom AI channel group (regex on chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com and similar) | A native GA4 "AI Assistant" channel was reportedly added May 13, 2026, but it may miss Perplexity [V, unverified]\[64\] |
| Branded search lift | Search Console branded-query filter, Google Trends | The best proxy for "cited but not clicked" influence |
| Conversions and pipeline by source | CRM + GA4; add "How did you hear about us?" with an AI option | Captures AI influence that happens without a click |
| Classic metrics | GSC clicks, CTR, average position (split by AIO-likely query sets) | Watch for impressions rising while clicks fall, the AIO signature |

**Interpretation:** Report three layers separately: visibility (AI impressions and citations), traffic (clicks and AI referrals), and outcomes (conversions and branded demand). A year-on-year fall in blog sessions alongside flat or rising leads and branded search is now a normal and acceptable result.

---

## 10. Case Studies Across Blog Types (2025–2026)

- **B2B SaaS: HubSpot's blog collapse (a warning).**
  - All estimates are third-party; HubSpot hasn't published figures [V].
  - Surfer's Ahrefs-based estimate: about 10M monthly organic visits in early 2024, below 1.9M by late January 2025 (about −81%).\[65\]
  - Aleyda Solis's Similarweb analysis of all of hubspot.com: −23.2% monthly visits across 2024.\[66\]
  - Analysts link the losses mainly to off-topic posts spread across roughly 19,200 indexed blog pages.\[65\]\[67\]
  - **Lesson:** off-topic scale is a liability. Topical focus and pruning matter.
- **SEO SaaS: Ahrefs.** Rewriting and republishing one underperforming 2018 post at the same URL tripled traffic (+302%) [V].
- **Small SaaS: MailTracker (published on Surfer's blog).**
  - "How to Write Cold Emails" got fewer than 20 visits a month for about two years.
  - It was rebuilt around the actual intent as "10 Cold Email Examples That Get Replies."
  - Four months later it was getting about 500 visits a month and ranking #3 for its main keyword.\[68\]
  - Vendor-published and credited to the vendor's tool [V].
  - **Lesson:** fixing an intent mismatch beats polishing.
- **Publishers: People Inc. (formerly Dotdash Meredith).**
  - Management said on earnings calls (via AdExchanger and Digiday coverage) that Google's share of traffic fell from about 60–70% to about 24–30%.
  - The CEO said the company lost 50% of its Google search traffic over two years.
  - Digital revenue still grew 14% to $355M in Q4 2025 while core sessions fell 13%.\[69\]\[70\]
  - **Lesson:** diversify away from Google (direct, apps, licensing, other platforms) and monetize each visit better.
  - Chegg, by contrast, reported non-subscriber traffic down 49% in January 2025 and sued Google over AI Overviews. Google called the suit "meritless."
- **E-commerce blog: Signature Headstones (Shopify), per its agency.**
  - Work: cleaning up 50+ blog posts that competed for the same keywords, adding 10+ collection pages, publishing 30+ intent-matched posts and earning about 100 backlinks.
  - Result: "300%+" organic growth by month six, after three to four months of flat traffic.\[71\]
  - Agency self-reported, percentages only [V].
  - **Lesson:** consolidation plus linking the blog to commercial pages.
- **Small business and local:** No verifiable, named 2025–26 case study was found. Agency examples were anonymized. For local businesses, the guidance still points to accurate Google Business Profile and Bing Places data, plus locally specific, first-hand content (projects, prices, local regulations). Google's guide and Microsoft's documentation both name local business details as inputs to AI answers [G].

---

## Recommendations: Prioritized Checklist

### Blog posts (in priority order)
1. **[G] Eligibility:** indexable, not blocked, snippet-eligible (no restrictive `nosnippet`), main content in HTML, self-canonical.
2. **[G] Non-commodity element:** original data, a first-hand test, expert insight, real examples, or a clear, defensible opinion. If a model could write it from existing web content, rework it.
3. **[G] Intent match:** format and depth fit what searchers want; the core answer comes early; sub-questions are covered on the same page, not spun into separate thin posts.
4. **[G] Clear structure:** descriptive H2/H3s, short sections, tables where useful, and a table of contents for long posts.
5. **[G] Trust signals:** a real author byline with a bio page, sources cited, a visible "Last updated" date matching the schema, and dates changed only after substantial edits.
6. **[G] Title and meta:** a unique, specific title and an accurate description.
7. **[G] Media:** original images with alt text; video where it helps (it can be cited in AIOs, and YouTube is a major source).
8. **[G] Schema:** Article/BlogPosting, BreadcrumbList, and Person/ProfilePage for authors, all matching visible content. Skip FAQ schema as a rich-result tactic.
9. **[I/consensus] Internal links:** link to the pillar page and two to five related posts, and add links *to* the new post from established pages.
10. **[I] Performance:** optimize the LCP image and don't lazy-load it, reserve space for ads, and trim third-party scripts.

### Blog pages and architecture
1. **[G] Pagination:** unique URLs, self-canonicals, `<a href>` links; infinite scroll backed by paginated URLs.
2. **[G] Sitemap** with accurate `lastmod`; IndexNow for Bing.
3. **[Consensus] Clusters:** one pillar per core topic, cluster posts for distinct sub-intents, two-way links.
4. **[Consensus] Taxonomy hygiene:** curated category pages that stay indexed; thin tag pages consolidated or noindexed; attachment and date archives cleaned up.
5. **[Consensus] Cannibalization and orphan audit** every quarter; merge and 301.
6. **[I] Core Web Vitals:** audit the post and archive templates separately; mobile first.
7. **[Case evidence] Topical focus:** prune or merge off-topic, low-value posts that don't serve your audience (the HubSpot lesson).

### Maintenance and measurement
1. Every quarter, refresh posts in **positions 4–20** that have meaningful impressions.
2. Consolidate overlapping posts; prune dead weight.
3. Turn on **Search Console's generative AI report** and **Bing's AI Performance report**; export Bing grounding queries monthly as content briefs.
4. Set up a GA4 AI-referral channel and CRM source tracking; report visibility, traffic and outcomes separately.
5. Track branded search as the proxy for AI-driven influence.
6. Don't opt out of Google's AI features unless you have evidence of revenue cannibalization. The toggle gives no ranking benefit elsewhere.

---

## Caveats
- **Fast-moving evidence.** Both randomized experiments are preprints: SSRN (not peer-reviewed) and arXiv. Both are US desktop Chrome samples, and Google's markup changes weakened the Wang team's extension.
- **Vendor incentives.** Ahrefs, Seer, Semrush, BrightEdge, Amsive and AI-visibility tool companies all sell products tied to their findings. Their large datasets are valuable, but methods differ. The Ahrefs 76% → 38% overlap change is partly a measurement artifact.\[3\]
- **Not verified here:** the specific changes in the July 2026 revision of Google's guide; claims that the March 2026 core update targeted scaled content abuse; the reported August 2026 spam update; the native GA4 AI channel; the "13-week" freshness statistics.
- **Correlation vs. causation.** Freshness, brand-mention and conversion-multiple findings are correlational. Cited pages may convert and rank better because they are stronger brands, not because citation causes it (Seer notes exactly this).
- **Gaps.** No verifiable local or small-business case study was found. Guidance on content length, table-of-contents effects, and subdomain vs subfolder rests on Google statements and practitioner consensus, not controlled studies.

## Sources

1. [The Impact of Google AI Overviews on Publisher Traffic and User Experience: Evidence from a Field Experiment by Saharsh Agarwal, Ananya Sen :: SSRN](https://ssrn.com/abstract=6513059)
2. [Do Google Rankings Drive AI Citations? 2026 Data](https://www.elmohq.com/blog/rankings-and-ai-citations)
3. [Google AI Overviews statistics for 2026: coverage, click loss and citations](https://www.cognizo.ai/blog/google-ai-overviews-statistics)
4. [Do AI Overview citations come from the top 10? Every study, reconciled — HZ](https://hzsignal.com/blog/ai-overview-citations-top-10/)
5. [Ahrefs Study: Only 38% of Google AI Overview Citations Come From Top 10 Pages](https://news.designrush.com/ai-overview-citations-drop-ahrefs)
6. [Pagination Best Practices for Google | Google Search Central | Documentation | Google for Developers](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)
7. [Google FAQ Rich Results Removal: Impact & SEO Strategy](https://www.elementera.com/blog/google-has-removed-faq-rich-results)
8. [Creating Helpful, Reliable, People-First Content | Google Search Central | Documentation | Google for Developers](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
9. [Google Says Only Update Dates On Articles When Significantly Change Existing Content](https://www.seroundtable.com/google-update-content-date-32878.html)
10. [Spam Policies for Google Web Search | Google Search Central | Documentation | Google for Developers](https://developers.google.com/search/docs/essentials/spam-policies)
11. [Scaled Content Abuse: Google's 2026 Policy & Compliance Guide](https://bulkbase.ai/seo/scaled-content-abuse-googles-policy-enforcement-how-to-stay-compliant-in-2026)
12. [Scaled Content Abuse in 2026: The Google Policy Every AI Content Operation Needs to Audit — Rank Builder SEO](https://rankbuilderseo.com/articles/scaled-content-abuse-2026)
13. [Google's Scaled Content Abuse Policy in 2026 — Post For Success](https://postforsuccess.com/scaled-content-abuse)
14. [Google Confirms March 2026 Core Update Is Complete](https://www.searchenginejournal.com/google-confirms-march-2026-core-update-is-complete/571459/)
15. [Core Roars Back With Google's May 2026 Broad Core Update - Interesting Cases, Findings, and Analysis](https://www.gsqi.com/marketing-blog/core-roars-back-google-may-2026-core-update-analysis/)
16. [Scaled Content Abuse: Google's AI Page Crackdown Guide](https://www.digitalapplied.com/blog/scaled-content-abuse-google-march-update-ai-pages-decimated)
17. [Google's August 2026 Spam Update Targeted Scaled AI Content: What Marketing Teams Must Fix Now](https://kurums.com/googles-august-2026-spam-update-targeted-scaled-ai-content-what-marketing-teams-must-fix-now/)
18. [Google Search Console AI performance reports and Search generative AI control rolling out globally](https://searchengineland.com/google-search-console-ai-performance-reports-and-search-generative-ai-control-rolling-out-globally-486269)
19. [AI Overviews Cut Clicks 58%. What That Number Actually Measures](https://w2bagency.com/blog/ai-overviews-click-decline)
20. [Bing Webmaster Tools AI Performance Report: How to Analyze and Optimize Your Copilot Citations - AI Search Visibility Blog | Insights and Data | OtterlyAI](https://otterly.ai/blog/bing-webmaster-tools-ai-performance-report/)
21. [Google's Guide to Optimizing for Generative AI Features on Google Search | Google Search Central | Documentation | Google for Developers](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
22. [Content Strategy for AI Overviews: Post-I/O 2026 Guide](https://www.digitalapplied.com/blog/content-strategy-ai-overviews-post-io-guide-2026)
23. [Google AI Overview Citations From Top-Ranking Pages Drop Sharply](https://www.searchenginejournal.com/google-ai-overview-citations-from-top-ranking-pages-drop-sharply/568637/)
24. [The conference for marketers ready to win in 2026](https://ahrefs.com/blog/ai-overview-citations-top-10)
25. [Catherine Gason on X: "Ranking first used to be enough. Mid-2025: \~76% of AI Overview citations came from Google's top 10. 2026: that overlap is down to \~17% (@brightedge) to 38% (@ahrefs). A top ranking no longer guarantees a citation." / X](https://x.com/GasOnMarketing/status/2062178687613628556)
26. [FAQ Rich Results Deprecated: Google's May 2026 Change](https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now)
27. [The conference for marketers ready to win in 2026](https://ahrefs.com/blog/ai-seo-statistics)
28. [Google AI Overviews & CTR: How to Fight Back](https://www.highervisibility.com/seo/learn/google-ai-overviews-impact-organic-ctr/)
29. [Zero-Click Search 2026: Data, AI Overviews & What to Do](https://www.seo-kreativ.de/en/blog/zero-click-search/)
30. [The conference for marketers ready to win in 2026](https://ahrefs.com/blog/ai-overviews-reduce-clicks-update)
31. [How much do Google AI Overviews reduce clicks? (2026 CTR data) | Buffy](https://heybuffy.com/blog/how-much-do-ai-overviews-reduce-clicks)
32. [How AI Overviews Are Cutting Google CTR by 61% (Recovery Plan 2026) | Mersel AI](https://www.mersel.ai/blog/ai-overviews-changing-google-ctr)
33. [Seer Interactive Research Featured in Inc. Analysis of CTR and AI Overviews](https://www.seerinteractive.com/news/seer-interactive-research-featured-in-inc.-analysis-of-ctr-and-ai-overviews)
34. [AIO Impact on Google CTR: September 2025 Update](https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-september-2025-update)
35. [New data: Google AI Overviews are hurting click-through rates](https://searchengineland.com/google-ai-overviews-hurt-click-through-rates-454428)
36. [Google AI Overviews: New CTR Study Reveals How to Navigate Negative SERP Impact | Amsive](https://www.amsive.com/insights/seo/google-ai-overviews-new-research-reveals-how-to-navigate-click-drop-off/)
37. [Google zero-click searches reach 68% in early 2026: Study](https://searchengineland.com/google-zero-click-searches-2026-study-479717)
38. [In 2026, Less than One Third of Google Searches Still Send a Click - SparkToro](https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/)
39. [Zero-Click Hits 68%: Inside the 2026 SparkToro Study](https://www.digitalapplied.com/blog/sparktoro-zero-click-study-2026-68-percent-seo-analysis)
40. [The State of Search in 2025: Key Takeaways from the Datos & SparkToro Q4 Report - Anicca](https://anicca.co.uk/blog/the-state-of-search-in-2025-key-takeaways-from-the-datos-sparktoro-q4-report/)
41. [AI Referral Traffic vs Organic Search: Conversion Rates and Performance Compared](https://www.airops.com/blog/ai-referral-traffic-conversion-rates)
42. [AI Search Visitors Convert 23x Higher. Everyone's Ignoring It.](https://www.averi.ai/blog/ai-search-visitors-convert-23x-higher.-everyone-s-ignoring-it.)
43. [How to Measure AI Search Traffic](https://authoritytech.io/curated/ai-search-traffic-conversion-measurement-2026)
44. [Referral Traffic from ChatGPT Hit an All-Time High in May 2026](https://seranking.com/blog/chatgpt-referral-traffic-may-2026/)
45. [Google Drops FAQ Rich Results From Search](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/)
46. [Pagination, incremental page loading, and their impact on Google Search](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading?authuser=8)
47. [How To Properly Set Up Pagination With Sorting Parameters Using Rel Next/Prev And Rel Canonical \[SEO Tutorial\]](https://www.gsqi.com/marketing-blog/how-to-set-up-pagination-rel-next-prev/)
48. [Pagination SEO Best Practices & Need-to-Know Nuances | Gray Dot Co](https://thegray.company/blog/pagination-seo-guide)
49. [Core web vitals guide · Unlighthouse](https://unlighthouse.dev/learn-lighthouse/core-web-vitals)
50. [Core Web Vitals: Optimizing LCP, INP & CLS \[Guide 2026\]](https://www.seo-kreativ.de/en/blog/core-web-vitals-optimizing/)
51. [Performance | 2025 | The Web Almanac by HTTP Archive](https://almanac.httparchive.org/en/2025/performance)
52. [Core Web Vitals Benchmarks 2026: What Good Looks Like](https://www.digitalapplied.com/blog/core-web-vitals-benchmarks-2026-pass-rate-reference)
53. [What Are the Core Web Vitals? LCP, INP & CLS Explained (2026)](https://www.corewebvitals.io/core-web-vitals)
54. [Core Web Vitals Explained for Marketers: LCP, INP, and CLS in Plain English](https://yassersoliman.com/blog/core-web-vitals-explained-marketers/)
55. [Core Web Vitals Data Study: Insights from 8M+ Sites](https://www.tryanalyze.ai/blog/core-web-vitals-data-study)
56. [Core Web Vitals Explained: How to Measure and Fix Them](https://bsscommerce.com/services/blog/core-web-vitals-explained)
57. [Core Web Vitals Statistics: 43% Fail INP in 2026](https://thestacc.com/blog/core-web-vitals-statistics/)
58. [The Blogging Tactic No One Is Talking About: Optimizing the Past](https://blog.hubspot.com/marketing/historical-blog-seo-conversion-optimization)
59. [www.slideshare.net](https://www.slideshare.net/slideshow/generate-traffic-and-conversions-on-your-blog-without-creating-another-post/61638183)
60. [How to Historically Optimize Blog Content | IMPACT](https://www.impactplus.com/blog/how-to-improve-underperforming-content-with-historical-blog-optimization)
61. [Content Refresh Strategy: How Backlinko Got 260% More Traffic Without Writing a New Post | Ansly](https://tryansly.com/blog/seo-case-study-content-refresh)
62. [Republishing Content for SEO & AI: How to Update Posts (Not Just Change Dates)](https://ahrefs.com/blog/republishing-content/)
63. [How to refresh content to stop performance decline (ft. examples) – Content strategist, writer, advisor for B2B startups](https://tabithawhiting.com/2025/01/28/content-refresh/)
64. [AI Shoppers Now Convert 42% Better Than Google Traffic](https://www.digitalapplied.com/blog/ai-traffic-converts-42-percent-better-2026-channel-strategy)
65. [hubspot traffic drop](https://surferseo.com/blog/hubspot-traffic-drop)
66. [Hubspot's Blog Organic Search Traffic Drop: What really happened?](https://www.aleydasolis.com/en/search-engine-optimization/hubspot-blog-rankings-drop-analysis/)
67. [SEO giant crashes: How HubSpot lost about 75-80% of its traffic—and what that means for you](https://xpert.digital/en/75-80-percent-traffic-lost/)
68. [How Rewriting One Article 5×’d Traffic in 4 Months](https://surferseo.com/blog/content-update-case-study)
69. [Publishers swap traffic angst for strategy in Q3 earnings - Digiday](https://digiday.com/media/publishers-swap-traffic-angst-for-strategy-in-q3-earnings/)
70. [People Inc. Says Who Needs Google? | AdExchanger](https://www.adexchanger.com/publishers/people-inc-says-who-needs-google/)
71. <https://digitalworldinstitute.com/blog/ecommerce-seo-case-studies/>
