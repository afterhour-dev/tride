# Environment maps - HDRI Equirectangular environment maps made in blender; and loaded in this app

App used for Exploring environment maps.

In terms of meshes and models in this app we are loading Flight Helmet model: <https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/FlightHelmet> because it looks grat and realistic, but also heavy; but also great for testing environment maps; we also have white torus knot, also nice for testing environment maps; and also loded draco compewssed model I built in blender just to see how it's going to look with different env map settings; we also have floor (will be hidden and probably not going to use it at all but it is there) and we have torus knot which we will change metalness and roughness and observe how environment map lighting affects it.

All environment map settings we explored from previous lessons are also there.

## Namera / Intent

To gain knowledge about environment map and it's settings by using HDRI Equirectangular environment map we built in blender. And explain the process we did in blender to make environment map.

## Šta treba objasniti u detalje

- we use this when HDR environment maps from <https://polyhaven.com/> aren't enough for our use case, because sometimes we need to create a very specific environment map; blender is perfect tool for that

- Render property -> we used cycles for this
  - sampling: used 256 max samples both for viewport and rendering; and using denoise only for rendering. You tell me what would be optimal things to be set up in case of my machine:
  ```
  OS: Fedora Linux 44 (Workstation Edition) x86_64
  Host: Aspire A315-44P (V1.02)
  Kernel: Linux 7.2.4-200.fc44.x86_64
  Uptime: 43 mins
  Packages: 3 (appimage), 9 (flatpak), 2135 (rpm)
  Shell: bash 5.3.9
  Display (HKC3D00): 1280x720 in 15", 60 Hz [Built-in]
  Display (Samsung Electric Company 20"): 1680x1050 in 20", 60 Hz [External] *
  DE: GNOME 50.4
  WM: Mutter (Wayland)
  WM Theme: Adwaita
  Theme: Adwaita [GTK2/3/4]
  Icons: Adwaita [GTK2/3/4]
  Font: Adwaita Sans (11pt) [GTK2/3/4]
  Cursor: Adwaita (24px)
  Terminal: kitty 0.47.1
  Terminal Font: FiraCodeNF-Reg (11pt)
  CPU: AMD Ryzen 7 5700U (16) @ 4.37 GHz
  GPU: AMD Lucienne [Integrated]
  Memory: 4.59 GiB / 14.95 GiB (31%)
  Swap: 0 B / 8.00 GiB (0%)
  Disk (/): 99.39 GiB / 474.35 GiB (21%) - btrfs
  Battery (AP23A5L): 100% [AC Connected]
  Locale: en_US.UTF-8
  ```

- World property -> Surface -> background
  - change Color, just tweak Value field of HSV; just move right vertical slider all the way down and everything will be black (Value — essentially brightness/luminance; we want complete black) (Sliding it to the bottom drops Value to 0, which is why you get pure black regardless of what hue/saturation you had set — a color with Value = 0 is always black, since Value represents how much light/brightness the color has.); we don't want some kind of uniform color on the scene like red, we want nothing for start

- Output -> Format -> Resolution
  - change to 2048 x 1024 (why we need 2:1 aspect, is it required or good practice?); I heard that I need this if I would want to use env map in other software also besides three.js

- We then proceed to remove default cube, camera and light, and create bunch of objects in the scene and move them, sacle them and rotate them; this is just for testing purpose

- We will add camere since we removed previous one; but also set it's position to (0,0,0) and also rotation to (90,0,0) so it wil point to y positive (Is this required?)
  - Our camera -> Data (Object Data properties) -> Lens
    - Type set it to `Panoramic`
    - Panorama Type to `Equirectangular`
  Don't expect to be able to see a preview of the panoramic view in the viewport, since you can see this projection only when rendering; so if you press zero, you will still see just maybe object in front of the lense (Is this still true; is there a way to se preview in modern blender 5.2 I'm using?)

- We will add first light; an area light (From my experience with blender I assume this represent the sun); we can move it and rotate it in some direction in order to decide where shadows would fall? Am I right? I directed it's direction to the center of the scene apoximatly. We can also make it bigger by pulling rectangle (rectangle is default), which will change size in Object Data properties
  - Data -> change Power to 1000W for example because 10W isnot enough
  - We can preview our light by going into render mode (shortcut Z)
  
- We want to be able to see the light; our to be precise our camera to see the light; we are not talking about viewport; So we make it visible
  - Our Area Light -> Object ->  Ray Visibility; make sure you check the Camera ; which will make this object (a light) visible to a camera

- After all this settings we made we can do first render just to test it (we don't have beutiful mountains and roads and woods but this is good enough to test the result)
  - We do this with `F12` (on my laptop `fn` + `F12`); and after some time (I assume because of cycles) image will complete rendering and we have visual insight when will that happen
  - after rendering you can save hdri by going to Image (top left) and press `Save as` (or do `Alt` + `S`) and in dialog you can select other format than png which is defaul; **we selech .hdr (Radiance HDR)**
  - for the name I chosen `blender-one-2K.hdr` (I guess resolution we picked earlier is 2K)
  - now you can load it in your app and test it how it looks

- Studio lighting
  - we could create a full scene with cool effects, buildings, planets, etc. but it would take quite a long time; So we are going to create studio setup for our second environment map we are going to generate with blender
  - we are deleting everything from our scene (all objects), just leaving area light we built; and the camera
  - what we want to do is to have three lights; one bright white, red one behind; and blue one on the other side (just duplicete white one couple of times, move them and change thir color); red one can be on the floor (0.1 by z for example); blue can be moved to be more from bellow
  - I also lowered the power for these color lights, one is 500W, other 300W
  - we can render it after that same way we did for previous env map
  - you can change color and power if you don't like the result, I created third one where all lights had power 1000W, and this one looked ok, since the previous one was too dim
