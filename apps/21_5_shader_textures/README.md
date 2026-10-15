# Shaders - Texdtures and Multiplicative Blending

We are dealing with textures.

## Namera / Intent

Learning about textures and alsomultiplicative blending.

## Šta treba objasniti u detalje

- What are texture coordinates
  - way of mapping an image onto geometry
  - if we are looking at the texture,the bottom left corresponds to texture coordinate of `(0.0, 1.0)`, while top right of the image corresponds to texture coordinate `(1.0, 1.0)`
  - As we go fthroug texture coordiantes
    -  left to right axis is reffered as `U` axis
    -  bottom to top axis is refered as `V` axis
    -  this is why texture coordinates are also refered as UV coordnates
    - Why UV instead of XY? No compeling reason, just that you don't confuse them maybe with xy axis for models? Is this true?
    - so bottom left is 0,0 or (0U, 0V), top right is (1U,1V), bottpm right is (1U,0V), top left is (0U, 1V)

- We need to supply texture to the fragment shader
- We Need texture coordinates on fragment shader level
- What is texel or color value of the texture, if I named it right?

- texture2D is build function in glsl, it returns vec4. It return 1 texel of the texture at the coordinate that's specified
  - 4 channels rgba

- what we did here in our example: 
   ```
    vec4 diffuseSample=texture2D(diffuse,vec2(vUvs.x,vUvs.y));
    gl_FragColor=diffuseSample*tint;
   ```
is called `Multiplicative Blending` or also called "modulate" or "modulation" blending
   - standard blend mode in photoshop for example and one that is most important to know in shaders
     - example
        ```
         vec4 c1 = //some color   
         vec4 c2 = //some color

         vec3 example1 = v1.xyz * v2.xyz;
         vec4 example2 = v1 * v2;
        ```

  - So when we multiplty two vec4 in shader
  ```
  vec4 c1 = vec4(0.5); // same as vec4(0,5, 0.5, 0.5, 0.5);
  vec4 c2 = vec4(1.0, 0.5, 0.0, 0.0);

  // so it is component wise multiplication or hadamard product
  // or this is scaling one vector by another
  vec4 c3 = c1 * c2;

  // will produce this vector vec4(0.5, 0.25, 0.0, 0.0)
  // am I right? So like this
  // vec4(c1x*c2.x, c1.y * c2.y, c1.z *c2.z, c1.w * c2.w)

  ```


- don't forget to document and explain shader code, all examples from shader files. Doesn't matter if they are commented out or not. Just follow the info and explain and document code.
