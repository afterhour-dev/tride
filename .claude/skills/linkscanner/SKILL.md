---
name: linkscanner
description: Scans documentation in docs/glavno, docs/blender, and docs/math for dead or unreachable external links, and produces a report. Use for periodic (e.g. monthly) link maintenance.
argument-hint: [glavno|blender|math] (optional, scans all three if omitted)
disable-model-invocation: true
allowed-tools: Grep, Glob, Read, WebFetch, Write
---

# This skill scans docs/ for dead links and reports them — it never edits existing docs

Never modify any file under `docs/glavno/`, `docs/blender/`, or
`docs/math/` — this skill only reads them and writes a separate report
file. It also never touches `apps/`, `experiments/`, `templates/`, or
`konvencija/`.

## Scope

If `$ARGUMENTS` is empty, scan all three: `docs/glavno`, `docs/blender`,
`docs/math`.

If `$ARGUMENTS` is one of `glavno`, `blender`, or `math`, scan only
`docs/{$ARGUMENTS}`.

If `$ARGUMENTS` is anything else, ask the user to confirm which of the
three they meant, or whether to scan all of them.

Never scan `docs/link-checks/` itself (that's where this skill's own
reports live — scanning it would re-check already-reported links and
pollute future reports).

## Step 1 — Extract links

Use Grep to find all `https?://` URLs inside the scoped folder(s),
capturing the file path and line number for each match.

- Ignore Obsidian wiki-links (`[[...]]`) — those are internal, not
  external URLs, and won't match the URL pattern anyway.
- A single URL may appear in multiple files/lines — keep track of every
  occurrence (file + line), not just the first.
- Deduplicate down to a list of unique URLs, each with its list of
  occurrences.

## Step 2 — Check each unique URL

For each unique URL, use WebFetch to check if it resolves. Ask a minimal
question like "What is the title of this page?" — the goal is just to see
whether the fetch succeeds, not to extract real content.

Classify each URL as:
- **OK** — fetch succeeded, page returned real content.
- **Suspect** — fetch failed (404, DNS error, timeout, connection refused,
  or an explicit error/not-found page).

Do not retry more than once per URL. Do not follow redirects manually —
if WebFetch reports success after a redirect, treat it as OK.

## Step 3 — Generate the report

Create the report at `docs/link-checks/{today's date, YYYY-MM-DD}.md`.
If `docs/link-checks/` doesn't exist, create it.

```md
---
date: {today's date, YYYY-MM-DD}
scope: {glavno, blender, math — whichever were scanned}
total_links: {count of unique URLs checked}
suspect_count: {count of suspect URLs}
---

## Suspect Links

{For each suspect URL:}

### {url}

- Found in:
  - `{file path}:{line number}`
  - `{file path}:{line number}` (repeat for every occurrence)
- Issue: {short description — e.g. "404 Not Found", "connection failed"}

{If no suspect links were found, write: "No suspect links found in this scan."}

## Summary

- Total unique links checked: {total_links}
- Suspect: {suspect_count}
- OK: {total_links - suspect_count}
```

Only list suspect links in detail — do not list every OK link individually,
to keep the report short and focused on what actually needs attention.

## After generating the report

Confirm with:
"Link check complete: {suspect_count} suspect link(s) out of {total_links}
checked. Report saved to `docs/link-checks/{date}.md`."

If there are suspect links, briefly mention the top 2-3 by name in the
confirmation message so the user gets a quick sense of what to look at,
without having to open the file immediately.