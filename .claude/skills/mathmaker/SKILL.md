---
name: mathmaker
description: Creates obsidian flavoured doc from a completed Three.js, WebGL, WebGPU, Shader application or a game, or other kind of exercise, which is strictly related to complecated math or physics problem. Use when the user completes an app or experiment and wants it documented.
argument-hint: [app-folder-name]
disable-model-invocation: true
allowed-tools: Read, Write, Glob, AskUserQuestion
---

# This skill is making math and physics documentation for an application

Never write or modify files inside `apps/` or `experiments/` — this skill is read-only there.
Its only job is producing documentation under `docs/math/` that is related to math and physics and provide necessary helpers that makes understanding of math, physics, geometry (related to 3D on the web and game development) much easier to understand.

## Math Explanation Style

When generating math docs, always:
- Use LaTeX: `$inline$` and `$$block$$`
- Write every step on its own line, every `=` on a new line
- Never skip steps or write "it's easy to see that..."
- Build from the user's own attempt at understanding if provided
- Include GeoGebra/Desmos URL with params for geometry/matrix concepts
<!-- move this to shadermaker skill -->
<!-- - Include ShaderToy link for shader-related concepts -->
- Include 3Blue1Brown link where a relevant video exists

## From which app is math being documented

`$ARGUMENTS` is expected to be the **folder name only** (e.g. `03-trigonometry-for-circular-movement`), not a full path.

If `$ARGUMENTS` is empty, ask the user which folder inside `apps/` this math lesson concerns, and wait for their answer before continuing.

Once you have a candidate folder name (from `$ARGUMENTS` or from the user's answer):

- Abort if it's an empty string, with an appropriate message.
- Abort if `apps/{folder-name}` doesn't exist in this monorepo, with an appropriate message.
- Abort if `apps/{folder-name}` doesn't look like a Node.js or Bun project (no `package.json`), with an appropriate message.

If the app exists and looks valid, proceed to the next step.

## Reading the app

Use Glob and Read to inspect `apps/{folder-name}`:

- List the files to understand the overall shape of the project.
- Read `package.json` to see what dependencies besides `"three"` were used, and give a short explanation of those packages.
- Read through the entire codebase, especially everything under `apps/{folder-name}/src`, plus any folder holding resources used by the app (models, images, textures, videos, or other media).
- Read `README.md` if present — it holds helpful information about user intention and what needs to be explained and emphasized.

## Comments inside the codebase are important

All comments in the codebase of the given application are crucial, because inside comments the user will specify what needs to be explained in more detail, and at what level of detail. Also what topics need to be placed inside reminders as something to revisit more often than things considered to be of usual, mid-level, or easy difficulty.