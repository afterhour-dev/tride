# Raycaster - Use Raycaster with the mouse

In this app we explore raycaster by using it with a mouse events

## Namera / Intent

App is made to learn raycaster and how to use it properly with mouse events.

## Šta treba objasniti u detalje

- We can use the raycaster to test if an object is behind the mouse; Three.js will do all the heavy lifting

- Hovering:
  - We need the coordinates of the mouse but not in pixels; We need a value that goes from -1 to 1 in horizontal and vertical axes
  - avoid casting the ray in the `mousemove` event callback and do it in tick function
  - use the `setFrameCamera()` method to orient the ray in the right direction


## Šta samo ukratko pomenuti
