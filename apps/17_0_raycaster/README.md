# Raycaster - intro

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

- I need better explanation of why `direction` vector needs to be normalized. But when I think about it maybe it's like this, `origin` dot determines the beggining of the ray; and `direction` vector determines actual direction which is line made from scene origin to the direction vector? Is this assumption true? Because apllying normalization is something that doesn't change actual  direction of the line created by connecting center of the scene and `direction` dot. Therefore direction is just like some line telling the ray: "Hey, have direction like this one when you emit the ray". Did I gues anything?

- Casting a ray, you have two options:
  - intersectObject() to test one object
  - intersectObjects() to test multiple objects

- Result of the intersection (array returned by intersectObject() or intersectObjects())
  - always an array (even if you are testing only one object) because a ray can go through the same object multiple times (for example if you have torus (dounut) or some kind of bend pipe; ray goes through one side of the dounut, exits and goes into to the hole and then enters from the hole to another side of donut, goes through it and exits)
  - Each item in the mentioned array contains useful information:
    - `distance` - distance between the origin of the ray and the collision point (I had one problem with the distance, I explained in comments)
    - `face` - what face of the geometry was hit by the ray (when is this usefull , I heard it is npt used much)
    - `faceIndex` - the index of the face (is this also not used too much?)
    - `object` - what object is concerned by the collision
    - `point` - a Vector3 instance of the exact position of the collision
    - `uv` - the UV coordinates in the geometry
 
## Šta samo ukratko pomenuti
