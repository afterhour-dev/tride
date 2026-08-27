# Scroll based animation - easing

This app is made for learning how we can do scroll based animations in threejs, we want to integrate threejs properly with HTML content.

This project is continuation of previous lesson. Continuation of project will be in next lesson.

## Namera / Intent

Learn how to utalize techique of scroll based animation with Three.js.

## Šta treba objasniti u detalje

- the parallax animation we made in previous lesson feel a bit too mechanic and it's not realistic; we are going to add some "easing" (also called "smoothing" or "lerping") and we are going to use a well-known formula
- on each frame instead of moving the camera straight to the target, we are going to move it (let's say) a 10th or smaller closer to the destination; then on the next frame another 10th or smaller close; then on the next frame another 10th or smaller closer; etc.

- we are using delta time to base our animation on frame rate speed of different screens users can have