# Environment maps - Cube texture environment map

App used for Exploring environment maps.

In terms of meshes and models in this app we are loading Flight Helmet model: <https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/FlightHelmet> because it looks grat and realistic, but also heavy; but also great for testing environment maps; we also have white torus knot, also nice for testing environment maps; and also loded draco compewssed model I built in blender just to see how it's going to look with different env map settings; we also have floor (will be hidden and probably not going to use it at all) and we have torus knot which we will change metalness and roughness and observe how environment map lighting affects it.

## Namera / Intent

To gain knowledge about cube texture environment maps.



## Šta treba objasniti u detalje

- Environment maps can be used as:
  - background
  - reflection
  - lighting

- We downloaded 4 environment maps in hdri format from: <https://polyhaven.com/hdris>
- We used this online tool to convert or extract 6 images: <https://matheowis.github.io/HDRI-to-CubeMap/> (if you know better tools you can suggest them to me)

- What we didn't use native threejs solution we would (this was done in old video games):
  - create a massive cube around the scene
  - set its face to be visible on the inside
  - apply the texture to it
- why we don't use massive cube we mentioned:
  - it would work and look ok, but would be very limited and only serve as a background
  - wouldn't do anything in terms of lighting

- to control environment map intesity we must do it per material basis, which is a bit anoying when we have loaded model, but we can traverse the model and set intensity on each material
  - `traverse` method is available on every Object3D and classes that inherit from it like: `Group`, `Mesh`, or even `Scene`

## Šta samo ukratko pomenuti

We dealt with cube map texture already in some previous lesson (when we were dealing with mesh standard material):
  - lesson:  `10.10.x_mesh-standard-material-cube-map`
  - app: `apps/10_10x_cube_map`
but here we wanted to tell more about it and also since this series of lessons, starting with number `19` is dealing with environment maps excusivly, it is good to have this app and lesson in this section, under mentioned number

- in mentioned previous lesson 10.10.x, we also covered how to apply an environment map to a `MeshStandardMaterial` using the `envMap` property; we did this with a sphere (but here we didn't do that on our torus knot, we used scene.environment)
