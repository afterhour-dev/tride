# Intro and Loading progress

We want to learn how to implemnt loading progress and intro the best possible way. This project is beggining one from mentioned series.

## Namera / Intent

To learn how to implement loading progress and intro

## Šta treba objasniti u detalje

- currently things are showing up once they are ready; we are going to do add simple loader so that the scene appears nicely when everything is ready; we are going to use mix of WebGPU and HTML/CSS for the loader

- Our starter contains what we did in realistic render lesson with the flight helmet (downloaded from popular github repo) and game boy like console I built in blender
  - so helmet, look really good but is really heavy, around 50MB

- we are starting with the overlay, a black overlay; and what we want is black overlay that fades out; and we can do this in many ways:
  - Animate the `<canvas>` in CSS
  - Animate the `<div>` that wraps `<canvas>`
  - Animate a black rectangle in front of the camera
    - we are going to do this one, we are going to create plane facing camera and fade it out when models are loaded

- to put a plane in front of the camera we could add it to the camera object and move it forward a little; instead we are going to put the plane in the scene and position its vertices using a vertex shader