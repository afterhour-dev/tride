# Baking Shadows and baking shadows alternative

Learning about shadow baking and what is alternative to get more dynamic shadow stuff.

## Namera / Intent

Razumevanje baking shadows i alternative.

## Šta treba objasniti u detalje

- Baking shadows
  - so this should be similar to baking lights?
  - A good alternative to Three.js shadows is baked shadows
  - We integrate shadows in textures that we apply on materials
  - must disable shadowMap: `renderer.shadowMap.enabled = false` (we are deactivating all current shadows with this)
  - you need to bake shadow in blender; we have one available ib public/textures folder
  - we must load it with texture loader
  - we must then used mesh basic material to set `map` on it, and this material we will use as a material for floorMesh (a plane mesh that has role of a floor in our app) because as we know shadows are on the floor in our app, we don't have any walls or similar thing that we set to receive shadows (but I guess since we are baking, casting and receiving shadows don't have any role in this app)
  - as we know unfortunately shadow will not be dynamic, (move sphere in gui and nothing will happen since shadow is baked in floor plane)
  - so depending what you want, if you don't want dynamic project this is fine
- Alternative to baking shadows
  - we can also use a more simpler baked shadow and move it so it stays under the sphere
  - we also hade that shadow in textures folder
  - so idea is when we change position of the sphere by x and z the shadow will move with the sphere, but when position changed by y (when sphere goes up) we will reduce alpha of the shadow plane, and when sphere goes down we will reduce the alpha of the shadow
  - center of texture is white circle and outer part is black, inner part will be visible shadow, nd black will be invisible
  - we are going to animate the sphere and new shadow plane

- which technique to use
  - finding the right solution to handle shadows is up to you
  - it depends on the project, the performances and the techiques you know
  - you can also combine them
  