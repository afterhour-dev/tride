# MeshStandardMaterial - Part two

Continuing with MeshStandardMaterial.

## Namera / Intent

Continuing Learnig about MeshStandardMaterial.

Examining it with debugui.

Also we are putting environment map for this lesson.
Downloaded  2k environment map:
<https://polyhaven.com/a/urban_alley_01>

We will alo continue to deal and tweak same material in next lesson. This lesson is only env map oriented.

## Šta treba objasniti u detalje

- dakle ovde po prvi put koristim environment map

- koristim`HDRLoader` umesto deprecated `RGBELoader`

- ono za sta nisam siguran ali sam nesto procitao jeste da odredjene stvar itrba raditi pre poziva `await renderer.init()`, a neke posle, i jedna od tih stvari je mozda (nisam siguran)
  ```ts
  scene.environment = hdrTexture;
	scene.background = hdrTexture;
  ```
  U ovo dakle nisam siguran. U svim proslim app-ovima verujem da redosled bilo cega nije prouzrokovao bilo kakvu gresku, ali nasao sam savet da teba tako da cu to uraditi u mom app-u a ti reci da li je to bilo bitno i da li sam pogresio

- besids lighting of environment map, does ambient and point light still bring light when added to the scene

- env map is also compatibile with phong and lambert materials we already wrote a lessons about (is it because they support light?)