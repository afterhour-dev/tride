# Exporting model from blender

In this app I want to explain how to export model from blender, and import it in this app the same way we did in some of the previous apps.

I will be exporting model I build myself, it is a gameboy-like console.

## Namera / Intent

Learning all the settings we need to know and set when we are exporting model from blender in order to have as close look of our rendered model as one we build in the blender.

## Šta treba objasniti u detalje

- in my case I'm on version of blender 5.2, and I'm following tutorial for older version of blender so I need to know if anything is changed in case of how we export the model
- I selected all objects from one collection where all my meshes are (I assume if I select only parent, the rest of them will not be exported)
- we go to File -> Export -> glTF 2.0 and choose the all export settings we need
  - I choosen gltf Separate format (.gltf + .bin + textures) (I assumed this one since I have textures on my model)
  - `Include` section
    - checked limit to Selected objects
  - `Transform`
    - checked `+Y Up`
  - `Geometry`
    - Data -> Mesh -> Apply Modifiers needs to be checked (also UV, Normals need to be checked)
      - I assume we need UV checked because we have texture
      - I assume we need Normals because light wouldn't work properly
      - there are other options I didn't check (Tangents, Attributes, Loose Edges, Loose Points, Shared Accessors), you can explain if I need any of those but I didn't checked them
  - `Vertex Colors`
    - For `Use Vertex Color` I selected Material value
    - For checkboxes `Export All Vertex Colors` and `Export Active Vertex Color When No Material` (I left them checked and you tell me did I make a mistake)
  - `Material`
    - I left all defaults here (Materials -> selected Export value from dropdown) (Images -> Automatic format, there were more like jpeg and WebP), (Image quality was 75 by default and I didn't change the value), Unused images are not checked by default so I also left it like that
  - `Shape keys` were checked and I unchecked them (did I make any mistake there)
  - `Armature` I didn't touch it had Use Rest Position checked, I assume this is related to rigging and my model don't have any bones
  - `Skinning` is checked by default and I unchecked it, I assume this also has something to do with bones which my project don't have so I left it checked only in fear that I don't mess something up
  - `Lighting` -> Lighting Mode -> left it on default Standard; no idea if I should pick this I left it picked not to mess something up; I only know that we don't need any lights from the blender since we will use lights in threejs
  - `DRACO compression`, I chcked that because I'm going to use it; but I didn't tweak any other compression values in numbers under this option assuminfg defaults are ok
    - If we selected this draco option does it means our file will be draco compressed and in order to load it we need draco loader and if we just use gltf loadef , it wont load?
  - `Animation` I left this checked; My model plays video on emission material; I assume this wouldn't work in threejs but I left it checked anyway just for curiousity

## Šta samo ukratko pomenuti

- {koncept koji nije fokus lekcije, ali se pojavljuje u kodu}

## Gotchas / Stvari koje lako zeznem

- {stvar 1 — šta je zbunjujuće ili lako pogrešiti}
- {stvar 2}

## Za revisit (vratiti se kasnije)

- {stvar koju treba dodatno uvežbati ili produbiti}

