# Exporting model from blender

In this app I want to explain how to export model from blender, and import it in this app the same way we did in some of the previous apps.

I will be exporting model I build myself, it is a gameboy-like console.

## Namera / Intent

Learning all the settings we need to know and set when we are exporting model from blender in order to have as close look of our rendered model as one we build in the blender.

## Šta treba objasniti u detalje

- in my case I'm on version of blender 5.2, and I'm following tutorial for older version of blender so I need to know if anything is changed in case of how we export the model
- I selected all objects from one collection where all my meshes are (I assume if I select only parent, the rest of them will not be exported)
- we go to File -> Export -> glTF 2.0 and choose the all export settings we need
  - I choosen gltf Separate format (.gltf + .bin + textures) (I assumed this one since I have textures on my model); I also specified relative path for textures (called it textures, I assume there all textures I used when building model will be placed); also picked to save file in here apps/18_0_blender_exporting_model/public/models/1_game_console
  - `Include` section
    - checked limit to Selected objects
  - `Transform`
    - checked `+Y Up`
  - `Geometry (Data -> Mesh)`
    - Data -> Mesh -> Apply Modifiers needs to be checked (also UV, Normals need to be checked)
      - I assume we need UV checked because we have texture
      - I assume we need Normals because light wouldn't work properly
      - there are other options I didn't check (Tangents, Attributes, Loose Edges, Loose Points, Shared Accessors), you can explain if I need any of those but I didn't checked them
  - `Vertex Colors`
    - For `Use Vertex Color` I selected Material value
    - For checkboxes `Export All Vertex Colors` and `Export Active Vertex Color When No Material` (I left them checked and you tell me did I make a mistake by leaving them checked)
  - `Material (Data -> Material)`
    - I left all defaults here (Materials -> selected Export value from dropdown) (Images -> Automatic format, there were more like jpeg and WebP), (Image quality was 75 by default and I didn't change the value), Unused textures & images are not checked by default so I also left it like that
  - `Shape keys` were checked and I unchecked them (did I make any mistake there)
  - `Armature` I didn't touch it had Use Rest Position checked, I assume this is related to rigging and my model don't have any bones; the option Use Rest Position is checked so I left it like that
  - `Skinning` is checked by default and I unchecked it, I assume this also has something to do with bones which my project don't have so I left it checked only in fear that I don't mess something up. Uncheking this grayed out and disabled all options under Armature
  - `Lighting` -> Lighting Mode -> left it on default Standard; no idea if I should pick this I left it picked not to mess something up; I only know that we don't need any lights from the blender since we will use lights in threejs; other values were Unitless and Raw(Deprecated)
  - `DRACO compression`, I chcked that because I'm going to use it; but I didn't tweak any other compression values in numbers under this option assuminfg defaults are ok
    - If we selected this draco option does it means our file will be draco compressed and in order to load it we need draco loader and if we just use gltf loadef , it wont load and we will get error?
  - `Animation` I left this unchecked; My model plays video on emission material; I assume this wouldn't work in threejs

- I had one problem when exporting, and that is I had double face by default when I added my model to the scene. After some research I figutred out that this is backface culling material problem, and that I need to go to Material property and to Settings -> Surface -> Backface Culling and check Camera, which should fix the double side problem (There are other options in this regard I also checked and that is Shadow, and Light Probe Volume was already checked. But that is not related to backface problem but my question is if did I make any mistake by cjecking these ones too)
