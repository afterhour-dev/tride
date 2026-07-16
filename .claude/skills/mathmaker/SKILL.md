---
name: mathmaker
description: Creates obsidian flavoured doc from a completed Three.js, WebGL, WebGPU, Shader application or a game, or other kind of exercise, which is strictly related to complecated math or physics, or mechanics, or geomerty problem. Use when the user completes an app or experiment and wants it documented.
argument-hint: [app-folder-name]
disable-model-invocation: true
allowed-tools: Read, Write, Glob, AskUserQuestion
---

# This skill is making math, physics or mechanics related documentation for an application

Never write or modify files inside `apps/` or `experiments/` — this skill is read-only there.
Its only job is producing documentation under `docs/math/` that is related to math, physics, mechanics, and provide necessary helpers that makes understanding of math, physics, geometry, mechanics (related to 3D on the web and game development on the web) much easier to understand.

## Math Explanation Style

When generating math docs, always:
- Use LaTeX: `$inline$` and `$$block$$`
- Write every step on its own line, every `=` on a new line
- Never skip steps or write "it's easy to see that..."
- Build from the user's own attempt at understanding if provided
- Include GeoGebra/Desmos URL with params for geometry/matrix concepts
- Include ShaderToy link for shader-related concepts
- Include 3Blue1Brown link where a relevant video exists

## From which app is math being documented

`$ARGUMENTS` is expected to be the **folder name only** (e.g. `03-trigonometry-for-circular-movement`), not a full path.

If `$ARGUMENTS` is empty, ask the user which folder inside `apps/` this math lesson concerns, and wait for their answer before continuing.

Once you have a candidate folder name (from `$ARGUMENTS` or from the user's answer):

- Abort if it's an empty string, with an appropriate message.
- Abort if `apps/{folder-name}` doesn't exist in this monorepo, with an appropriate message.
- Abort if `apps/{folder-name}` doesn't look like a Node.js or Bun project (no `package.json`), with an appropriate message.

If the app exists and looks valid, proceed to the next step.

## Important places to read in the app

Use Glob and Read to inspect `apps/{folder-name}/src` and `apps/{folder-name}/MATH.md`:

- Read through files `apps/{folder-name}/src`
- Read `MATH.md` — it holds helpful information about user intention and what needs to be explained and emphasized.

## `apps/{folder-name}/MATH.md`

Read the referenced file.

From frontmatter extract:
- `topic` — the subject area (e.g. `threejs`, `shaders`, `blender`)
- `concept` — the specific concept to explain (e.g. `rotation-matrix`, `dot-product`)
- `difficulty` — beginner / intermediate / advanced / hard / very hard

From content extract:
 
- `## The Problem` — the user's raw question
- `## My Attempt at Understanding` — the user's current mental model, even if wrong
- `## What I Need` - things user needs to be explained for them

## Explanation rules — follow these strictly

- Always correct and build from `## My Attempt at Understanding` if provided — never ignore it
- If "Intuitive explanation before the formal one" is requested: start with a plain english analogy, then move to formal notation
- If "Just the formal definition" is requested: go straight to formal notation, skip analogies
- If "Step by step breakdown" is requested: every step on its own line, every `=` on a new line, nothing skipped, no "it's easy to see that...", no hand-waving
- If "Real world example" is requested: show exactly where this appears in Three.js or GLSL code with a minimal snippet
- If "Visual helper" is requested: generate a GeoGebra or Desmos URL with parameters pre-configured for the concept where possible. For shader-related concepts, link to a relevant ShaderToy example. For concepts with a 3Blue1Brown video, include that link.
- Use LaTeX for all math notation: `$inline$` for inline, `$$block$$` for block equations
- Never skip steps in block equations — each transformation gets its own line:

$$
\vec{v'} = M \cdot \vec{v}
$$
$$
= \begin{bmatrix} a & b \\ c & d \end{bmatrix} \cdot \begin{bmatrix} x \\ y \end{bmatrix}
$$
$$
= \begin{bmatrix} ax + by \\ cx + dy \end{bmatrix}
$$

## Once explanation is ready

- Create the file at `docs/math/{topic}/{concept}.md`
- If `docs/math/{topic}/` does not exist, create it

## Generate the math doc using this exact structure

frontmatter:

```md
title: {concept}
date: {today's date, YYYY-MM-DD}
topic: {topic}
difficulty: {difficulty}
app: {app path}
```

content:

```md
## The Problem

{restate the user's problem in clear terms}

## Intuition

{plain english explanation — only if "Intuitive explanation" was requested}

## Formal Definition

{formal notation using LaTeX blocks}

## Step by Step

{every step explicit, every = on its own line, nothing skipped — only if "Step by step" was requested}

## In Three.js / Shaders

{minimal real code snippet showing exactly where this appears — only if "Real world example" was requested}

## Visual Helper

{GeoGebra/Desmos URL with params, or ShaderToy link, or 3Blue1Brown link — only if "Visual helper" was requested}

## Revisit

{what the user should practice or look into further to solidify this concept}

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

After creating a file, confirm with:
"Math doc created at `docs/math/{topic}/{concept}.md`"
