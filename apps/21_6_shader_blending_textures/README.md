# Shaders - Texdtures: blending two textures, and aplha "problem"

We are exploring how to blend multiple textures. And alpha chanell of texture.

## Namera / Intent

Learning about how to blend multiple textures. And lerning about alphachannel of texture.

## Šta treba objasniti u detalje

- I don't know if this has to do with version of three, but workshop author had a problem initially where his overlay texture which is mostly transparent, didn't have that transparency when overlaying our previous texture. Transparent parts were black for him
  
  - I didn't have this problem initialy probably because of the version of the threejs I assume and that something is done under the hood, or maybe I have some setting in javascript part of app (main.ts) that already fixed this?

- I presented his solution anyway, but this solution brought a problem for me.
  -  and what he did is that he used alpha channel of the overlay texture to be the fraction in LERP (mix), and he used diffuse texture as A and overalay texture as B
     -  for me this caused problem the workshop author tried to solve initially; so using his solution I lost transparency of overlay image, but unlike with his problem where transparent part was black, with me, transparent part was white
     
        - Can you tell me why is this different in my case. Probably because of newest version of thrrejs I'm using, I assume?
     
        - So he useed lerp with alpha channel of overlay texture as decimal fraction, when for me just multiplication, or hadamard product of both vec4 samples worked out of the box and I didn't have the "not applying transparency problem"


- don't forget to document and explain shader code, all examples from shader files. Doesn't matter if they are commented out or not. Just follow the info and explain and document code.
