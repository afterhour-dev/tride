# Shader Language - Intro

We are exploring GLSL here for the first time.
Exploring Transformation pipeline. 

## Namera / Intent

Getting familiar with GLSL.
Also exploring Transformation pipeline in order to understand things better.

## Šta treba objasniti u detalje

- What is GLSL, OpenGL Shading language?
  - Imperative
  - C style
  - strongly typed


- Main types
  - float
  - int
  - bool

- Vector types
  - vec2
  - vec3
  - vec4
- mat (matrix types) corresponds to 2/3/4-dimensional vectors
  - mat2 -  2 by 2 matrix
  - mat3 - 3x3
  - mat4 - 4x4

- Common mathematical operations
  - +
  - -
  - *
  - /
  - =
  - +=
  - -=
  - *=
  - /=
  
  - Are all of these mentioned component-wise? Or it depends from operands? For example multiplying matrix by vector has matrix multiplication rules, I assume?

- I think I found out that matrix multiplication or vector multiplication isn't going to be comonent wise. Or multiplication matrix by vector isn't going to be component wise. Which makes sense.

- will vector be considered as n by 1 matrix when doing multiplicatio nwith matrix

- Does order matters when we are multiplying matrix by vector

- Type qualifiers
  - varying
  - uniform
  - attribute

 - pattern: `<type qualifier> <data type> <name>`

- in files I named `/src/shaders/shader<1,2,3,4>.vert` there are also comments I left for, you should use to explain stuff

- Transformation Pipeline
  - How does a model get onto the screen?
    - What is Local space
      - also called object space
      - imagine the world from your point of view
      - everybody else, they also have their own point of view: their own local space
      - each persons left,right, up, down, they're all different: they're relative to that person
    - What is World space
      - local space is transformed into world space
      - everything is now defined relative to the world: instead of each object, as it is in laocal space
      - imagine GPS coordinates, North/South/East/West: these are all world relative
    - What is View Space
      - world space is transformed into view space
      - everything is again transformed relative to the camera
      - imagine a movie set: now everyone and everything is defined relative to the camera
    - Clip space - after view space
      - view space is transformed into clip space
        - this is what's output from vertex shader
        - result of World + View + Projection transformations
      - everything after is done by OpenGL
    - clip space is transformed into NDC space
        - NDC space (Normalized Device Coordinates) is a standardized 3D coordinate system used in computer graphics pipelines (like OpenGL, DirectX, and WebGPU) after a projection transformation and perspective divide
       - OpenGL handles the perspective divide
       - NDC Space transformed to screen space
         - Resolution and depth range are applied here to get final screen position
 
 - Vertex + Fragment shader form a shader program
   - Used when you draw anything
   - Say you draw a mesh, you bind a shader program
     - which includes both a vertex and fragment shader

- Like any other programs, you can run shaders programs with different prameters; 3 separate ways to set "parameters" on shader program; we need to know them in depth
  - Uniforms
    - Most "common" way
    - this is like setting global read-only variable
    - every vertex or fragment shader instance reads the ame value
    - useful for setting global state
      - textures, tinting,time, etc.
  - Attributes or vertex attributes
    - this is the model data itself, not something that you set yourslef but it comes from mesh itself; defined at each vertex
    - positions, normals,texture coordinates, colours
      - possible to set yourself too
  - Varyings
    - these are sort of one way "communication" pipeline from vertex to the fragment shader
    - a little tricky to understand
    - you output from a vertex shader, and those values are interpolated
    - the fragment shader receives the interpolated
    - useful for sending per-vertex data like colour, texture coordinates
      - anything else that's needed by fragment shader
      - advanced usage could include optimization, doing work per-vertex instead per fragment

- Some summary
  - Shaders are small programs that run on the GPU
  - Vertex shaders most common responsabilities:
    - gl_Position, typically = projection * modelView * position
    - Supply varying values for fragment shaders
  - Fragment shaders commonly output gl_FragColor

## Šta samo ukratko pomenuti

- How did we load our fragment and vertex shaders.
- Are there any other ways besides using vite plugin
- We are using here glesl, meaning we are not using WebGPU Rendrer
- I want to learn good glsl before stepping into TSL
