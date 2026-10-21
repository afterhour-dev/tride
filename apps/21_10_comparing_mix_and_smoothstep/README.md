# Shaders - Comparing Mix and Smoothstep

Exploring mix, smoothstep with a little bit more imerssed example.

We will use mix and smoothstep in a single shader to create a shader that shows you how mix and smoothstep look like.

## Namera / Intent

Learning about and how to use mix and smoothstep through more imerssed example.

## Šta treba objasniti u detalje

- Explain all the steps of our example

- idea is that on top half of the plane we show the mix, and on the bottom half to show smoothstep

- step1 --> Let's try something out: if we subtract `y` of `uv` with 0.5, and use that as our value for all colors of color vec3 we have, we will get gradient that only spans on one half of the plain in vertical direction.
  - we will get values in range from -0.5 to 0.5
  - negative values will be zeroed out meaning they will be considered to be 0.0
  - meaning we will end up with gradient that gies from 0.0 to 0.5
  - also this means that bottom side of plain will be black since it will have all 0.0 value till uv.y reaches it's 0.5
  - so, on a "natural" place of 0.5 for y, value end up being used will be 0.0 which is minimum, and as it grows it will go to "natural" place of 1.0, but maximal value being used is going to be 0.5
  - so from bottom to top we have black to the half, and as we cross that line we start seeing black blending into gray, and it never reaches white

- step2 --> Introducing absolute value
  - we don't want gradient only at the top side of plain
  - we can fix this by wrapping mentioned subtraction inside abs()
  - which means values are going to be in range of 0.5 to 0.5, but middle is going to be 0.0, and as we know 0.0 is black, so you will have black blending into white in up/down directions
  - for example as y grows you will have 0.5 ,0.4,0.3 ...0.0, 0.1, 0.2...0.5; so as y grows, 0.5 value is decresing till in the middle being 0.0 and then starts incresing till it gets to 0.5

- step3 --> we better keep abs(vUvw.y - 0.5) as a separate variable, we can call it line for example

- step4 --> we don't want gradient being in the middle, we would like to have 
  - I thin black line, which we can accomplish with two ways
    - by using `step with` really small edge
      - so in this case with `step` when `y` comes to be 0.5 or a middle whch after getting absolute value of substraction by 0.5, we get value of 0.0, we will get black color for values between 0.0 and 0.05 which we specifies as edge; so we will have white on top and bottom and in middle we will have thin black line
    - by using `smoothstep` with really small range between two edge arguments
      - well we can specify 0.0 and 0.005 for the edges for example; and clamp under the hood of smoothstep I assume wil ldo it's job or getting 0.0 for black and 1.0 wor white, since we have small range of values

- step5 --> time to interpolate
  - since we don't want just white being on the top side of the plain
  - since we don't want just white being on the bottom side of plain
  - we want our gradient to go horizontaly
  - upper half of the plain should be mix or lerp between red and blue and do this horizontaly
  - for the bottom side we need gradient
  - for the bottom we want same mix of colors but fraction t value needs to be produced with smoothstep

- step6 --> we can see both gradients but we didn't use line value so we don't have visible division between gradients, even we can notice difference between when we just use LERP, and when we used smoothstep to alter fraction value
  - what we did to get line back is we interpolated black or white with current colors and used line value as fraction
  - to better understand this last step we can examone the line value again and it will be clear why we got black line in the middle and interpolation above and bellow like we defined them in previous step

- Now what is left is to look at our two gradients and determine which one is better looking. You can help me with that and describe them and tell me which one is better and which ome developer like more?

- don't forget to document and explain shader code, all examples from shader files. Doesn't matter if they are commented out or not. Just follow the info and explain and document code.
