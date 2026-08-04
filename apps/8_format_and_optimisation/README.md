# textures - Format and Optimisation

When preparing for textures, keep in mind 3 crucial elements:
- the weight of the file
- the size (or the resolution)
- the data we put in that texture

And where to find textures

## Šta treba objasniti u detalje

- weight
  - The user will have to download the textures; and choose the right type of the file
    - `.jpg` lossy compression but usually lighter
    - `.png` lossless compression but usually heavier
  - use compression tool [TinyPNG](https://tinypng.com/); it will compress but you will use on quality, it will look worse
- size
  - each pixel of the textures will have to be stored on the GPU regardless of the image weight
  - GPU has strong limitations
  - it's even worse because mipmapping increases the number of pixels to store
  - try to reduce the size of your images as much as possible
  - our wood door texture would be way too big if you want t odisplay it somwhere far from the camera lense
  - mipmapping (learned in previous lesson) will produce a half smaller version of the texture repeatedly until 1x1; Because of that, the texture width and height must be a power of 2
    - 512 x 512
    - 1024 x 1024
    - 512 x 2048
    - all of these numbers can be devided by two untill you get 1
    - you will get bad performances and bad result visually if mentioned isn't respected

- data
  - textures support transparency but we can't have transparency in .jpg
  - if we want to have only one texture that combine color and alpha, we better use .png file
  -  if we are using normal texture we want to have the exact values which is why we should apply lossy compression and we better use .png for those
  - sometime we can combine different data into one texture by using the red, green, blue and alpha channels separatly


Where to find textures?:
  - <https://www.poliigon.com/>
  - <https://3dtextures.me/>
  - <https://www.arroway-textures.ch/>
 
  - always make sure that you have the right to use the texture if it's not for personal usage
  - you can also create your own textures with photos and 2d software like Photoshop or even procedural textures with: <https://www.adobe.com/products/substance3d/apps/designer.html>