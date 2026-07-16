---
name: mathmaker
description: Creates Obsidian-flavoured markdown doc from a completed Three.js, WebGL, WebGPU, Shader application or a game, or other kind of exercise, which is strictly related to complicated math, physics, mechanics, or geometry problems. Use when the user completes an app or experiment and wants the underlying math documented.
argument-hint: [app-folder-name]
disable-model-invocation: true
allowed-tools: Read, Write, Glob, AskUserQuestion
---

# This skill is making math, physics, or mechanics related documentation for an application

Never write or modify files inside `apps/` — this skill is read-only there.
Its only job is producing documentation under `docs/math/` that explains
math, physics, mechanics, or geometry (related to 3D on the web and web
game development), and provides helpers that make understanding these
concepts easier.

## Which app is the math being documented from

`$ARGUMENTS` is expected to be the **folder name only** (e.g.
`03-trigonometry-for-circular-movement`), not a full path.

If `$ARGUMENTS` is empty, use the **AskUserQuestion** tool to ask which
folder inside `apps/` this math lesson concerns. If AskUserQuestion is not
available, ask in plain text and STOP — wait for the user's next message
before continuing. If the returned answer is empty, blank, or doesn't
look genuine, ask again in plain text and wait for a real reply.

Once you have a candidate folder name (from `$ARGUMENTS` or the user's
answer):

- Abort if it's an empty string, with an appropriate message.
- Abort if `apps/{folder-name}` doesn't exist in this monorepo, with an
  appropriate message.
- Abort if `apps/{folder-name}` doesn't look like a Node.js or Bun project
  (no `package.json`), with an appropriate message.

If the app exists and looks valid, proceed to the next step.

## Important places to read in the app

Use Glob and Read to inspect `apps/{folder-name}/src` and
`apps/{folder-name}/MATH.md`:

- Read through the files in `apps/{folder-name}/src`.
- Read `apps/{folder-name}/MATH.md` if it exists — it holds the user's
  intention and what needs to be explained and emphasized.

If `MATH.md` doesn't exist at that path, don't abort — it's a convenience,
not a hard requirement. Instead, use AskUserQuestion (or plain text if
unavailable) to ask the user directly for: the problem, their current
understanding (if any), and what they need explained (using the same five
options listed below under "What I Need").

## About `apps/{folder-name}/MATH.md`

Read the referenced file.

**Frontmatter values — validate before using:**

Extract `topic`, `concept`, and `difficulty` from frontmatter. Each of
these fields in the template contains a placeholder list of options
separated by ` / ` (e.g. `threejs / shaders / mechanics`). If the value
you read still looks like that placeholder list (multiple options
separated by " / ", not a single clean value the user picked), do NOT use
it as-is. Use AskUserQuestion to ask the user to choose the correct single
value for that field before continuing.

**From content, extract:**

- `## The Problem` — the user's raw question
- `## My Attempt at Understanding` — the user's current mental model, even
  if wrong (leave empty if not filled in)
- `## What I Need` — which explanation styles were requested

**Detecting what was requested in "What I Need":**

The template lists five options, each wrapped in an HTML comment
(`<!-- -->`). An option counts as requested **only if its text appears
outside the comment markers** (the user deleted `<!--`/`-->` around it).
Anything still wrapped in a comment is NOT requested.

If none of the five options were uncommented, use AskUserQuestion
(`multiSelect: true`) to ask the user directly which explanation styles
they want, using the same five options as choices:
- Intuitive explanation before the formal one
- Just the formal definition
- Step by step breakdown
- Real world example
- Visual helper

## Explanation rules — follow these strictly

- Always correct and build from `## My Attempt at Understanding` if
  provided — never ignore it.
- If "Intuitive explanation before the formal one" was requested: start
  with a plain-English analogy, then move to formal notation.
- If "Just the formal definition" was requested: go straight to formal
  notation, skip analogies.
- If "Step by step breakdown" was requested: every step on its own line,
  every `=` on a new line, nothing skipped, no "it's easy to see that...",
  no hand-waving.
- If "Real world example" was requested: show exactly where this appears
  in Three.js or GLSL/TSL code with a minimal snippet.
- If "Visual helper" was requested: generate a GeoGebra or Desmos URL with
  parameters pre-configured for the concept where possible. For
  shader-related concepts, link to a relevant ShaderToy example. For
  concepts with a 3Blue1Brown video, include that link.
- Use LaTeX for all math notation: `$inline$` for inline, `$$block$$` for
  block equations.
- Never skip steps in block equations — each transformation gets its own
  line, e.g.:

$$
\vec{v'} = M \cdot \vec{v}
$$
$$
= \begin{bmatrix} a & b \\ c & d \end{bmatrix} \cdot \begin{bmatrix} x \\ y \end{bmatrix}
$$
$$
= \begin{bmatrix} ax + by \\ cx + dy \end{bmatrix}
$$

## Once the explanation is ready

- Create the file at `docs/math/{topic}/{concept}.md`.
- If `docs/math/{topic}/` doesn't exist, create it.

## Generate the math doc using this exact structure

Frontmatter:

```md
title: {concept}
date: {today's date, YYYY-MM-DD}
topic: {topic}
difficulty: {difficulty}
app_path: apps/{folder-name}
```

Content — only include a section if its corresponding option was
requested (per the detection rule above); omit sections that weren't
requested rather than leaving them empty:

```md
## The Problem

{restate the user's problem in clear terms}

## Intuition

{plain-English explanation — only if "Intuitive explanation" was requested}

## Formal Definition

{formal notation using LaTeX blocks}

## Step by Step

{every step explicit, every = on its own line, nothing skipped — only if
"Step by step" was requested}

## In Three.js / Shaders

{minimal real code snippet showing exactly where this appears — only if
"Real world example" was requested}

## Visual Helper

{GeoGebra/Desmos URL with params, or ShaderToy link, or 3Blue1Brown link —
only if "Visual helper" was requested}

## Revisit

{what the user should practice or look into further to solidify this
concept}

## Links & Resources

### Docs
### Examples
### Tools
### Articles
### Videos
### Courses & Talks
### Repos
### Other
```

After creating the file, confirm with:
"Math doc created at `docs/math/{topic}/{concept}.md`"