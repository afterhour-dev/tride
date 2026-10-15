# Shader Inputs - uniforms and mix

Exploring shader inputs:

- uniforms

- mix function (LERP)

## Namera / Intent

Lerning more about uniforms

We will also learn about mix function

## Šta treba objasniti u detalje

- uniforms
  - what are they
    - well we will use those since we don't want to hardcode our constants

- mix function
  - from what I understand mix is linear interpolation or LERP
  - mix(a,b,t)
    - `p = a + t * (b - a)` I remeber this to be definition when learning about it; `t` is decimal fraction (decimalni razlomak), meaning number from 0.0 to 0.1, and if we multiply distance betwen `a` and `b` with a decimal fraction we get part of that distance depending on fraction, and then we add it to the `a` to get actual point, if we can call it `p`
      - `p` will be equal to `a` if `t` is `0.0`, and it will be equal to `b` if `t` is equal to 1.0; and if fraction `t` is smaller that 1.0 or bigger than 0.0 we get values laying between `a` nad `b`. Pretty simple when you think about it. if you want point to be on twaonty fift percent of the distance you multiply by 0.25, if you want it to be on seventy fift percent of the distance you multiply by 0.75, if you wnt it to be on half of the distance t is 0.5
      - you can also provide examples of multiplication by `t` to explain this better
      - so in esence it smootlhly interpolates between a nd b
    - and from my memory I know that we can linaerly interpolate vectors which we did in fragment shader

- don't forget to document and explain shader code, all examples from shader files
