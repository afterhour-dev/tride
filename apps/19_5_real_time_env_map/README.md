# Environment maps - Real-time environment map

App used for Exploring real time environment maps.

In terms of meshes and models in this app we are loading Flight Helmet model: <https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/FlightHelmet> because it looks grat and realistic, but also heavy; but also great for testing environment maps; we also have white torus knot, also nice for testing environment maps; and also loded draco compewssed model I built in blender just to see how it's going to look with different env map settings; and we have torus knot which we will change metalness and roughness and observe how environment map lighting affects it.

## Namera / Intent

To gain knowledge about real time environment map.

## Šta treba objasniti u detalje

- How to create a dynamic environment (to be able to move the lights and the objects in environment map)

- we loaded one primary (for this lesson) LDR map; because it is quite dark; also LDR is not high dynamic range picture, which is good because we are going to add lights ourselfs to that environment map; our env map is perfect for that

- only setting background, but not environment (so loaded environment map will not be responsible for the lights, only for the background)

- we created torus surrounding the scene and try to make that torus illuminate and reflect on the surface of our objects. How? We are going to render the scene inside our own environment map texture and it is going to be "cube texture"; We need to use `CubeRenderTarget`
  - when instatiating, what is most important is to set type to the THREE.HalfFloatType or THREE.FloatTYpe in order to have same behaviour as an HDR with a high range of data; which we don't have with LDR (Float uses 32 bits to store a wide range of values, which is too much, HalfFloat uses only 16 bits, but it's still quite a wide range, the difference won't be noticable and it's better for performance since it requires less memory)
  - we then assign texture property from the 

- we need to render 6 square textures (one texture for each face of the cube) and we could, but we won't:
  - Use `PerspectiveCamera`
  - Set it's field of view to fill one side perfectly
  - do one render for each side
  - combine them    
- We will use the `CubeCamera` instead
  - parmaeters
    - near
    - far
    - CubeRenderTarget instance
  - you still use your regular PerspectiveCamera for the actual view the user sees. The CubeCamera is a separate, additional camera that exists purely to capture the environment; it never touches the final image on screen.
  - we then need to render on each frame


- Since we are using a high-range texture on the render target, we can make the cube color go beyond 0 and 1 range; we can go back and change color on the torus material

- there is a bug; try changing rougness of our our knot mesh in gui and wach the reflection, when you lower the rougness close to er obug will be visible
  - can be fixed with using Layers (they work like categories and can be set on any object inheriting from Object3D (like Mesh))
  - By setting layers on camera, this camera will only see objects matching the same layers; if a camera has its layers set to 1 and 2, it'll only see objects that have layers set to 1 or 2
  - by default all objects and camera layers are set to 0, and to change the layers of an object or a camera, we can use 3 methods
    - object.layers.enable(...) will add the layer
    - object.layers.disable(...) will remove a layer
    - object.layers.set(...) will enable a layer and disable all other layers automatically

  - we want that iluminating torus to be visible for both the default camera and the cubeCamera, since default layer is 0 we just need to add 1

- doing 6 renders on each frame can be quite a lot in terms of performance; keep an eye on the frame rate, use the smallest possible resolution on the CubeRenderTarget, and keep the scene that is being rendered in the environment map simple
- - be careful with layers, it's easy to get lost in what is being rendered (lights aren't affected by layers)