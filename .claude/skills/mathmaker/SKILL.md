---
name: mathmaker
description: Creates obsidian flavoured doc from a completed Three.js, WebGL, WebGPU, Shader application or a game, or other kind of exercise, which is strictly related to complecated math or physics problem. Use when the user completes an app or experiment and wants it documented.
argument-hint: [app-folder-name]
disable-model-invocation: true
allowed-tools: Read, Write, Glob, AskUserQuestion
---

# This skill is making math and physics documentation for an application




## Math Explanation Style

When generating math docs, always:
- Use LaTeX: `$inline$` and `$$block$$`
- Write every step on its own line, every `=` on a new line
- Never skip steps or write "it's easy to see that..."
- Build from the user's own attempt at understanding if provided
- Include GeoGebra/Desmos URL with params for geometry/matrix concepts
- Include ShaderToy link for shader-related concepts
- Include 3Blue1Brown link where a relevant video exists
