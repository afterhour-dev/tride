# Raycaster - Use Raycaster with "mouseenter/leave"

In this app we explore raycaster by using it with a "mouseenter" and "mouseleave" which are not the events and I will laso called these different. They are not the events but logic we are using to determine when ray pierced the object and keep piercing it, and when we ae moving cursor to stop piercing the object. We called these "mouseenter" and "mouseleave" for convinience
This lesson is continuation of previous one.

## Namera / Intent

App is made to learn raycaster, precisely to learn how to aticipete pierce and stop the pierce

## Šta treba objasniti u detalje

- Mouse events like `mouseenter` and `mouseleave`, rtc. aren't supported ofcourse

- what we need to do:
  - Create a currentIntersect variable containing the currently hovered object
  - if an object itersects, but there wasn't one before, a `"pierceenter"` happened
  - if no object intersects, but there was one before, a `"pierceleave"` happened

## Šta samo ukratko pomenuti
