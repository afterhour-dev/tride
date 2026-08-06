# MeshMatcapMaterial

About MeshMatcapMaterial

## Namera / Intent

Learnig about MeshMatcapMaterial

## Šta treba objasniti u detalje

- looks great while remaining very performant
- needs a reference texture that looks like a sphere
- the material will pick colors from the texture according to the normal orientation relative to the camera
- the meshes apear illuminated but it's an illusion created by the texture
- the problem is that the result is the same regardless of the camera orientation and we cannot update the lights
- getting matcap texture from: <https://github.com/nidorx/matcaps> (licences aren't verified and you might not be allowed to use them or other than for personal projects)
- or you can create them with:
  - 3D software by rendering a sphere in front of camera in square image (I assume this is possible with blender)
  - with 2D software like photoshop
  - with online tools like <https://kchplr.eu/matcap-studio/> (very cool)