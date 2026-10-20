# Shaders - Step, Mix and Smoothstep more imerrsive

Exploring step, mix, smoothstep with a little bit more imerssed example.

We will use step, mix, smoothstep in a single shader to create a shader that shows you how mix, step, smoothstep look like.

## Namera / Intent

Learning about and how to use mix, step, smoothstep through more imerssed example.

## Šta treba objasniti u detalje

- All the steps of our example

- idea is that on top half of the plane we show one thing, like the mix function, and on the bottom half to show step and smoothstep

- step 1 -> so first thing we do is draw dividing line on the middle of the plane, which means we need to use `v` coordinate (uv.y)
  - if we subtract y of uv with 0.5, and use that as our value for color vec3, we will get gradient that only goes to the half of plane
    - I assume value will be clamped to 0.0 in case of negative values? Am I right?
  - if we enclose that line value (dividing value) we mentioned in abs to get absolute value, we won't get any negatives value being clampt to 0, we will have values from 0.0 to 0.5 and vice versa from 0.5 to 0.0 meaning gradient will go from middle to moth sides
  - so we will have black in the middle but gradient ts up and down going brighter

- step 2 -> we want smoothstep but smootstep to give as not some smooth transition from black in the middle to the white up/down, meaning threshold or value betweed edge1 and edge2 needs to be small
  - which means we need quick transition to the 1.0
  - for example edges can be 0.0 and 0.005
  - if you change second edge to bigger value, we will get fater black section in the middle

- step 3 - useing mix of red and blue only on the top of the plane
  - meaining we need to gave if else statmant and condition is uv.y being greather than 0.5

- step 4 - we need to use mix between white and color with fraction being line

- step 5 - we need to make our else statement to use smoothstep, to define smoothstep on lower half of the plane

- step 6 we need now to mix white with our color to create line (white) since we lost that

- don't forget to document and explain shader code, all examples from shader files. Doesn't matter if they are commented out or not. Just follow the info and explain and document code.
