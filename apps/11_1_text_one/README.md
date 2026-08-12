# Text - lesson one

First lesson about `TextGeometry` (former TextBufferGeometry).

The font format we are using is called **typeface**.

## Namera / Intent

Learning about `TextGeometry`, loading fonts, choosing fonts.

## Šta treba objasniti u detalje

- what is typeface
- if you are using a typeface you've download you must have the rights to use it, a licence
- how to get a typeface font
  - we can use fonts provided by Three.js from `node_modules/three/examples/fonts` folder; and there is two ways of using them (I think this isn't working anymore? I was unable to find fonts, there inside node_modules on mentioned location):
    - copy them from node modules into the /public folder
      - take the `.typeface.json` file of the text together with `LICENCE.txt` and compy them to `/public/fonts/`
    - importing them:
      - example:
        ```ts
        import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json"
        ```
  - Unlike previous one this approach works; We can download fonts directly from threejs github repo here: <https://github.com/mrdoob/three.js/tree/dev/examples/fonts>
    - take the `.typeface.json` file of the text, together with `LICENCE.txt` and copy them to our `/public/fonts/`
  - Also this approach works which I decided to do in my app; we can download google font and convert it to typeface with converter tool: <https://gero3.github.io/facetype.js/>; which I decided to use in this lesson (Make sure to include `LICENCE.txt` or `OFL.txt` and make sure that licence is SIL Open Font License (OFL) and not `Apache License 2.0`)
    - but this wasn't ideal also. I downloaded and converted Bitter font in order to have avalable cyrilic letters which mentioned font supports. When I rendered text, cyrilic `в` had bottom hole filled for example (Any idea how can we make sure this doesn't happen?)

- how to load the font: We use `FontLoader` with loadAsync function

- how to use TextGeometry
  
- creating a text geometry is long and hard for computer

- avoid doing it too many times and keep the geometry as low poly as possible by reducing curveSegments and bevelSegments

## Šta samo ukratko pomenuti

- in next lesson we will learn how to center text so it can be centered in the center of the scene; also we won't move mesh we will translate geometry