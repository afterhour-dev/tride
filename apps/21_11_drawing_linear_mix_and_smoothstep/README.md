# Shaders - Drawing mix and smoothstep functions

Exploring mix and smoothstep with a little bit more imerssed example.

Continuing previous lesson

This time we are trying to draw linear mix on top part of the plain and mix with smoothstep as fraction on the bottom part of the plain.

## Namera / Intent

Learning about and how to use mix and smoothstep through more imerssed example, an example we continued from previous lesson.

Maybe we would understand everything better if we draw curves represented by just linear mix and mix with smoothstep.

## Šta treba objasniti u detalje

- So what we have so far, or what we accomplish in previous lesson:
  - gradient on top and gradient on bottom side of the plain
  - top one is linear interpolation from red to blue over x
  - bottom one is interpolation but with smoothstep from red to blue over x

- what we want to do now is displaying curves of the functions (drawing additional lines)
  - line for "basic" mix or linear interpolation in top part of the plain
    - need a line going from the bottom left (since division in accross middle it is at (0.0, 0.5)) to top right or (1.0, 1.0)
  - line for interpolation with smoothstep in lower part of plain
    - as you know this line is curvy
      - which means line is for certain amount of values very near x axis, maning y isn't chaning for certain amount of values, then we have more even grow and close to the ende we also have slow change of y

- step1 --> drawing a linear line for linear intepolation

- we need to introduce linearline for top part, and we are making it fater so it can be seen better

- think what mix does
  - when things are black the first parameter gets returned
  - when things are white the second parameter gets returned
  - whaen things are gray, you get the mix


- examine and explain the lines we got

- don't forget to document and explain shader code, all examples from shader files. Doesn't matter if they are commented out or not. Just follow the info and explain and document code.
