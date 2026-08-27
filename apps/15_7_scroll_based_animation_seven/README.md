# Scroll based animation - triggered animations

This app is made for learning how we can do scroll based animations in threejs, we want to integrate threejs properly with HTML content.

This project is continuation of previous lesson.

## Namera / Intent

Learn how to utalize techique of scroll based animation with Three.js. This is te last lesson in series about scroll based animation in three.js

## Šta treba objasniti u detalje

- we are going to make the objects do a little spin when we arrive at the corresponding section in addition to the permanant rotation

- we need to figure out when exactly we need to trigger the animation
  - first we need a way to know when we reach a section
    there are plenty of ways of doing that and we could even use a library, but in our case, we can use the scrollY value and do some math to find the current section

- What I didn't do in this lesson but it could be cool:
  - add more content to the HTML
  - animate other properties like the material
  - animate the HTML texts
  - improve the particles
  - add more tweaks to the gui
  - etc.