# Shaders - Talking about center

I want to examine what we did with grid from previous lesson to understend things better. What we want to concentrate is `center` vec2 we built

## Namera / Intent

To see how actually some things work, center in particular, we defined in previous lesson.

## Šta treba objasniti u detalje

- what we did in previous lesson seems a lot like magic so let's comment out a lot of stuff and look what we did

- let's comment out all the grid code and display red and green gradient
  - we know that 0,0 is bottom left and that 1,1 is top right
  - on a piece of paper think about it what  you'll get if yo usubtract (0.5,0.5) from every point
    - to see this try to use centar vector2 as rg values
    - When we did the last thing, is we get bottom left quadratn to be black and rest of quadrants is red and gtreen gradient
    - (0,0) is now at the middle of the screen and top right is (0.5,0.5) and bottom left is (-0.5, -0.5)

- wrap center in abs call and you'll get some mirror effect where in center is black

- so what we make sure is that 0,0 is at the center of th escreen because then when you multiply or do whatewer you want center doesn't move