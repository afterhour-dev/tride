# Shaders - Texture coordinats: Addressing Modes

We are exploring texture coordinates and addressing modes.

## Namera / Intent

Learning about texture coordinates and addressing modes

## Šta treba objasniti u detalje

- so far we workd with texture coordinates being perfectly in range between 0 and 1; So question is what happens if they go past that?

- so what ve did is we multiplied uv coordinates by to and use them instead original uv coordinates, so we scaled these cordinates to not be in range between 0 and 1;
  - what happened is that we have bottom left our image and it is much smaller
  - and we have streaking effect going from right side of the image to the end of plane
  - and we are having streaking effect going from top side of the image to the up of plane
 

- Rember we tkled about texture coordinates (u: 0.0, v: 0.0) at the bottom left and (u: 1.0, v: 1.0) at the top right 
  - so past 1.0 in any direction, what does that even mean?
    - luckily shaders have answer for that, or more exactly OpenGL does

    - when you create a texture you need to decide what is the addressing mode

- Addressing Modes
  - How are texture coordinates outside the range `[0,1]` treated.S owaht are the rules or behaviors if they are outside of that range
  - Common ones (we will try one by one and see what they do) and we also can choose to set both uv or set just one (by changing wrapS and/or wrapT on the texture)
    - ClampToEdge (default)
      - it is what we are already seeing
      - THREE.ClampToEdgeWrapping
      - so what collors are at the edge of the texture are kinf of stretche out (what I called streaking effect earlier)
      - every sample outside of the range 0 to 1 is clamped to the edge, is as is border is copy/pasted over and over again
    - Repeat
      - THREE.RepeatWrapping
      - we will see tiels twice in each direction (because as you rember we multiplied uv coords bt two), you can try different multiplication value to see defferent effect; instead of scaling by scalar for uniform scaling yo ucan choose hadamard product to multiply uv coordinates non-uniformly and see how many tiles you will have in u direction and how many in v direction 
    - MirroredRepeat
      - THREE.MirroredRepeatWrapping
      - as you looking from left to right yo uwill see image being flipped horizontaly, every instance, or looking from bottom to top, every other instance repeated image is being flipped verticaly

- for homework, what we did is useing ReapetWrapping, but scale uv coordinates by negative value, like -1; and we want to explain why image is looking like that when we did that
  - you can explain why that happened, but what I can notice that image is rotated by PI I think. Am I right about noticing that?

- don't forget to document and explain shader code, all examples from shader files. Doesn't matter if they are commented out or not. Just follow the info and explain and document code.
