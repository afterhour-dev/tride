# Text

Learning about `TextGeometry` (former TextBufferGeometry), and font format we are using is called **typeface**

## Namera / Intent

## Šta treba objasniti u detalje

- what is typeface
- if you are using a typeface you've download you must have the right to use it
- how to get a typeface font
  - we can also use fonts provided by Three.js from `node_modules/three/examples/fonts` folder; and there is two ways of using them (I think this isn't working anymore? I was unable to find fonts there inside node_modules):
    - copy them from node modules into the /public folder
      - take the `.typeface.json` file of the text together with `LICENCE.txt` and compy them to `/public/fonts/`
    - importing them:
      - example:
        ```ts
        import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json"
        ```
  - We can download fonts from threejs github repo here: <https://github.com/mrdoob/three.js/tree/dev/examples/fonts>
    - take the `.typeface.json` file of the text together with `LICENCE` and compy them to `/public/fonts/`
  - we can download google font and convert it to typeface with converter tool: <https://gero3.github.io/facetype.js/>; which I decided to use in this lesson (Make sure to include `LICENCE.txt` and make sure that licence is SIL Open Font License (OFL) and not `Apache License 2.0`)

- how to load the font: We use `FontLoader`

- how to use TextGeometry
  
- creating a text geometry is long and hard for computer
- avoid doing it too many times and keep the geometry as low poly as possible by reducing curveSegments and bevelSegments

- centering the text to the center of the scene (the complicated long way, in next lesson we are going to use center method instead of this complicated way, idea is to show complicated way first)
  - using bounding which is information associated with the geometry that tells what space is taken by geometry (we are going to use the bounding mesures to recenter the geometry)
    - space can be box (`geometry.computeBoundingBox`)
    - space can be sphere (`geometry.computeBoundingSphere`)
    - why spahere or box? It helps THREE.js calculate if the object is on screen: frustum culling (what is frustum culling?)
    - by default Three.js is using sphere bounding, and we will use box bounding
    - instead of moving mesh we will use `translate` method to only move geometry
  