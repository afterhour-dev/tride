# Environment maps - HDRI Equirectangular environment map

App used for Exploring environment maps.

In terms of meshes and models in this app we are loading Flight Helmet model: <https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/FlightHelmet> because it looks grat and realistic, but also heavy; but also great for testing environment maps; we also have white torus knot, also nice for testing environment maps; and also loded draco compewssed model I built in blender just to see how it's going to look with different env map settings; we also have floor (will be hidden and probably not going to use it at all but it is there) and we have torus knot which we will change metalness and roughness and observe how environment map lighting affects it.

All environment map settings we explored from previous lesson are also there.

## Namera / Intent

To gain knowledge about environment map and it's settings by using HDRI Equirectangular environment map.

## Šta treba objasniti u detalje

- extension is .hdr which means "High Dynamic Range", and we often say "HDRI", where "I" stands for "Image"
  - Color values stored have much higher range than a traditional image (ideal to store luminosity data)
  - Equirectangular
    - this means that is only one file (unlike cube texture map), only one picture containing kind of 360deg view of surrounding
    - Also see the sky and the floor (stretched)

- What loader is suggested to be used? HDRLoader or RGBELoader? I used HDRLoader in this app

## Šta samo ukratko pomenuti

- HDRI environment map doesn't have to be equirectangular, but it's often the case