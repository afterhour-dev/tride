# Shaders - Min, Max, Clamp and Saturate

We want to explore mentioned function that llows us to define value to be in a certain range

## Namera / Intent

Learning mentioned function

## Šta treba objasniti u detalje

- min(x,y) - returns the minimum of the 2 parameters

- max(x,y) - returns the maximum of the 2 parameters

- clamp(a, minValue, maxValue) - clamps `a` to the range `[minValue, maxValue]`

- you can exaplain better these three funcrions; min, max, clamp; for example what is under the hood and show some examples with some arguments and what is returned

- saturate(a) or sat(a)
  - clamps `a` to the range of `[0.0, 0.1]`
  - not a built in function, but very common to se in shaders
  - it is the `clamp(x, 0.0, 1.0)`
  - you ca nshow some examples with `x` arguments and what it returns

- what we did is we reused code from previous lesson and we tried using some of these mentioned functions in our code

## Šta samo ukratko pomenuti

- {koncept koji nije fokus lekcije, ali se pojavljuje u kodu}
