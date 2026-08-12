# Ambient Light

Learning about ambient light.

## Namera / Intent

Want to know more about ambient light

## Šta treba objasniti u detalje

- adding lights is as simple as adding meshes; we instantiate with the right class and add it to the scene

- ambient light applies **omnidirectional lighting** (explain this); we have rays of light in every direction so we have uniform lighting all around our sphere/cube/plane etc.
- so even our mesh have a crevice, same lighting will be on the surface of crevice; uniform illumination

- we can use the AmbientLight to simulate light bouncing; from what I understand light bouncing would go something like this (you explain it better if you can):
  - light we can observe as single dot in space lounches it rays, and iluminates the part of the object that is in the way of rays (we can observe them as straight lines with arrows in this example); in real life we could also see the back of the object, because light, or ray of light can bounce (of the ground for example) and get to the oposite side o fobject that don't have direct exposure to light
  - with threejs or real time rendering light bouncing is hard; so we use ambient light to simulate the bouncing; where ambient light applies small dim light from every direction to simulate the bouncing

## Šta samo ukratko pomenuti
