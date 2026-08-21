# Project A - part four - shadows

First project built to practice some of the learned things from previous lessons.

This project is continuation of a_project-3

## Namera / Intent

Practicing three.js by using "primitives" as geometries and by using textures and using lights and shadow knowledge from previous lessons.

Major thing in this current project is that we are adding couple of lights (4 point lights), we are allowing them to move with controlled randomness as I love to call it, and we are enabling shadows, drop shadows to be precise.

## Šta treba objasniti u detalje

- since house is made from bunch of meshes (walls, roof, planks, door) it is only appropriate that walls cast theshadow because if every one of them are casting we would have wired thing, I assume our house in some well thought example should be made of one mesh and only then casting shadow would make sense, for example if we built house in a blender and imported it here shadow would be much better. So for this example walls casting shadows together with bushes and toombstones is more than enough.
- besides floor, toombstones also should receiveShadow, it would look nicer
- after some tweaking with gui I decided to increase directional or moon light a little
- after tweaking gui tweaks for directional light shadow with help of directional light shadow helper, i found the right values for all the shadow setting in order for our directional light to cover entire scene and to look good enough
- we also defined some shadow related settings to all point lights we have in the scene; we did it without helpers but in real world project we would provide helpers
- we also changed algorythm for shadom map to be PCFSoftShadowMap
  