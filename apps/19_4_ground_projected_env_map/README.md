# Environment maps - Ground projected environment map

App used for Exploring environment maps.

In terms of meshes and models in this app we are loading Flight Helmet model: <https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/FlightHelmet> because it looks grat and realistic, but also heavy; but also great for testing environment maps; we also have white torus knot, also nice for testing environment maps; and also loded draco compewssed model I built in blender just to see how it's going to look with different env map settings; and we have torus knot which we will change metalness and roughness and observe how environment map lighting affects it.

All environment map settings we explored from previous lessons are also here.

## Namera / Intent

To gain knowledge about ground projected environment map.

## Šta treba objasniti u detalje

- When using an environment map as a background, the objects look like they are flying; we could create plane bellow and try to make it look and feel like it's part of the environment map, but there is an even better solution, and that is **Ground Projected Skybox**

- we will use hdr equirectangular map, but only to set the `environment` (not `background`), so only for the lighting

- we set `environmentIntensity` to 1

- we need to use addon `GroundedSkybox` which replaced earlier `GroundProjectedSkybox` which had issues

- is floor alwys (0,0,0) of the scene?

- We can encounter issues that is related to the radius of the skybox and camera far value, in my case initialy I have set radius to be 100 which was the same value as my camera far value; this caused me seeing parts of the black orb as I was zooming; so solution is that our far value of camera be comfortably bigger, maybe 3 times bigger than skybox radius (is this to much?); am I right?; you can get more into it and explain the bug and it's solution and add more info if needed, or if you have better solution?

- We could also clamp OrbitControls so the camera can never dolly outside the sphere. We can do this by setting MaxDistance of orbit controls like this:
  ```ts
	orbitControls.maxDistance = skyboxRadius * 0.9;
  ```
  so max distance as ve zoom wll be radius minus 1/10 of the radius; did I understood correctly; but this will only affect zooming, because still as you pan around you can get out from the orb 


- is there any specific relation in terms of values of radius and height that we should pay attention, for example how much height should be smaller than radius, or we tweak these values to find the look that is acceptable to us

- found some info that this skybox trick won't work always. especially if there are objects near the center of the environment map; is tha true?