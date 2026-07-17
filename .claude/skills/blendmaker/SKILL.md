---
name: blendmaker
description: Creates Obsidian-flavoured markdown doc for a Blender learning session, technique, or CG Cookie course lesson. Use when the user wants to document something they learned or practiced in Blender — no app folder involved.
argument-hint: [lesson-name]
disable-model-invocation: true
allowed-tools: Read, Write, Glob, AskUserQuestion
---

# This skill documents Blender learning progress (no app folder involved)

Never touch `apps/`, or anything outside `docs/blender/` — this skill's only job is producing documentation there.

## Which lesson is being documented

`$ARGUMENTS` is expected to be a short, lowercase, hyphenated lesson name
(e.g. `edge-loops`, `shading-workflow`, `rigging-basics`).

If `$ARGUMENTS` is empty, ask the user for a short name for this lesson, and wait for their answer before continuing.

## Main Documentation Data

Collect the fields below from the user, one at a time, using this
protocol for each:

1. Use the **AskUserQuestion** tool with the header/question/options given for that field (where options are listed). For free-form fields (no options listed), just ask in plain text instead.
2. If AskUserQuestion is not available in your current toolset, ask the question in plain text and STOP — wait for the user's next message before continuing.
3. After receiving an answer, check it carefully. If it's empty, blank, generic, or doesn't look like a genuine response, ask the same question again in plain text and wait for the user's reply before continuing.

### Fields

**topic** — Blender subject area
- question: "What's the main Blender topic for this lesson?"
- options: modeling, sculpting, shading, materials, animation, rigging, lighting, compositing, simulation *(+ Other)*

**lesson_name** — short, lowercase, hyphenated (skip if already given via `$ARGUMENTS`)

**tags** — relevant tags for this lesson
- question: "Which tags apply to this lesson?"
- multiSelect: true
- options: geometry-nodes, uv, retopology, texturing, sculpting, weight-paint, camera, render, performance, workflow *(+ Other)*

**difficulty** — one of: beginner, intermediate, advanced
- question: "What difficulty level is this?"
- options: beginner, intermediate, advanced

## What Was Learned

Ask, in plain text, as a single question (batched, all optional except the first — this is the core content of the doc, so encourage at least a short answer):

"Tell me about this lesson — what did you learn or practice? Feel free to cover any of these, in your own words:
- the main concept or technique
- anything that was confusing or a gotcha
- anything you want to revisit or practice more
- your own attempt at explaining it, even if rough

I'll organize it into the doc structure below."

Wait for the user's reply before continuing. Use their answer, in their own words as much as possible, to fill `## Concept`, `## Gotchas`, and `## Revisit` in the template below — don't invent content they didn't give you, but you may lightly clean up phrasing and add structure.

## Video Reference

Ask, in plain text:

"Any YouTube video(s) this lesson is based on or references? Paste the URL(s), or say 'skip' if none. A short note on why each one is useful is welcome but optional."

If the user provides one or more URLs, for each one:
- Embed it using Obsidian's native YouTube embed syntax:
  `![](https://www.youtube.com/watch?v=VIDEO_ID)`
- Include the user's note next to it if they gave one.

If the user skips, omit the `## Video Reference` section entirely rather than leaving it empty.

## Other Links

Ask, in plain text, as a single optional question:

"Any other helpful links — docs, articles, forum posts, addons? Optional, say 'skip' if none."

Add Claude-suggested links where relevant (official Blender manual pages, well-known addons, CG Cookie related content) even if the user skipped — mark these with `> 🤖 suggested` so it's clear they weren't user-provided.

## Generation of Lesson File

Create the file at `docs/blender/{topic}/{lesson_name}.md`.
If `docs/blender/{topic}/` doesn't exist, create it.

### Frontmatter

```md
title: {lesson_name}
topic: {topic}
date: {today's date, YYYY-MM-DD}
tags: [{tags}]
difficulty: {difficulty}
```

### Content structure

```md
## Concept

{main concept/technique, from "What Was Learned" answer}

## Video Reference

{embedded YouTube video(s) with notes — omit this whole section if none were given}

## Gotchas

{confusing parts or easy mistakes, from "What Was Learned" answer}

## Revisit

{what to practice or look into further, from "What Was Learned" answer}

## Links & Resources

### Docs
### Articles
### Videos
### Addons
### Other
```

Categorize any links (besides the main Video Reference) under these headers. `### Addons` replaces the `### Tools`/`### Repos` categories used in the Three.js-focused skills, since Blender addons are the more relevant equivalent here.

## Generation of Topic file

If `docs/blender/{topic}/{topic}.md` doesn't exist, create it with a `# {topic}` heading, followed by `> Links in this file are Obsidian wiki-links and will not work on GitHub.`, and an empty lessons list.

Add a wiki-link to the new lesson under a `## Lessons` section, formatted as `- [[{lesson_name}]] — {today's date}`.

---

After creating all files, confirm with:
"Blender lesson created at `docs/blender/{topic}/{lesson_name}.md`, linked in `docs/blender/{topic}/{topic}.md`."
