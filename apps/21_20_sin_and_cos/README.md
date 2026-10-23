# Shaders - Sin and Cos 

We are explorin sin and cos function. There are more of builtin math function but we are talking about common ones and most usefull ones

## Namera / Intent

Learnin how to use sin and cos in glsl

## Šta treba objasniti u detalje

- sin(radians)
  - returns trigonometric sine of the angle (specified in radians)

- cos(radians)
  - returns trigonometric cosine of the angle (specified in radians)

- some examples: sin
  - sin(0.0) -> 0.0
  - sin(PI/2) -> 1.0
  - sin(PI) -> 0.0
  - sin(PI * 3/2) -> -1.0

- some examples: cos
  - cos(0.0) -> 1.0
  - cos(PI/2) -> 0.0
  - cos(PI) -> -1.0
  - cos(PI * 3/2) -> 0.0

- These aren't just usefull for trigonometry; they are super useful functions that map x from any value into the range of -1 to 1; we will show this in code

- we will continue with cos/sin in next lesson, I don't want to do it here in orther not to bloat my example and make it hard to understand upon revisit of docs