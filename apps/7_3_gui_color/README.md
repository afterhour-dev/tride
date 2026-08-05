# lil-gui color type and its problem

lil-guit `addColor` has one quirk we are going to fix in here.

## Namera / Intent

Namera je da se objasni addColor i sve sto je korisno u vezi njega, kao i built in quirk sto se tice boje i materijala u threejs-u, koji mozemo prevazici, konkretno koriscenjem onChange handlera

## Šta treba objasniti u detalje

- color property on material is THREE.Color instance

- Kopiranje color code-a iz gui-ja i njegovo koriscenje u code-u, kako bi ga zadal iza isti materiajal, ne daje isti rezultat
  
- Three.js applies some color management in order to optimise the rendering. The color value that is being displayed in the tweak ins't the same value as the one being used internally (Why is this the case?)

- dve solucije za ovo
  - retreiving modified color with getHexString() (explain this) (in onChange handler)
  - deal with non-modified color which means we are going to deal with the color before it gets modified by Three.js. We need to save the color somewhere outside of Three.js . We are going to create an object whose purpose is to hold properties

