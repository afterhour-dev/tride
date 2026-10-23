# Shaders - Inverse Lerp and Remap

We will not code anything but look into inverse lerp function and remap

Not the first time I encountered them. During course we took for math in gme dev I kearned about them.

## Namera / Intent

We want to learn or remind ourself on inverse lerp and remap.

## Šta treba objasniti u detalje

- Inverse lerp and remap are not built in, but they are commonly used
  - in other libraries they are built in but not in glsl; unity for example supplies them

- Inverse lerp implemntation is straight forward
  - `return (currentValue - minValue) / (maxValue - minValue)`
  - inverseLerp(currentValue, minValue, maxValue)
  - so lerp is giving us a value between minValue and maxValue based on fraction multiplier or percent, but inverseLerp are giving us the fraction multiplier back based on value between
  - it reminds on smoothstep, but it is linear and therefore they tend to call it linear step
  - examples
    - inverseLerp(0.0, 0.0, 100.0) --> 0.0
    - inverseLerp(25.0, 0.0, 100.0) --> 0.25
    - inverseLerp(75.0, 0.0, 100.0) --> 0.75
    - inverseLerp(100.0, 0.0, 100.0) --> 1.0

- Remap
  - it is basically this
    - you have range, and you have value between; you want to place a value in different range but in a same scale, or same proportion of the first range
    - so you need to do a inverse lerp to find the percentage or fraction multiplier
    - then you do mix or lerp to find actual value between second range
  - like this
    - `remap(currentValue, inMin, inMax,outMin,outMax)`
    - `float t = inverseLerp(currentValue, inMin, inMax)`
    - `return mix(outMin, outMax, t)`  // this is like new value P' (P prime)
  - examples
    - remap(0.0, 0.0, 100.0, 5.0, 10.0) -> 5.0
    - remap(50.0, 0.0, 100.0, 5.0, 10.0) -> 7.5
    - remap(100.0, 0.0, 100.0, 5.0, 10.0) -> 10.0
