# Scroll based animation

This app is made for learning how we can do scroll based animations in threejs, we want to integrate threejs properly with HTML content.

## Namera / Intent

Learn how to utalize techique of scroll based animation with Three.js

## Šta treba objasniti u detalje

- how to fix elastic scroll (you may not see it but on some devices and browsers some users can see it, and we don't want that to happen)
  so you may or you may not notice, if you scroll too far, you get a kind of elastic animation when the page goes beyond the limit.
  It's a cool feature, but the bck of the page is white and doesn't match our experience

- Solutions for elastic scroll
  - we could have set the `background-color` of the page to the same color as the clearColor

  - but what we are going to do is to set `clearColor` transparent, and only set `background-color` of the page; but we must allow transparency first by setting `alpha` to be `true` when we instantiate the renderer, or use setClearColor with second argumant 0 (second argument is alpha), or by using method `setClearAlpha` to set alpha to (explain all of these ways)
  This confuses me. Maybe this is the WebGL vs WebGPU case. Because we are using WebGPU and when it comes to clear color because I am sure that by default we have transparency of clear color if we don't set clear color at all