# Raycaster - raycasting with models

In this app we explore raycaster by using it with a model we loaded; and we are handling movment of the rays with mousemove, just like in previous couple of lessons.

Model we imported from <https://github.com/KhronosGroup/glTF-Sample-Models> is 2.0/Duck

## Namera / Intent

App is made to learn raycaster, precisely to learn how to use it with imported model and when moving rays with the mousemove event just like in previous lessons.
It should be quite easy; and we are doing it because there are few interesting things that we can learn along the way.

## Šta treba objasniti u detalje

- we have simple model that is why we are adding just model.scene (A Group of Mesh and PerspectiveCamera; we don't care anyway about the camera since we are not going to use it); but if you would have complex model with multiple meshes point of the raycaster way we are going to use is that it would work on complex models too, taht's the point

- intersect the model
  - we want duck to get bigger when the cursor enters it and revert to its noraml size when the cursor leaves it
  - we are going to test if the cursor in in duck or not on each frame (in the tick function)
  - the raycaster is already set from the mouse and we can our intersect test right after the code related to the test we did with the spheres and cube in previous lesson
  - we are going to use intersectObject, singular this time; we are testing single object, but what about more complex objects; well it doesn't matter  since object we are testing is the Group (model.scene) that contains everything else; we don't care if it is one mesh or 10000 meshes, we want to test one object, the parent one; this will work even if there are children inside children; it will return array of intersections
  - in animation loop we will create modelIntersect variable (no conflict with intersects variable we have from previous lessons)
  - we call the raycaster.IntersectObject (singular) method
  - argument is scene propery of our model


- classic issues when we try to interact with our animate loaded
  - one issue is that loading models takse time (depends on the model and the network); so you might interact or want to animate the model, but model  isn't fully loaded; what then; and we need to fix that
  - if we want to interact with model with a raycaster or animate the model we need not to animate model in animation loop untill it is fully loaded
  - I think this would be the problem if we would load model with a just load() method and assigning it to the variable that was null initially, and we would need to do this if we want to be able to use that varable in the scope of tick because we can't do it other way. Well than we would need to handle model being null inside tick; Since we are uisng loadAsync we don't have same issues? You correct me if I'm wrong?

- Another question? Since I am awaiting loading of my model I have blocking code, right and all of the things going after that  are waiting which means I am postponing the first render. Am I right? So what is better practice, to use load and handle null case or to use loadAsync? I won't correct my code right now to use load, just asking you what is right thing to do?

- Something to note
  - We are calling intersectObject on model, which is Group, not a Mesh; you can test that by logging duckModel; but raycaster is supposed to work on meshes only, only for things that have geometries and they are somewhere in space, but now we are piercing on the Group, which is kind a "nothing", but that group contains meshes and that's the idea; raycaster by default goes to object and the children of the object and their children, so it doing it recusrsively; that is why yu ca ndo it easyly on model; it will just worko
  - we can deactivate that option of recursive using the children, adding second argument, a `false` when calling `intersectObject/s`
  - so we told that we are getting array of intersects which is wierd since with intersectObject we are testing single object; well it makes sence since we are intersecting recursively there might be multiple meshes, and maybe we pierce multiple meshes anfd we get the multiple meshes; and second reson maybe we mentioned in previous lesson is that ray can pierce throu one object multiple time if objectt is dounut for example; test this as you point at the head of the duck but point array from above so ray goes through the head and also hits the tail of the duck