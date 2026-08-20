# Project A - part two

First project built to practice some of the learned things.

## Namera / Intent

Practicing three.js by using "primitives" as geometries and by using textures and using lights and shadow knowledge from previous lessons.

We are continuing this project in next lesson.

## Šta treba objasniti u detalje

- Fog class, and all important properties (color, near, far)
  - near, how far from the camera fog starts
  - far, how far from the camera will the fog be fully opaque
- we don't add fog with scene.add, we use `scene.fog = fog` ptoperty
- As you know if we have black background and floor plane that is green like grass that is not good because we see edges. I have dilema about clear color, scene.background and fog color, in case of floor color of the plane. Should I pick same color as background like the grass of my ground which is set on floor material, or should background color and fog color be matching  
  - is setting a `scene.backgroun` same as setting `renderer.setClearColor`.
  - In this case I commented out `renderer.setClearColor` and used `scene.background`, you tell me did I make right choices. Or I should use both with same value
  - I didn't listen to advice of some people on the internet to sert clear color as grass plane; what I did I used same color for background and fog; you tell me did I make right choice or not?