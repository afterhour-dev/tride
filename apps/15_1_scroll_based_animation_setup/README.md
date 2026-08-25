# Scroll based animation - setup: fixing elastic scroll, adding objects, adding texture, toon material, colors, looking into fov etc.

This app is made for learning how we can do scroll based animations in threejs, we want to integrate threejs properly with HTML content.

## Namera / Intent

Learn how to utalize techique of scroll based animation with Three.js

## Šta treba objasniti u detalje

- how to fix elastic scroll (you may not see it but on some devices and browsers some users can see it, and we don't want that to happen)
  so you may or you may not notice, if you scroll too far, you get a kind of elastic animation when the page goes beyond the limit.
  It's a cool feature, but the bck of the page is white and doesn't match our experience

- Solutions for elastic scroll
  - we could have set the `background-color` of the page to the same color as the clearColor

  - but what we are going to do is to set `clearColor` transparent, and only set `background-color` of the page (html element); but we must allow transparency first by setting `alpha` to be `true` when we instantiate the renderer, or use setClearColor with second argumant 0 (second argument is alpha), or by using method `setClearAlpha` to set alpha to (explain all of these ways)
  This confuses me. Maybe this is the WebGL vs WebGPU case. Because we are using WebGPU and when it comes to clear color because I am sure that by default we have transparency of clear color if we don't set clear color at all or set alpha to be true? Am I right?

- explain magFilter and whty we set it up

- In three.js the field of view of the perspective camera i vertical. If you put one object on the top, one on the bottom and then resize the window, objects will stay at the top and at the bottom. To demostrate this we did this temporary
  ```ts
  // after setting thoe try changing browser window vertically
  // and horizontaly and you will see that vertical resizing will 
  // not "crop", not hide your scene over vertical, 
  // not hide youtr objects
  // meaning your canvas is resizing over vertical axis but preserving
  // aspect ration of the scene
  // it is different horizontaly, scene will not get resized as you
  // lowering size horizontally, it is like vertical sauron eye
  // is closing it lids and seing less things in the scene, but
  // it is perfect in terms of centering, like content of
  // your scene has justify-center or text-align center if I have
  // liberty to compare it to css like that, maybe you can explain
  // it better
  torusMesh.position.y = 2;
	torusMesh.scale.setScalar(0.5);
	coneMesh.visible = false;
	knotMesh.position.y = -2;
	knotMesh.scale.setScalar(0.5);
  ```
  **Well, this makes positioning objects much easier**