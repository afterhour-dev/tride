# Shaders - Step, Mix and Smoothstep drawing mix and smoothstep

Exploring step, mix, smoothstep with a little bit more imerssed example.

Continuing previous lesson

this time we are trying to draw mix on to part of the plain and smoothstep on the bottonm part of the plain

## Namera / Intent

Learning about and how to use mix, step, smoothstep through more imerssed example we continued from previous lesson.

## Šta treba objasniti u detalje

- displaying curve of the functions (drawing additional lines)
  - mix in top part of the plain
    - need a line going from the bottom left (since division in across middle it is at (0.0, 0.5)) to top right or (1.0, 1.0)
  - smoothstep in lower part of plain

- we need to introduce linearline for top part, and we are making it fater so it can be seen better


- think what mix does
  - when things are black the first parameter gets returned
  - when things are white the second parameter gets returned
  - whaen things are gray, you get the mix


- examine and explain the lines we got

- don't forget to document and explain shader code, all examples from shader files. Doesn't matter if they are commented out or not. Just follow the info and explain and document code.
