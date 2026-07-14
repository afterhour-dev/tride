# Триде

pnpm monorepo for 3D learning and experimentation with Three.js, R3F, WebGL, WebGPU, game development on the web using Three.js, Blender and other topics related to 3D.

## Role of Claude Code in This Project

Claude Code here is used for **documentation and learning support only**:
generating lesson docs, math explanations, and links indices from completed exercises. It should not write, refactor, or scaffold app code inside `apps/` or `experiments/` unless explicitly asked — app code is written by hand, by design, for practice. Interpretation and documenting from mentioned apps and experiments is most important thing in this monorepo.

## Structure

- `apps/` — standalone apps
- `experiments/` — more experimental apps (things that need to be studied more and thir development repeated)
- `docs/` — Obsidian vault, plain markdown, no package.json
- `packages/` — shared code when it naturally emerges

<!-- neeed to rethink these -->

- `lesson-blueprints/` — rough notes per topic for `/new-lesson`, read by Claude when generating lessons
- `math-blueprints/` — problem files per concept for `/math-logic`, read by Claude when generating math docs
- `templates/` — source templates, never edited directly, copied when needed

## Current Apps

- `apps/<>/` — Three.js exercises

## Current Experiments

- `experiments/<>/`

## Tech

- Apps use Vite + vanilla Three.js or Vite + R3F depending on the experiment
- TypeScript throughout
- pnpm for everything, no npm or yarn

## Docs

- Notes live in `docs/` obsidian vault as markdown files
- Lesson frontmatter fields: `title`, `date`, `tags`, `topic`, `difficulty`, `app`
- Math frontmatter fields: `title`, `date`, `tags`, `topic`, `difficulty`, `lesson`, `app`
- Lessons organized as `docs/{topic}/lessons/{lesson-name}.md`
- Math docs organized as `docs/math/{topic}/{concept-name}.md`
- Each topic has an index file at `docs/{topic}/{topic}.md` with wiki-links to all its lessons
- Links for each lesson indexed at `docs/links/{lesson-name}.md`
- Links for each math doc indexed at `docs/links/math-{concept-name}.md`

## Blueprint Workflow

Templates follow the naming convention `.{command-name}.md`:
- `templates/.new-lesson.md` → copy to `lesson-blueprints/{topic}.md`
- `templates/.math-logic.md` → copy to `math-blueprints/{concept-name}.md`

Never edit files in `templates/` directly — always copy first.

## Commands (remove this and use skills)

- `/new-lesson` — reads from `lesson-blueprints/`, creates lesson doc, updates topic index, generates links index. Never touches `docs/math/`.
- `/math-logic` — reads from `math-blueprints/`, creates math doc with LaTeX steps, visual helpers, and links index. Never touches `docs/{topic}/lessons/`.

## Math Explanation Style

When generating math docs, always:
- Use LaTeX: `$inline$` and `$$block$$`
- Write every step on its own line, every `=` on a new line
- Never skip steps or write "it's easy to see that..."
- Build from the user's own attempt at understanding if provided
- Include GeoGebra/Desmos URL with params for geometry/matrix concepts
- Include ShaderToy link for shader-related concepts
- Include 3Blue1Brown link where a relevant video exists

## Link Convention

- All internal links inside `docs/` use Obsidian wiki-links: `[[lesson-name]]`
- Topic index files include a note that links only work in Obsidian
- External links are categorized as: `Docs`, `Examples`, `Tools`, `Articles`, `Videos`, `Courses & Talks`, `Repos`, `Other`
- User-provided links come from `## My Links` in lesson blueprints
- Claude-suggested links are marked with `🤖 suggested`
- Outdated link alternatives are flagged in `## Revisit`, never silently replaced
- Once a month, do a manual review or ask Claude Code to scan `docs/links/` for broken links

## Conventions

- Each experiment gets its own folder inside the relevant app
- Own variations preferred over reproducing course material exactly
- When something is outdated from course material, note it in the relevant doc
- Never edit `templates/` files directly, always copy first

## Rules

- Never edit files in `templates/` directly — copy to the relevant blueprints folder first
- Never install npm or yarn, only pnpm
- Do not create `packages/` entries speculatively — only when shared code naturally emerges
- `/new-lesson` must never create or modify files in `docs/math/`
- `/math-logic` must never create or modify files in `docs/{topic}/lessons/`