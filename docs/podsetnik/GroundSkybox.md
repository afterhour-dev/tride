# Problem je resen u `apps/19_4_ground_projected_env_map`, ali ovo je dobar info AI i zato ga ostavljam ovde, procitaj ovo jednom da razumes bolj, i isto tako mozes da dodas ovo konacnim docs-ima

Looking at your actual code, the bug is the camera's far clipping plane:

```typescript
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100,   // <-- far plane
);
```

and

```typescript
const skyboxRadius = 100;
```

Your `camera.far` and `skyboxRadius` are both `100`. That's the problem.

### Why this causes exactly what you're seeing parts of black orb

`GroundedSkybox` isn't centered on the camera — it's a sphere of radius 100 sitting around the world origin area (you nudged it up with `skybox.position.y = skyboxHeight`). Your camera orbits around `(0,0,0)` at a distance of roughly 14–15 units, well *inside* that sphere. But the far side of the dome, from the camera's point of view, is much farther away than the radius alone — it's roughly `radius + distance from camera to sphere center`, which can easily approach ~110–115 units depending on where you're orbiting.

Since your far plane is clipped at exactly `100`, anything on the dome beyond that distance simply isn't rendered at all. And because you set:

```typescript
renderer.setClearColor(0x000000, 1);
```

...the clear color is pure black. So wherever the dome gets clipped by the far plane, you see straight through to that black clear color — which reads as a "black orb" eating into the sky. As you orbit/zoom, the geometry that falls beyond the far plane changes, so the black patch grows and shrinks and moves around, including up near the top of the dome (the part typically farthest from the camera at low angles).

### Fix

Give yourself real headroom between the far plane and the skybox radius:

```typescript
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	300, // comfortably larger than skyboxRadius
);
```

You can keep `skyboxRadius = 100` as-is, or bump both up together — what matters is `camera.far` being meaningfully larger than `skyboxRadius`, not equal to it.

While you're at it, it's still worth clamping `orbitControls.maxDistance` to something less than `skyboxRadius` (e.g. `orbitControls.maxDistance = 80`), so a user can never dolly the camera itself outside the dome — that's a separate failure mode from the one you're hitting now, but it'll bite you later if you don't cap it.