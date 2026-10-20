# Starters - Step, Mix and Smoothstep

Exploring Mix (this is LERP, we alredy used onec in previous lessons), Step and Smoothstep.

## Namera / Intent

Learning about most important interpolation functions.

## Šta treba objasniti u detalje

- step(edge, x)  -  generates a step function by comparing x to edge
  - if you would implement it yourself
      ```
      if(x < edge>) return 0.0;
      return 1.0;
      ```
      - so for example if edge is set to be 0.5, and we change x you are going to have this results
        - `step(0.5, 0.0)` -> `0.0`
        - `step(0.5, 0.49)` -> `0.0`
        - `step(0.5, 0.51)` -> `1.0`
        - `step(0.5, 1.0)` -> `1.0`
          - so when x is smaller than edge function returns 0.0, but when x brakes above edge, function returns 1.0
          - so once you go over certain threshhold yo "ustep up" (name kinda implies what this function is doing)

- mix(a,b,t) - linearly interpolates (LERP) between a and b using t as a percentage (or fraction multiplier to be precise)
  - so it gives us linear blend between two values
  - internaly defined like this
      ```
      return a + t * (b - a);
      ```
      - some examples
        - mix(10.0, 20.0, 0.0) -> 10.0         0% between 10 and 20 
        - mix(10.0, 20.0, 0.25) -> 12.5        25% between 10 and 20
        - mix(10.0, 20.0, 0.75) -> 17.5        75% between 10 and 20
        - mix(10.0, 20.0, 1.0) -> 20.0         100% between 10 and 20
  - in other shader languages like HLSL by microsoft it is reffered as lerp instead of mix, but it is exact same function but different name

- smoothstep(edge1, edge2,x) - Returns smooth Hermite interpolation between 0.0 and 1.0 if x is in the range `[edge1,edge2]`
  - internaly it is this:
    ```
    t = clamp((x - edge1) / (edge2 - edge1), 0.0, 1.0 );
    return t * t * (3.0 - 2.0 * t)
    ```
  - some examples:
    - smoothstep(10.0, 20.0, 10.0) -> 0.0
    - smoothstep(10.0, 20.0, 12.5) -> 0.156
    - smoothstep(10.0, 20.0, 15.0) -> 0.5
    - smoothstep(10.0, 20.0, 20.0) -> 1.0
