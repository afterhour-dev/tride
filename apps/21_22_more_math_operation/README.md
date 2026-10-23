# Shaders - More math operations

Exploring more math operations. We will draw couple of them

We are continuing the example 21_11_drawing_linear_mix_and_smoothstep, because it is convinient to draw other math operations,

## Namera / Intent

Learnin about some more math operations and how to draw them.

## Šta treba objasniti u detalje

- More math operations
  - sqrt(x,y)
    - square root of x
    - = x^y (is this the right sign? Isn't this pow if we use ^? Could this be wrong)
  - inversesqrt(x)
    - inverse sqrt of x
    - = 1.0 / sqrt(x)
  - pow(x,y)
    - raises x to the power y
    - x power of y
  - exp(x)
    - raises e to the power of x
  - exp2(x)
    - raises 2 to the power of x
  - log(x)
    - natural logarithm of x
  - log2(x)
    - base 2 logarithm of x

- in fragment shader code we are starting with the example we did when we draw linear line in case of mix function and smooth line i ncase of smoothstep
- in general shaping functions are really cool because they allows you to force behaviour you want

- there are entire sites dedicated to shaping functions, and what we did gives you small idea what they are doing

- don't forget to document and explain shader code, all examples from shader files. Doesn't matter if they are commented out or not. Just follow the info and explain and document code.
