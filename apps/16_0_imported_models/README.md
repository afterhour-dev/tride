# Imported models - intro

In this app we import models to learn how to import models and all other related things.

## Namera / Intent

This app is made to a project where we explore how to import models and all other related useful things. For example we need to know what is right format, right data etc.

## Šta treba objasniti u detalje

- to create complex shapes, we better use a dedicated 3D software (blender, maya, cinema4D...), but in this lesson we will use already made models

- formats
  - There is many 3D model formats, each one responding to a problem (<https://en.wikipedia.org/wiki/List_of_file_formats#3D_graphics>):
    - What data
    - Weight
    - Compression
    - Compatibility
    - Copyright
    - etc.
  - There is different criteria
    - Dedicated to one software
    - Very light but might lack specific data
    - Almost all data but are heavy
    - Open source
    - Not open source
    - Binary
    - ASCII
    - etc.
  - you can even create your own format
  - Popular formats
    - OBJ
    - FBX
    - STL
    - PLZ
    - COLLADA
    - 3DS
    - GLTF
  - one format is becoming a standard and should cover most of our needs and that is GLTF, but be open to others depending on your needs

- GLTF or GL Transmission Format
  - Made by the Khronos Group (OpenGL, WebGL, Vulkan, Collada and with many members like AMD / ATI, Nvidia, id Software, Google, Nintendo etc.)
  - Very popular since few years
  - Supports different sets of data like geometries, materials, cameras, lights, scene graph, animations, skeletons, morphing, etc.
  - Various formats like json, binary, embed textures
  - Becoming the standard when it comes to real-time and most 3D softwares, game engines, and binaries support it
  - you don't need to use GLTF in all cases; question the data you need, the weight of the file, how much time to decompressit, etc.

- Find a model
  - gltf team provides various models for testing: <https://github.com/KhronosGroup/glTF-Sample-Models>: **You need to clone or download repository and take the files you need**
  - we cloned repo and copied model 2.0/Duck to our project

- Eeach of gltf format has advantage in relation to other
- be careful, your OS might hide the extension of some of these files. Use your code editor. (I don't think I have any problems with this on fedora)

- GLTF formats (Yes Gltf can have different formats) (open /public/models/Duck and you will see 4 main formats)
  - glTF
    - the default format
    - multiple files
    - Duck.gltf is a JSON that contains cameras, lights, scenes, materials, objects transformations, but no geometries
    - Duck0.bin is the binary that usaully contains data like the geometries (vertices positions, UV coordinates, normals, colors, etc.)
    - DuckCM.png is the texture
    - We load the Duck.gltf file and the other files should load automatically
  - glTF-Binary
    - Only one file (Duck.glb)
    - Contains all the data we talked about
    - Binary
    - Usually lighter
    - Easier to load because only one file
    - Hard to alter its data
  - glTF-Draco
    - like the glTF default format, but the buffer data is compressed using the Draco agorithm
    - Much lighter
  - glTF-Embedded
    - Only one file (Duck.gltf)
    - JSON
    - Heavier

- Choosing right gltf format
  - it's a matter of how you want to handle the assets
  - if you want to be able to alter files, you better go with glTF-default
  - loading multiple files can be faster
  - if having one file is better for you, you better go for glTF-Binary
  - anyway, you must decide if you want to use Draco compression or not (We will tako about Draco later in other lesson)

- are models using pbr materials and therefore we need lights? Explain more about pbr (is that physical based rndering?)
  - so in our setup we have directional and ambient light

## Šta samo ukratko pomenuti

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
