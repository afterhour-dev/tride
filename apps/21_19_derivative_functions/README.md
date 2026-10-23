# Shaders - Derivative functions

Learning about derivative functions.

## Namera / Intent

We want to learn about derivative functions.

## Šta treba objasniti u detalje


- `dFdx(x)`
- `dFdy(y)`
- they return screen-space derivative with respect to x/y
- only available in fragment shader
- you can call them on any value in fragment shader and they will compute mentioned screen space derivative or rate of change of that value
- example:
  ```
  float t = complicatedCalculation();
  float x = dFdx(t);
  float y = dFdy(t);

  dFdx(t) => t_pixel - t_neighbour_x
  dFdy(t) => t_pixel - t_neighbour_y
  ```
- this is the only way to have insight what is happening in neighboring fragment shader running ot he GPU


