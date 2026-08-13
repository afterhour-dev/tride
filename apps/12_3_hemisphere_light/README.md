# Hemisphere Light

Learning about Hemisphere light.

## Namera / Intent

Want to know important and useful things about Hemisphere light

## Šta treba objasniti u detalje

- similar to AmbientLight but with a different color from the sky than the color coming from the ground
- properties:
  - color (or skyColor (name of the argument, there's no property with the same name))
  - groundColor
  - intesity
- if you don't disable ambient and directional light we already had, or just not unchecking their visibility in gui, you won't see much how this hemisphere light is applied
- so when we check that other lights, expect hemispere are invisible we can see the purple illumination from the bottom and red illumination from the top; an in between an object will get the mix between those colors

- so we do have illumination from eveywhere also the crevices?

- how is hemisphere light for performance?