# Debug UI

Exploring and learning primarly about lil-gui.

This will be starting lesson with many aspects of lil-gui, but in next group of lessons I plan to divide all of stuff in searte projects for clarity.

## Namera / Intent

Ovaj app je tu da isprobam sve, ili vecinu korisnih stvari koje su moguce sa lil-gui, osim `addFolder` metode kojom cu se pozabaviti u nekoj od sledecih lekcija.

## Šta treba objasniti u detalje

- objasniti sve ove lil gui tipove: Range,Color,Text,Checkbox,Select,Button po na osob
- Handling colors. Nisam siguran ali negde je receno da je handling colors nesto teze jer tu ima jedan quirk
- color property on material is THREE.Color instance
- Kopiranje color code-a iz gui-ja i njegovo koriscenje u code-u, kako bi ga zadal iza isti materiajal, ne daje isti rezultat, pokazi kako ovo resiti
    - Three.js applies some color management in order to optimise the rendering. The color value that is being displayed in the tweak ins't the same value as the one being used internally (Why is this the case?)
      - dve solucije za ovo
        - retreiving modified color with getHexString() (explain this) (in onChange handler)
        - deal with non-modified color which means we are going to deal with the color before it gets modified by Three.js. We need to save the color somewhere outside of Three.js . We are going to create an object whose purpose is to hold properties
- explain why we can't tweak geometry like this, meaning whty we can't take geometry instance and just set changing the segments count or other stuff with gui:
```ts
gui.add(boxGeometry, "widthSegments").min(1).max(20).step(1)
```
Tell me if I'm wrong but I think geometry is created only once because of costs, and we tend to reuse it. So we need to create/destroy geometry on tweak value change.
  - Why we shouldn't use onChange in this case, I asume because CPU. So if range tweak is changed for example, that are a lot of geometries created/destroyed. So we use onFinishChange
