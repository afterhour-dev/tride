# Shaders - Grid and cell

We want to utalie some functions from previous lesson to create a grid.

## Namera / Intent

we want to learn how to create grid, and manipulate with cells.

## Šta treba objasniti u detalje

- we need to create some sort of reference grid

- since we will be plotting functions we need to create some sort of reference grid

- first let's start with this: `color=vec3(vUvs,0.)*10.`
  - so what is multiplication doing in essence. it will produce gradients just for ranges between 0.0 and 0.1 and it will give us interesting result I explained in code, but maybe you can explain it better and demonstrate what values are being passed and what will be produced

- we will then use fract in order to divide everything in cells, or to create grid: `color=fract(vec3(vUvs,0.)*10.)`
  - so fract since it is "skimming" fraction from any number for example 5.1 will produce 0.1 or 6.0 will produce 0.0, we will have a lot of repeting values; Maybe you can explain better, in order for me to form better intuition for this

- put mentioned fract in separate variable, because if we decide to modify it we ca ndo from single place

- next we want to manipulate every single cell
  - in order to have grdient in cell where certain tickness of cell will have one color and other side close to center will have different color. Well how to calculate that tickness? Let me show you from the image
![distance](/apps/21_14_grid_and_cell/doc_images/ticknessfract.png)
  - when you look at the image it makes sense `d = 0.5 - max(d1, d2)`

- then ve use mentioned distance as rgb