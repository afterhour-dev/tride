---
name: docmaker
description: Creates obsidian flavoured lesson doc from a completed Three.js, WebGL, WebGPU, Shader application, or exercise. Use when the user completes an app or experiment and wants it documented.
argument-hint: [app-folder-name]
disable-model-invocation: true
allowed-tools: Read, Write, Glob, AskUserQuestion
---

# This skill is making documentation for an application

Never write or modify files inside `apps/` or `experiments/` — this skill is read-only there.
Its only job is producing documentation under `docs/`.

## Which app is being documented

`$ARGUMENTS` is expected to be the **folder name only** (e.g. `03-shaders`), not a full path.

If `$ARGUMENTS` is empty, ask the user which folder inside `apps/` this lesson concerns, and wait for their answer before continuing.

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

## Main Documentation Data

Collect the fields below from the user, one at a time, using this protocol for each:

1. Use the **AskUserQuestion** tool with the header/question/options given for that field (where options are listed). For free-form fields (no options listed), just ask in plain text instead.
2. If AskUserQuestion is not available in your current toolset, ask the question in plain text and STOP — wait for the user's next message before continuing.
3. After receiving an answer, check it carefully. If it's empty, blank, generic, or doesn't look like a genuine response, ask the same question again in plain text and wait for the user's reply before continuing.

### Fields

**topic** — main subject area
- question: "What's the main topic for this lesson?"
- options: threejs, r3f, blender related, math, geometry, game development *(+ Other)*

**lesson_number** — number prepended to the lesson filename
- free-form, plain text — no options

**lesson_name** — short, lowercase, hyphenated (e.g. `scene-graph`, `physically-based-materials`)
- free-form, plain text — no options

**tags** — relevant tags for this lesson
- question: "Which tags apply to this lesson?"
- multiSelect: true
- options: math, geometry, shaders, webgl, webgpu, camera, material, performance, helpers, gamedev, blender-related *(+ Other)*

**difficulty** — one of: beginner, intermediate, advanced, hard, very hard
- question: "What difficulty level is this lesson?"
- options: beginner, intermediate, advanced, hard, very hard

## Optional Documentation Data

Ask everything below as a **single** plain-text question — these are optional and often skipped entirely, so batching saves a round of back-and-forth:

"Anything else worth noting for this lesson? All optional — feel free to answer some, all, or none:
- something to emphasize
- something to expand on / explain in more depth
- concerns or things you're unsure about
- gaps you noticed that need more attention
- helpful links you found (with a short note on why, if you like)

Reply with whatever applies, or say 'skip' / leave it blank to move on."

Wait for the user's reply before continuing.

**Handling the answer:**
- If the user skips or leaves it blank, treat all five as empty and move on immediately — do NOT re-ask or treat this as an invalid response.
- If they answer some parts but not others, leave the untouched ones empty
- don't press for the rest.
- Sort their free-form answer into: Emphasis, Expand on, Concerns, Gaps, Links. It's fine if their answer doesn't map cleanly to these labels — use judgment; a slightly imperfect sort here is better than forcing them through five separate prompts.

## Generation of Lesson file

File needs to be generated following this convention for the path:
`docs/glavno/{topic}/lessons/{lesson_number}_{lesson_name}.md`

### Structure of the lesson file - frontmatter

Frontmatter needs to contain the following:

```md
title: {lesson_number} {lesson_name}
topic: {topic}
date: {today's date, YYYY-MM-DD}
tags: [{tags}]
difficulty: {difficulty}
app_path: apps/{folder-name}
```

### Structure of the lesson file - `## Concept`

{clear explanation of the concept in plain terms, with inline links where relevant. Make sure you cover everything the user emphasized as needing explanation, from the comments in the codebase}

### Structure of the lesson file - `## Code`

in repo - `apps/{folder-name}`

```ts
// minimal working example
```

### Structure of the lesson file - `## Gotchas`

{things that are easy to get wrong, with inline links where relevant. Pay attention to comments in the codebase where the user flagged something as complicated or noted a gotcha}

### Structure of the lesson file - `## Revisit`

{things that are easy to forget, what the user should look into further, expand on, or practice again — especially informed by the comments in the codebase if provided}

### Structure of the lesson file - `## Outdated`

{If the approach is outdated, explain to the user and provide further learning resources}

{link suggestions formatted as:}
> 💡 More up to date alternative: {url} — {reason}

Especially if the project is doable with WebGPU instead of WebGL, emphasize this with bold text and relevant emojis.

If not outdated, output this: `approach is valid`

### Structure of the lesson file - `## Links & Resources`

External links related to the lesson. Should hold optional links provided by the user, plus relevant links you suggest.

Categorize all links under: `### Docs`, `### Examples`, `### Tools`, `### Articles`, `### Videos`, `### Courses & Talks`, `### Repos`, `### Other`.

```md
### Docs

{official docs of the technology used in this lesson}

### Examples

{official examples of the technology used in this lesson}

### Tools

{helpful tools for easier learning — interactive online tools for threejs, math, geometry, gamedev, gamedev math, or other concepts related to the lesson}

### Articles

{popular helpful articles, if available}

### Videos

{popular helpful videos, if available}

### Courses & Talks

{popular relevant courses and talks, if available}

### Repos

{popular relevant repos, if available}

### Other

{other stuff that can be helpful}
```

## Links handling in the lesson file

- Place a link inline in the lesson where most relevant (Concept, Code, or Gotchas).
- Include it in `## Links & Resources` under the correct category.
- If a more up-to-date alternative exists, keep the original and add the suggestion below it marked `> 💡 More up to date alternative:` -> place this in `## Revisit`, not inline.

Add Claude-suggested links relevant to the topic (official docs, useful tools, good examples). Mark them with `> 🤖 suggested` so the user knows they came from Claude, not their own research.

## Generation of Topic file

File is a table of contents for a topic, with Obsidian links pointing to individual lesson files.

If the topic file doesn't exist, create it at `docs/glavno/{topic}/{topic}.md` with a `# {topic}` heading, followed by `> Links in this file are Obsidian wiki-links and will not work on GitHub.`, and an empty lessons list.

Add an Obsidian wiki-link to the new lesson in `docs/glavno/{topic}/{topic}.md` under a `## Lessons` section, formatted as `- [[{lesson_number}_{lesson_name}]] — {today's date}`.

---

After creating all files, confirm with:
"Lesson created at `docs/glavno/{topic}/lessons/{lesson_number}_{lesson_name}.md`, linked in `docs/glavno/{topic}/{topic}.md`."
