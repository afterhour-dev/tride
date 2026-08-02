# lil-gui - tweaking geometry with onFinishChange

we need to tweak geometry in onFinishChange since we don't want to mess with geometry every time we move the slider for example.

Since geometry tweaking is expensive (explain how)

## Namera / Intent

Exploring how to tweak geometry stuff, and exploring onFinishCahnge

## Šta treba objasniti u detalje

- Tell me if I'm wrong but I think geometry is created only once because of costs, and we tend to reuse it. So we need to create/destroy geometry on tweak value change.

- Why we shouldn't use onChange in this case, I asume because CPU. So if range tweak is changed for example, that are a lot of geometries created/destroyed. So we use onFinishChange
