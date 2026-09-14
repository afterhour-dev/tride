# Environment maps - HDRI Equirectangular environment map made in blender and loaded in this app

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
  - Camera -> Object ->  
  

## Šta samo ukratko pomenuti
