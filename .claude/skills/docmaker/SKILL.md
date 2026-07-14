---
name: docmaker
description: Creates lesson doc from a completed Three.js, WebGL, WebGPU, Shader application, or exercise. Use when the user complets an exercise or an app and wants it documented.
argument-hint: [app-path]
disable-model-invocation: true
allowed-tools: Read, Write, Glob
context: fork
---

# This skill is making documentation for an application

## The app being documented is: $ARGUMENTS

If no app path was given above, ask the user which folder inside `apps/` this lesson concerns, and wait for their answer before continuing.

Abort if user provided empty string for an answer, with appropriate message.
Abort if user provided path that doesn't start with `apps/`, with appropriate message.
Abort if user provided path which doesn't point to the app inside `apps/` folder in this monorepo, with appropriate message.
Abort if user provided path to a non nodejs or bun project, with appropriate message.

If app exists, proceed to the next step.

## Files in this app

!`ls apps/$ARGUMENTS`

Read through all files in `apps/$ARGUMENTS` to understand what was built.

## `package.json`

!`cat apps/$ARGUMENTS/package.json`

Read through all dependencies to see what packages besides "three" (Three.js) were used in building of the given app and give short explanation about those packages.

## Read the entire codebase (things inside source folder: `apps/$ARGUMENTS/src` are most important)

Including any other folder consisting of resources used by the app (models, images, textures, videos or other media)

## Comments inside codebase are important

All the comments in codebase of the given application are crucial, because inside comments user will specify what does need to be explained in more deatail, and in what level of deatailness. Also what topics need to be placed inside reminders as something to be revisited more offten than things considered to have usual or mid level or easy difficulty.

## Main Documentation Data

Collect the fields below from the user, one at a time, using this protocol
for each:

1. Use the **AskUserQuestion** tool with the header/question/options given
   for that field (where options are listed). For free-form fields (no
   options listed), just ask in plain text instead.
2. If AskUserQuestion is not available in your current toolset, ask the
   question in plain text and STOP — wait for the user's next message
   before continuing.
3. After receiving an answer, check it carefully. If it's empty, blank,
   generic, or doesn't look like a genuine response, ask the same question
   again in plain text and wait for the user's reply before continuing.

### Fields

**topic** — main subject area
- question: "What's the main topic for this lesson?"
- options: threejs, r3f, blender, math, geometry, game development *(+ Other)*

**lesson_number** — number prepended to the lesson filename
- free-form, plain text — no options

**lesson_name** — short, lowercase, hyphenated (e.g. `scene-graph`, `physically-based-materials`)
- free-form, plain text — no options

**tags** — relevant tags for this lesson
- question: "Which tags apply to this lesson?"
- multiSelect: true
- options: math, geometry, shaders, webgl, webgpu, camera, material, performance, helpers *(+ Other)*

**difficulty** — one of: beginner, intermediate, advanced, hard
- question: "What difficulty level is this lesson?"
- options: beginner, intermediate, advanced, hard

## Optional Documentation Data

Ask everything below as a **single** plain-text question — these are
optional and often skipped entirely, so batching saves a round of
back-and-forth:

"Anything else worth noting for this lesson? All optional — feel free to
answer some, all, or none:
- something to emphasize
- something to expand on / explain in more depth
- concerns or things you're unsure about
- gaps you noticed that need more attention
- helpful links you found (with a short note on why, if you like)

Reply with whatever applies, or say 'skip' / leave it blank to move on."

Wait for the user's reply before continuing.

**Handling the answer:**
- If the user skips or leaves it blank, treat all five as empty and move
  on immediately — do NOT re-ask or treat this as an invalid response.
- If they answer some parts but not others, leave the untouched ones empty
  — don't press for the rest.
- Sort their free-form answer into: Emphasis, Expand on, Concerns, Gaps,
  Links. It's fine if their answer doesn't map cleanly to these labels —
  use judgment; a slightly imperfect sort here is better than forcing them
  through five separate prompts.

## Generating documentation file

### Path of the document

File needs to be gerated from data user provided by following this convention: `docs/glavno/{topic}/lessons/{lesson_number}_{lesson_name}.md`

<!--  -->
<!--  -->
<!--  -->

Then generate the lesson doc as specified by instructions below.

