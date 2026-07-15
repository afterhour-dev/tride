# Триде

pnpm monorepo for learning 3D and experimentation with Three.js, R3F, WebGL, WebGPU, game development on the web using Three.js, Blender and other topics related to 3D.

## Role of Claude Code in This Project

Claude Code here is used for **documentation and learning support only**:
generating lesson docs, math explanations, and links indices from completed exercises. It should not write, refactor, or scaffold app code inside `apps/` or `experiments/` unless explicitly asked — app code is written by hand, by design, for practice and learning. Interpretation and documenting from mentioned apps and experiments is most important thing in this monorepo.

## Structure

- `apps/` — standalone apps
- `experiments/` — more experimental apps (things that need to be studied more and thir development repeated)
- `docs/` — Obsidian vault, plain markdown, maybe a documentation web app in the future
- `packages/` — shared code when it naturally emerges
- `scripts/` - sh scripts used by npm scripts in root level of the monorepo
- `templates` - templates for some files used inside applications
- `configs` - typescript, and other linting and formatting configurations reused across the apps and experiments

## Current Apps

<!-- - `apps/<>/` — Three.js exercises -->

none so far

## Current Experiments

<!-- - `experiments/<>/` -->

none so far

## Tech

- Apps and experiments use Vite + vanilla Three.js or Vite + R3F depending on the experiment
- TypeScript throughout
- pnpm for everything, no npm or yarn

## Docs

- Notes live in `docs/` obsidian vault as markdown files
- Lesson frontmatter fields: `title`, `topic`, `date`, `tags`, `difficulty`, `app_path`
- Math lessons frontmatter fields: `title`, `topic`, `date`, `tags`, `difficulty`, `app_path`
- Lessons organized as `docs/glavno/{topic}/lessons/{lesson_name}.md`
- Each lesson topic has an index file at `docs/glavno/{topic}/{topic}.md` with wiki-links to all its lessons

<!-- rethink this -->
- Math docs organized as `docs/math/{topic}/{concept_name}.md` and `docs/math/{topic}.md`

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
- Unlike users links, llm-suggested links are marked with `🤖 suggested`
- Outdated link alternatives are flagged in `## Revisit`, never silently replaced

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

# Skills

<!-- specify your skills , and make new ones-->

- Once a month, do a manual review or ask Claude Code to scan `docs/links/` for broken links