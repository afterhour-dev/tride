# Shader Language - Intro

We are exploring GLSL here for the first time.
Exploring Transformation pipeline. 

## Namera / Intent

Getting familiar with GLSL.
Also exploring Transformation pipeline in order to understand things better.

## Šta treba objasniti u detalje

- What is GLSL, OpenGL Shading language?
  - Imperative
  - C style
  - strongly typed


- Main types
  - float
  - int
  - bool

- Vector types
  - vec2
  - vec3
  - vec4
- mat (matrix types) corresponds to 2/3/4-dimensional vectors
  - mat2 -  2 by 2 matrix
  - mat3 - 3x3
  - mat4 - 4x4

- Common mathematical operations
  - +
  - -
  - *
  - /
  - =
  - +=
  - -=
  - *=
  - /=
  
  - Are all of these mentioned component-wise? Or it depends from operands? For example multiplying matrix by vector has matrix multiplication rules, I assume?

- I think I found out that matrix multiplication or vector multiplication isn't going to be comonent wise. Or multiplication matrix by vector isn't going to be component wise. Which makes sense.

- will vector be considered as n by 1 matrix when doing multiplicatio nwith matrix

- Does order matters when we are multiplying matrix by vector

- Type qualifiers
  - varying
  - uniform

 - pattern: `<type qualifier> <data type> <name>`


- in files I named `/src/shaders/shader<1,2,3>.vert` there are also comments I left for you should use to explain stuff

- Transformation Pipeline
  - How does a model get onto the screen

## Šta samo ukratko pomenuti

- How did we load our fragment and vertex shaders.
- Are there any other ways besides using vite plugin
- We are using here glesl, meaning we are not using WebGPU Rendrer
- I want to learn good glsl before stepping into TSL


## Gotchas / Stvari koje lako zeznem

- {stvar 1 — šta je zbunjujuće ili lako pogrešiti}
- {stvar 2}

## Za revisit (vratiti se kasnije)

- {stvar koju treba dodatno uvežbati ili produbiti}

## Concerns / Nisam siguran za

- {bilo šta nejasno ili sumnjivo u pristupu}

## Korisni linkovi

- {url} — {kratak razlog zašto je koristan}

## Napomena o komentarima u kodu

Komentari u `src/` su deo dokumentacije procesa — koristi ih da označiš:
- `// EXPLAIN:` — nešto što docmaker treba detaljno da objasni
- `// GOTCHA:` — lako mesto za grešku
- `// REVISIT:` — nešto što treba ponovo vežbati/produbiti
- `// TODO:` / `// NOTE:` — ostale napomene

---
*Ovaj README čita docmaker skill radi konteksta pre generisanja lekcije — popuni sekcije koje su ti relevantne, ostale slobodno izbriši ili ostavi prazne.*
