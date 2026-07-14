---
name: docmaker
description: Creates lesson doc from a completed Three.js, WebGL, WebGPU, Shader application, or exercise. Use when the user complets an exercise or an app and wants it documented.
argument-hint: [app-path]
disable-model-invocation: true
allowed-tools: Read, Write, Glob
context: fork
---

# Make documentation for an app

The app bing documented is: $ARGUMENTS

If no app path was given above, ask the user which folder inside `apps/`
this lesson concerns, and wait for their answer before continuing.

## Files in this app

!`ls apps/$ARGUMENTS`

Read through all files in `apps/$ARGUMENTS` to understand what was built.
Read all the comments because in comments user will specify what does need to be explained, and in what level of deatails.
Then generate the lesson doc as specified by instructions below.

## Tags

Use the **AskUserQuestion** tool to confirm which tags apply to this lesson
before writing the file. Do not guess or infer tags from the code yourself —
always ask.

- header: "Tags"
- question: "Which tags apply to this lesson?"
- multiSelect: true
- options:
  - "geometry" — buffer geometries, custom geometry
  - "materials"
  - "shaders"
  - "performance"
  - "math"

<!-- Alternativa ako alat ne funkcionise dobro -->

Ask the user, in plain text, which tags apply to this lesson
(examples: geometry, materials, shaders, performance, math).
Then STOP — do not continue to the next step, do not write any file,
until the user responds with their answer in their next message.