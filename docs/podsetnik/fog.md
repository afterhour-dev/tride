More up to date alternative: switch purely to WebGPU's Node/material pipeline (scene.fogNode, Nodes.FogNode) — already-available in the same renderer and more flexible for shader-level fog tuning. Keep the classic scene.fog carpet behavior for simple scenes; the Node versions let you bind nearColor, fogDensity, and useNoise directly.

see:
docs/glavno/threejs/lessons/a_project-2.md