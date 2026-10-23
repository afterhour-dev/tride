# Shaders - Swizzling and common Vector operations

We are exploring vector operations, or vector methods or functions.
There is also swizzling which we will demonstrate.

## Namera / Intent

To learn vector operations, methods and swizzling.

## Šta treba objasniti u detalje

- Swizzling - we can use `r` `g` `b` `a` to access or write to components besides using `x` `y` `z` `w`; we all know why; when vector is defining color it is easier to use r g b a
  - vec2    -->     `[x,y]`   or    `[r,g]`
  - vec3    -->     `[x,y,z]`   or    `[r,g,b]`
  - vec4    -->     `[x,y,z,w]`   or    `[r,g,b,a]`
  - you can present few examples for swizzling
  - but we are not limited to pulling individual componets, we can pull "subvectors" If I can call them like that, for example `.xy` will pull out vec2 of xy, or `.rgb` to pull sub vec3; and it can be in order you want, for example `.yx` or `.wx` or `.xx`
    - you can present examples for mentioned too
  - using swizzling you can also write values using swizzling operators as well, for example setting `.r = val` or setting throug "subvector" `.yx = vec2(..)` or `.gab = vec3(...)`
    - you can present few examples for writting too
    - you can say that writting in order you want, is allowed, but people tend not to like this: like setting `.zy =` is allowed but people don't like that, better to set `.yz`
    - but this assignment isn't valid for example `.xx = vec2(..)` and it makes sense why is not valid, for example why specifing one component multiple times like `.zz=`

- Common vector functions: given these `vec3 someVector = ...; vec3 normal = ...` ; you can do these:
  - length(someVector)
    - explain it
    - present example
  - normalize(someVector)
    - explain it
    - present example
  - dot(someVector, normal)
    - explain it
    - present example
  - cross(someVector, normal)
    - explain it
    - present example
  - reflect(someVector, normal)
    - explain it
    - present example
  - refract(someVector, normal)
    - explain it
    - present example

- why is explanations above the second vector called `normal`? Why for dot product, doesn't make sense since if it is normal it would be dot product of 0? Why that naming here by the workshop author?

- the point is that you should know that glsl does offer a lot of these as built in functions for you. So your first instinct shouldn't be to go implemnt it, better check if function already is built into glsl and use it