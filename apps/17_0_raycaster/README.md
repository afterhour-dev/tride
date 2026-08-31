# Raycaster

In this app we explore raycaster.
Main thing in setup is three spheres and we are going to shoot a ray through and see if those spheres intersect with it

## Namera / Intent

App is made to learn raycaster and how to use it properly.

## Šta treba objasniti u detalje

- A Raycaster can cast a ray in a specific direction and test what objects intersect with it.

- Usage examples
  - Detect if there is a wall in front of the player
  - Test if something is currently under the mouse to simulate mouse events
  - Show an alert message if the spaceship is heading towards a planet

- We can use `set` method on Raycaster instance to set up origin (`Vector3` instance) and direction (`Vector3` instance); but `direction` needs to be normalized (which means coordinates will be scaled down/up in order for distance from the center of the scene to the direction Vector3, to be precisely 1; am I right about this?)

- I need better explanation of why direction vector needs to be normalized

- Casting a ray, you have two options:
  - intersectObject() to test one object
  - intersectObjects() to test multiple objects

## Šta samo ukratko pomenuti
