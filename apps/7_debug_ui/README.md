# Debug UI

Exploring and learning primarly about lil-gui.

## Namera / Intent

Ovaj app je tu da isprobam sve, ili vecinu korisnih stvari koje su moguce sa lil-gui

## Šta treba objasniti u detalje

- objasniti sve ove lil gui variajnte: Range,Color,Text,Checkbox,Select,Button po na osob
- Handling colors. Nisam siguran ali negde je receno da je handling colors nesto teze jer tu ima jedan quirk
- color property on material is THREE.Color instance
- Kopiranje color code-a iz gui-ja i njegovo koriscenje u code-u, kako bi ga zadal iza isti materiajal, ne daje isti rezultat, pokazi kako ovo resiti
    - Three.js applies some color management in order to optimise the rendering. The color value that is being displayed in the tweak ins't the same value as the one being used internally (Why is this the case?)
      - dve solucije za ovo
        - retreiving modified color with getHexString() (explain this) (in onChange handler)
        - deal with non-modified color which means we are going to deal with the color before it gets modified by Three.js. We need to save the color somewhere outside of Three.js . We are going to create an object whose purpose is to hold properties