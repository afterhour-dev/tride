# Shaders - Common math functions

We are not going to cover all of them, just ones used offten by workshop author.

## Namera / Intent

To learn common math operations.In order to use then in next lessons.

## Šta treba objasniti u detalje

- we'll look at these that deal with single number, except modulo
  - abs(a) 
  - returns absolute value
    - `return a < 0 ? -a : a`
    - present some quick examples
    - can a be a vector?
  - floor(a)
    - returns nearest `integer` (`int`) value of `a` that's less than or equal to `a`
    - present some quick examples
    - can a be a vector?
  - ceil(a)
    - as a ceiling is exact opposite of floor
    - returns nearest `integer` (`int`) value of `a` that's greather than or equal to `a`
    - present some quick examples
    - can a be a vector?
  - round(a)
    - returns nearest integer value to `a`
    - present some quick examples
    - can a be a vector?
  - fract(a)
    - this one is interesting but a little bit weird
    - it returns float, a fractional part of `a`, the rest is discarded; so iteger portion is discarded 
    - present some quick examples
    - can a be a vector?
  - mod(x,y)
    - returns floating point a `x modulo y`; which is a reminder when dividing if I'm right
    - present some quick examples
    - interesting this one is same as fract
      - `mod(1.9, 1.0)` -> `0.9`
    - can a be x and y be vectors?
