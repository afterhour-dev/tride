# MeshStandardMaterial - Part two

Continuing with About MeshStandardMaterial

## Namera / Intent

Continuing Learnig about MeshStandardMaterial

And examining it with debugui

also we are putting environment map for this lesson.
Downloaded  2k environment map:
<https://polyhaven.com/a/urban_alley_01>

## Šta treba objasniti u detalje

- physically based
- requires light
- supports lights but with more relistic algorith and better parameters like roughness and metalness
- uses physical based renderin principles like in lesson about textures, roughness metalness and things liek that
- called "standard" because PBR - physically based rendering became standard in many softwares, engines and libraries
- we get realistic output with realistic parameters, and similar result regardless of the technology you are using
- it will look similatr to the blender for example, not the same because blender has things like raytracing for example
- looks realitic

- dakle ovde po prvi put koristim environment map
- koristim`HDRLoader` umesto deprecated `RGBELoader`

- ono za sta nisam siguran ali sam nesto procitao jeste da odredjene stvar itrba raditi pre poziva `await renderer.init()`, a neke posle, i jedna od tih stvari je mozda (nisam siguran)
  ```ts
  scene.environment = hdrTexture;
	scene.background = hdrTexture;
  ```
  U ovo dakle nisam siguran. U svim proslim app-ovima verujem da redosled bilo cega nije prouzrokovao bilo kakvu gresku, ali nasao sam savet da teba tako da cu to uraditi u mom app-u a ti reci da li je to bilo bitno i da li sam pogresio

- Isto tako, negde sam procitao da bi bitrebalo da koristim `renderer.setAnimationLoop` umesto `requestAnimationFrame`, tako da cu to koristiti po prvi put u ivom primeru (za ovu temu cu da napravim poseban app i lesson, a ti mi samo reci da li sam napravio neku gresku pri koriscenju)

- besids lighting of environment map, does ambient and point light still bring light when added to the scene
- env map is also compatibile with phong and lambert materials we aalready wrote a lessons about (is it because they support light?)