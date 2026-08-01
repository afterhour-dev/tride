# Debug UI paketi za Three.js projekte
 
## Najčešće korišćeni
 
### lil-gui
Direktan naslednik dat.GUI-ja, isti API (skoro drop-in replacement), aktivno održavan, lakši i modernizovan. Danas de facto preporuka za nove projekte — koristi ga i sam Three.js u svojim zvaničnim primerima, kao i Bruno Simon u "Three.js Journey" kursu.
 
- npm: https://www.npmjs.com/package/lil-gui
- GitHub: https://github.com/georgealways/lil-gui
- Sajt/demo: https://lil-gui.georgealways.com/

Different types of tweaks:
• Range - for numbers with minimum and maximum value
• Color - for colors with various formats
• Text - for simple texts
• Checkbox - for booleans (true or false)
• Select - for a choice from a list of values
• Button - to trigger functions

### dat.GUI
Dugo je bio de facto standard, i danas se vidi u ogromnom broju starijih tutorijala, primera i CodeSandbox/CodePen projekata. Malo je zapušten (Google ga više ne održava aktivno), ali je i dalje svuda prisutan zbog inercije.
 
- npm: https://www.npmjs.com/package/dat.gui
- GitHub: https://github.com/dataarts/dat.gui
### Tweakpane
Treći najrasprostranjeniji izbor, posebno u creative coding i shader-heavy projektima. Lepši, kompaktniji UI, podržava grafove/krive (bitno za GLSL uniforms tweaking).
 
- npm: https://www.npmjs.com/package/tweakpane
- GitHub: https://github.com/cocopon/tweakpane
- Sajt: https://tweakpane.github.io/docs/
## Ostali (retko se sreću u praksi)
 
- **control-panel** — GitHub: https://github.com/freeman-lab/control-panel
- **ControlKit** — GitHub: https://github.com/automat/controlkit.js
- **Uil** — GitHub: https://github.com/lo-th/uil
- **Guify** — GitHub: https://github.com/simbo1905/guify
- **Oui** — GitHub: https://github.com/wearekuva/oui
## Preporuka za tvoj stack
- **lil-gui** kao default izbor (moderna zamena za dat.GUI, isti mentalni model)
- **Tweakpane** ako ti treba lepši UI ili rad sa krivim/graph kontrolama za shader parametre