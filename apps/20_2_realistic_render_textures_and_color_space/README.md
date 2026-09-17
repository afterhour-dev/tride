# Realistic render - Textures and Color Space

Continuation of previous lesson where we define some settings to have more relistic render; but now we are adding realism to it by dealing with textures and color space.

## Namera / Intent

Exploring settings we can use to achive realistic render by dealing with textures and color space.

## Šta treba objasniti u detalje

- We are going to add a floor and a back wall and add textures to them

- We are adding textures from: <https://polyhaven.com/textures>; and only three textures; when downloading select specific textures you want, and this time you only need three checkboxx (`AO/Rough/Metal`, `Diffuse`, `Normal(GL)`), and for formats you can select `png` for normal and `jpg` for other two (Why we pick png for normal map?).
- And we are using only three textures because this is the well established convention; Yeah, that's a very common convention — often called the **"3-texture PBR setup"**:
  1. **Diffuse/Albedo** — base color
  2. **Normal** — surface bump detail
     - For three.js: pick Normal (GL).
      The difference is which way the green channel encodes the Y-axis of the normal map:
       - GL (OpenGL convention): Y+ (green channel) points up. This is what OpenGL, three.js, Blender, and most Unix-y/cross-platform tools expect.
       - DX (DirectX convention): Y+ (green channel) points down — it's vertically flipped relative to GL. This is what Unity and Unreal Engine (and DirectX-based pipelines generally) expect by default.
  3. **ARM** (AO + Roughness + Metal packed) — everything else needed for lighting response (We set this one for aoMap, roughnessMap, and metalnessMap)

  - **Why this trio and not more:**
    - **Displacement is skipped** because it's expensive to use properly — it either requires actual geometry tessellation (subdividing your mesh a ton) or parallax occlusion mapping (a shader trick), both of which add real complexity/cost. For a lot of real-time work (games, three.js scenes), people just skip it since the normal map already fakes enough surface detail for the eye.
    - **AO isn't loaded separately** because it's already inside the ARM texture's red channel — loading it standalone too would just be redundant.
    - **Roughness isn't loaded separately** for the same reason — it's the green channel of ARM.
    - So that is performance-conscious thing: 3 texture fetches instead of potentially 6 (diffuse, AO, roughness, metal, normal, displacement), with only a minor loss in surface realism from skipping displacement.
    - **For your brick wall / wood floor specifically**, this is actually a great fit:
      - Brick and wood are non-metal, so the blue (metalness) channel in ARM will just be ~0 anyway — no loss.
      - Displacement *would* help brick mortar lines or wood grain read as more 3D under grazing light, but unless you're doing close-up hero shots or already using parallax mapping in your shader, it's not worth the cost.
    - One gotcha: `metalness`/`roughness` scalar properties act as *multipliers* on the map values, so leave them at `1` when you're supplying a map — otherwise you're scaling down what the texture says.
- I selected 1K resolution; is that enough?

- After loading them and setting them to materials wall and floor textures loo kofly white and this is due the "color space"
  - Color space is a way to optimise how colors are being stored according to the human eye sensitivity; Mostly concerns textures that are supposed to be seen (in our case crackedConcretAlbedoTexture)

- Why we don't need to change color space for the models
  - This information was already set inside GLTF file and Three.js knew what color space to use on the texture (Is this true? Alsso is this the case for the model I built in blender (a gaming console)? Since I didn't set anything related to specific color space? Or that is set by blender by default?)

- I have one problem; this is how it goes:
  - Couldn't see the shadown on the wall mesh only when I set normal texture for the material of the wall
    - So shadows worked when I had no textures on it or without normal texture; but when I set normal texture, shadows were invisible
    - Another thing, I set the same material for the wall and for the floor (same maps on both of them, including normal map), and texture still didn't work for the wall. So why is that? Does verticality of the wall ans some kind of influence of directional light (or even light from environment map; but I know that environment map isn't affecting shadows, it can't even produce shadows? Am I right?)?
    - this was very peculiar since I followed tutorial and also used their material at some point, and also it didn't work but they were using webGL? Thet were also using different env map if that matters, but I don't think it does?
  - Only solution I can get is setting `normalScale` like this:
    ```ts
	  wallMaterial.normalScale = new THREE.Vector2(0.2, 0.2);
    ```
    but it didn't work
  - I noticed more peculiar things; as I move target position of light or move positio of light, on the floor, for some reason sharp ilumination happens, and then shadows work, but when I move it to other spot all of a sudden it darkens and shadow don't work. That sweet spot I can't find for the wall at all, only when I eotate wal and it becomes horizontal it happens
  - So after some research I found out that this could be the problem because of numerous things, shadow map resolution that is too small, but even I'm setting it back to 1024x1024 instead 512x512, it didn't work; also that this could be the problem of angle of the direction of my directional light, I tried changing that and it didn't work; near and far of the shadow camera, changing that didn't work; trying to change bias or normalBias also didn't work; Tried many things, moving and rotating entire group with wall floor and models, and nothing works; So this is uresolved problem for me

## Šta samo ukratko pomenuti

- If you do want to add displacement later for close-ups, you'd bring in the separate Displacement map and use `displacementMap` + `displacementScale`, but that needs a mesh with enough subdivided geometry to actually deform, so it's a bigger lift than just dropping in a texture.
