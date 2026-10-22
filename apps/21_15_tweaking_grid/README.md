# Shaders - Tweaking the grid

We are altering grid we created in previous lesson.

## Namera / Intent

To learn how to tweak grid.

## Šta treba objasniti u detalje

- we want to use smoothstep trick we did in some of previous lesson to eliminate shader in our cell; meaning right at the edges we will have value of 0, and very quicklty after that it will ramp up to 1

- but we want gray cells with black lines; we don't wnt white cells so we are going to do mix

- our grid cells aren't have perfect squares, and you can see how height changes as we resize width of browser window; I think same is for the height too; so problem is that aour cell don' thave consistent size
  - we need to make this resolution independent
  - we will introduce new uniform and that is resolution; we will use this to keep window resolution
  - make sure that you update resolution uniform on resize of the window

- our grid or our cells aren't center to the screen, we fix this by finding center which is uv coordinates being subtracted by 0.5