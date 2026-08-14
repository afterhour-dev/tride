what is updates since 0423? See this lessons: I already did?

```
0_0_vite_starter                       10_5_MeshLambertMaterial            12_4_point_light         4_4_camera_move               7_6_gui_options
0_1_vite_webgpu_starter                10_6_Mesh_Phong_Material            2_1_transform_position   4_5_camera_move_circular      7_7_folder_gui
10_0_materials_pepare                  10_7_MeshToonMaterial               2_2_transform_rotation   4_7_camera_controls           7_8_gui_parameters
10_10_MeshStandardMaterial_part_three  10_8_MeshStandardMaterial_part_one  2_3_transforms_scale     5_0_resize_and_full_screen    8_0_textures
10_11_0_MeshPhysicalMaterial           10_9_MeshStandardMaterial_part_two  2_4_transform_group      6_0_geometries                8_1_textures_uv_unwrapping
10_11_1_clearcoat                      1_0_starter                         3_1_primitive_animation  6_1_buffer_geometry           8_2_texture_transforming
10_11_2_sheen                          11_1_text_one                       3_2_animation_clock      6_2_random_buffer_geometries  8_3_filtering_and_mipmapping
10_11_3_iridescence                    11_2_text_center                    3_3_animation_timer      7_0_debug_ui                  8_4_format_and_optimisation
10_11_4_transmission                   11_3_text_matcap                    3_4_animation_gsap       7_1_gui_range                 9_0_milestone_starter
10_1_MeshBasicMaterial                 12_0_lights_setup                   3_5_animation_starter    7_2_gui_checkbox              try
10_2_MeshNormalMaterial                12_1_ambient_light                  4_1_camera_ortho         7_3_gui_color
10_3_MeshMatcapMaterial                12_2_directional_light              4_2_camera_perspective   7_4_gui_geometry_tweak
10_4_MeshDepthMaterial                 12_3_hemisphere_light               4_3_camera_mousemove     7_5_gui_button
```

currently I 'm dealing with lights, than I will go to shadows, particles, scroll based animation, physics, importing models, raycaster and mouse events, custom models with blender, environment maps in detail, realistic rendering. These are the topics I'm going to complete before going to shaders? So is it safe for me to use 0423 and go back to 0731 when I get to shaders?

## Answer

That's a smart split, and largely safe — here's why, mapped to your actual roadmap.

**Your remaining pre-shader topics are mostly stable, mature APIs:**
- Lights, shadows, particles (via `Points`/`BufferGeometry`), scroll-based animation, raycaster/mouse events, model importing (GLTF), Blender workflow, environment maps — this is all classic three.js scene-graph API that's been stable for years. Nothing in the searches above suggests breaking changes here since April 2026. 0423 should be reliable for all of it.
- One soft caveat: **particles** can brush up against compute shaders if you go beyond basic point clouds later (GPU-driven particle systems are one of the areas WebGPU/TSL changed most). But standard `Points`-based particle systems in the classic curriculum don't need that — you'd only hit it if you deliberately go into GPU compute particles, which usually comes later as a separate advanced topic anyway.
- **Physics** and **realistic rendering** (tone mapping, PBR materials, etc.) are also stable — the physics libraries (Rapier/Cannon) and PBR material APIs haven't had disruptive breaking changes in that window.

**What's actually changed since April 2026 (0423's cutoff), concentrated almost entirely in the shader/WebGPU area:**
- `RenderPipeline` — a newer node-graph-based post-processing system for `WebGPURenderer`, positioned as the eventual replacement for the classic `EffectComposer`/pass-chain approach. This came out after 0423's cutoff.
- Continued TSL (Three Shader Language) expansion — more node functions, tighter WGSL/GLSL parity, and it's increasingly the recommended way to write shaders instead of raw GLSL strings.
- MRT (multiple render targets) support tied into `RenderPipeline` for combining color/normal passes in one draw.
- Broader WebGPU browser support solidifying (Safari 26 shipped it), which mostly matters for "is it safe to ship" advice rather than API specifics.

**So: yes, your plan is sound.** Stay on 0423 through lights → shadows → particles → scroll animation → physics → model importing → Blender → environment maps → realistic rendering. Switch to 0731 (or better, feed it current docs) once you hit shaders, since that's precisely where TSL, `RenderPipeline`, and WebGPU-specific patterns live — and that's also where being taught something outdated would hurt most, since shaders are the part where mental models are hardest to unlearn later.