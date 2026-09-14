# Environment maps - other tools and formats

App used for Exploring environment maps.

In terms of meshes and models in this app we are loading Flight Helmet model: <https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/FlightHelmet> because it looks grat and realistic, but also heavy; but also great for testing environment maps; we also have white torus knot, also nice for testing environment maps; and also loded draco compewssed model I built in blender just to see how it's going to look with different env map settings; we also have floor (will be hidden and probably not going to use it at all but it is there) and we have torus knot which we will change metalness and roughness and observe how environment map lighting affects it.

All environment map settings we explored from previous lessons are also there.

Since I don't want to subscribe and spend money on AI tools I used some free env maps available to me for free but I didn't write prompts for them.

I also just prompted some tools to see how they work but I didn't download anything

## Namera / Intent

To gain knowledge about other formats of environment map, besides .hdr and cube texture map; also to find good AI tools that are good choice for generating environment maps.

## Šta treba objasniti u detalje

- Other formats
  - Another env map we are not going to load is in .exr format; can store layers and has an alpha channel (What does this mean and is it better from .hdr?); we need different loader for this one. (`EXRLoader`); you still use same mapping (`THREE.EquirectangularReflectionMapping`)
  - Another format is jpeg image when we have low resolution and low LDR (Explain what does this mean?) (We use TextureLoader for this?)
  - you can provide short code samples how we deal with mentioned format

- there is more way to generate environment map
  - AI generated environment map using NVIDIA Canvas (software is in beta and only works on windows I don't use so we can't use this one); what is your honest opinion, I see that this one is in beta pretty long so are people using this at all? Or is there a free one alternative, online or linux? This one produces .exr format of environment map
  - AI generated environment map using Skybox Lab by BlockadeLabs, also paid service (don't want to pay it)
  - you can tell me is there any free modern good tools to do this, online or not; if not free, the ones that don't have subscription but pay per token
