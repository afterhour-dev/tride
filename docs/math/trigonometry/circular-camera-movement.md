---
title: circular-camera-movement
date: 2026-07-29
topic: trigonometry
difficulty: beginner
app_path: apps/4_camera_move_circular
---

## The Problem

You see this code in the animation loop and want to understand *what it does visually* — not just that it "moves the camera in a circle," but *how* and *why* sin and cos cooperate to produce that circle:

```ts
camera.position.x = Math.sin(Math.PI * cursor.x * 2) * 2.5;
camera.position.z = Math.cos(Math.PI * cursor.x * 2) * 2.5;
```

And you want to get better at "seeing" what math equations will produce before running the code — building an intuition for how numbers become motion.

## Intuition

Imagine you are standing at the center of a round room, holding a rope that is tied to the wall at shoulder height. If you walk forward while keeping the rope taut, you trace a circle on the floor.

Now imagine the rope has two "shadows":

- one shadow falls on the wall to your **left/right** (the **x** axis)
- one shadow falls on the wall **in front/behind** you (the **z** axis)

When you are at the very front of the circle, the left/right shadow is **zero** (you are dead center), and the front/back shadow is at its **maximum** (you are all the way forward).

As you walk along the circle to the right, the left/right shadow **grows**, and the front/back shadow **shrinks**. At the far-right point, the left/right shadow is at its maximum and the front/back shadow is zero again.

This is exactly what `sin` and `cos` do:

- `sin` starts at **zero**, grows to a **maximum**, and comes back — like the left/right shadow
- `cos` starts at a **maximum**, shrinks to **zero**, and comes back — like the front/back shadow

When you give sin and cos **the same angle**, they trace out a perfect circle together — one handles the horizontal shadow, the other handles the depth shadow. They are out of phase by exactly the right amount to keep you on the circle.

The number inside sin/cos is the **angle** — the "how far around the circle" value. The number multiplied **outside** is the **radius** — the "how big the circle" value.

## Step by Step

### Step 1 — What is `cursor.x`?

The mouse handler normalizes the cursor to the range `[-0.5, 0.5]`:

```ts
cursor.x = ev.clientX / sizes.width - 0.5;
```

- Far left of the window → `cursor.x = -0.5`
- Center of the window → `cursor.x = 0`
- Far right of the window → `cursor.x = 0.5`

### Step 2 — Convert cursor position to an angle

The code computes an angle from `cursor.x`:

$$
\theta = \pi \cdot \text{cursor.x} \cdot 2
$$
$$
= 2\pi \cdot \text{cursor.x}
$$

Now evaluate at the three key positions:

$$
\text{cursor.x} = -0.5 \implies \theta = 2\pi \cdot (-0.5) = -\pi
$$

$$
\text{cursor.x} = 0 \implies \theta = 2\pi \cdot 0 = 0
$$

$$
\text{cursor.x} = 0.5 \implies \theta = 2\pi \cdot 0.5 = \pi
$$

So as the mouse sweeps from left to right, $\theta$ sweeps from $-\pi$ to $\pi$ — that is a **full $360°$** of rotation. The `* 2` in the code is what makes a full circle instead of only half.

### Step 3 — sin and cos map angle to coordinates

With radius $r = 2.5$:

$$
x = \sin(\theta) \cdot r
$$

$$
z = \cos(\theta) \cdot r
$$

Plug in the three key angles:

**Far left** ($\theta = -\pi$):

$$
x = \sin(-\pi) \cdot 2.5 = 0 \cdot 2.5 = 0
$$

$$
z = \cos(-\pi) \cdot 2.5 = (-1) \cdot 2.5 = -2.5
$$

Camera is at $(0, \; y, \; -2.5)$ — directly **behind** the mesh.

**Center** ($\theta = 0$):

$$
x = \sin(0) \cdot 2.5 = 0 \cdot 2.5 = 0
$$

$$
z = \cos(0) \cdot 2.5 = 1 \cdot 2.5 = 2.5
$$

Camera is at $(0, \; y, \; 2.5)$ — directly **in front of** the mesh.

**Far right** ($\theta = \pi$):

$$
x = \sin(\pi) \cdot 2.5 = 0 \cdot 2.5 = 0
$$

$$
z = \cos(\pi) \cdot 2.5 = (-1) \cdot 2.5 = -2.5
$$

Camera is back at $(0, \; y, \; -2.5)$ — behind the mesh again.

In between, at the quarter points ($\theta = \frac{\pi}{2}$ and $\theta = -\frac{\pi}{2}$):

$$
x = \sin\!\left(\frac{\pi}{2}\right) \cdot 2.5 = 1 \cdot 2.5 = 2.5
$$

$$
z = \cos\!\left(\frac{\pi}{2}\right) \cdot 2.5 = 0 \cdot 2.5 = 0
$$

Camera is at $(2.5, \; y, \; 0)$ — to the **right** of the mesh.

### Step 4 — Why does this produce a circle?

At every angle $\theta$, the Pythagorean identity holds:

$$
\sin^2(\theta) + \cos^2(\theta) = 1
$$

Multiply both sides by $r^2$:

$$
(\sin(\theta) \cdot r)^2 + (\cos(\theta) \cdot r)^2 = r^2
$$

$$
x^2 + z^2 = r^2
$$

This is the equation of a circle of radius $r$ centered at the origin. The camera is constrained to this circle in the x-z plane. The only way to be at a point where $x^2 + z^2 = r^2$ is to be on the circle — so sin and cos together guarantee circular motion.

### Step 5 — Why sin for x and cos for z (not the other way)?

Both orderings produce a circle — it just rotates which point on the circle corresponds to $\theta = 0$:

- `x = cos(θ), z = sin(θ)` → camera starts at $(r, 0)$ when $\theta = 0$
- `x = sin(θ), z = cos(θ)` → camera starts at $(0, r)$ when $\theta = 0$

The code uses the second form, which places the camera in front of the mesh at the center position ($z = 2.5$, looking toward the origin). Either way the path is circular — it is just a different starting point on the circle.

### Step 6 — What `camera.lookAt()` adds

```ts
camera.lookAt(mesh.position);
```

Without this, the camera would orbit in a circle but always face the same direction (like a satellite that never rotates). `lookAt` rotates the camera so its lens always points at the mesh — this is why you see the mesh from different angles as the camera moves.

## In Three.js / Shaders

The exact pattern from this app:

```ts
// cursor.x ranges from -0.5 to 0.5
// angle sweeps from -π to π (a full circle)
const angle = Math.PI * cursor.x * 2;

camera.position.x = Math.sin(angle) * 2.5;   // left/right
camera.position.z = Math.cos(angle) * 2.5;   // front/back
camera.position.y = cursor.y * 0.9;           // up/down (independent)

camera.lookAt(mesh.position);                 // always face the target
```

This same sin/cos pattern appears everywhere in Three.js and shaders:

- **Orbit controls** — `OrbitControls` uses sin/cos internally to rotate the camera around a target
- **Point lights on a path** — move a light in a circle: `light.position.x = Math.sin(t) * r; light.position.z = Math.cos(t) * r;`
- **GLSL vertex shaders** — rotating vertices: `vec2 rotated = vec2(cos(a) * p.x - sin(a) * p.y, sin(a) * p.x + cos(a) * p.y);`

The general form is always the same: **one trig function for one axis, the other for the perpendicular axis, same angle, same radius**.

## Visual Helper

### GeoGebra — interactive circle visualization

[Open in GeoGebra](https://www.geogebra.org/calculator/wjnqhkvb)

This visualization shows:
- A circle of radius 2.5 (the camera's path)
- A slider **t** from −0.5 to 0.5 (representing `cursor.x`)
- A point **P** on the circle at angle $2\pi t$ (the camera position)
- The x and z components drawn as colored segments

Drag the slider and watch the point trace the circle — this is exactly what happens as you move your mouse left to right.

### 3Blue1Brown

The visual intuition for why sin and cos trace a circle is covered beautifully in:

- [3Blue1Brown — Trigonometry](https://www.youtube.com/watch?v=IxXfii9NBrg) — unit circle and the relationship between sin, cos, and circular motion
- [3Blue1Brown — Essence of trigonometry](https://www.youtube.com/watch?v=p_Lan6VXyfg) — deeper look at how sin and cos are defined from the circle

## Revisit

To solidify this concept, try these exercises:

1. **Change the radius** — replace `2.5` with `5` and `1` in the code. Watch how the circle gets bigger and smaller. The radius is purely the number outside sin/cos.
2. **Remove the `* 2`** — now `cursor.x` maps from $-\frac{\pi}{2}$ to $\frac{\pi}{2}$, which is only a half circle. The camera sweeps back and forth in an arc instead of going all the way around.
3. **Swap sin and cos** — put `cos` on x and `sin` on z. The circle is the same shape but the starting position changes (camera starts to the right instead of in front).
4. **Add a second mesh** at a different position and make the camera lookAt it — the circle stays the same, but the viewing angle changes.
5. **Practice predicting** — before running the code, write down what `sin(θ) * 3` and `cos(θ) * 3` produce at $\theta = 0$, $\frac{\pi}{4}$, $\frac{\pi}{2}$, $\pi$. Then run it and check.

## Links & Resources

### Docs

- [Three.js — Camera](https://threejs.org/docs/#api/en/cameras/Camera)
- [Three.js — PerspectiveCamera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera)
- [MDN — Math.sin()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin)
- [MDN — Math.cos()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cos)

### Examples

- [Three.js — Interactive Circles](https://threejs.org/examples/#webgl_interactive_circles)
- [Three.js — Geometry — Shapes](https://threejs.org/examples/#webgl_geometry_shapes)

### Tools

- [GeoGebra — Interactive Graphing Calculator](https://www.geogebra.org/calculator)
- [Desmos — Graphing Calculator](https://www.desmos.com/calculator)

### Articles

- 🤖 suggested [Wikipedia — Trigonometric functions](https://en.wikipedia.org/wiki/Trigonometric_functions)
- 🤖 suggested [Wikipedia — Unit circle](https://en.wikipedia.org/wiki/Unit_circle)

### Videos

- [3Blue1Brown — Trigonometry](https://www.youtube.com/watch?v=IxXfii9NBrg)
- [3Blue1Brown — Essence of trigonometry](https://www.youtube.com/watch?v=p_Lan6VXyfg)

### Courses & Talks

- 🤖 suggested [Khan Academy — Trigonometry](https://www.khanacademy.org/math/trigonometry)

### Repos

- [mrdoob/three.js](https://github.com/mrdoob/three.js)

### Other

- 🤖 suggested [ShaderToy — Circle examples](https://www.shadertoy.com/results?query=circle)
