# Raycaster - test on each frame

In this app we explore raycaster with testing it on each frame.

## Namera / Intent

App is made to learn raycaster and how to use it properly.
This lesson is in a way continuation of previous one.

## Šta treba objasniti u detalje

- if we want to test things while thez are moving, we have to do the test on each frame; we are going to animate the spheres and turn them to another color when the ray intersects with them; be caredul, using the ray to test collisions, to test intersections can be quite heavy especially if you have a lot of objects with a lot of complex geometries, so try to do it as less as possible; but know if you want to test objects that are animated, you need to do it on each frame

- in previous lesson in order to distane property of intersection items to have correct values, we called `renderer.updateMatrixWorld(true)`; Do we still need to do this since from what I can see values for distance aren't the same, so it seems correct way not to do it? Maybe `renderer.render()` is already doing it?

## Šta samo ukratko pomenuti
