---
name: mathmaker
description: Creates obsidian flavoured doc from a completed Three.js, WebGL, WebGPU, Shader application or a game, or other kind of exercise, which is strictly related to complecated math or physics problem. Use when the user completes an app or experiment and wants it documented.
argument-hint: [app-folder-name]
disable-model-invocation: true
allowed-tools: Read, Write, Glob, AskUserQuestion
---

# This skill is making math and physics documentation for an application

Never write or modify files inside `apps/` or `experiments/` — this skill is read-only there.
Its only job is producing documentation under `docs/math/` that is related to math and physics, and provide necessary helpers that makes understanding of math, physics, geometry (related to 3D on the web and game development on the web) much easier to understand.

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

## Reading the app is not crucial but it can help

Use Glob and Read to inspect `apps/{folder-name}/src` and `apps/{folder-name}/MATH.md`:

- Read through files `apps/{folder-name}/src`
- Read `MATH.md` — it holds helpful information about user intention and what needs to be explained and emphasized.

## `apps/{folder-name}/MATH.md`

Read the referenced file. Extract:
- `topic` — the subject area (e.g. `trygonometry`, `shaders`, `movement`, `physics`)
- `concept` — the specific concept to explain (e.g. `rotation-matrix`, `dot-product`)
- `difficulty` — beginner / intermediate / advanced / hard/ very hard
- `## The Problem` — the user's raw question
- `## My Attempt at Understanding` — the user's current mental model, even if wrong
- `## What I Need` — which checkboxes are ticked