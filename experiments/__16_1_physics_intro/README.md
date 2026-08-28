# Physics app intro (IRRELEVANT NOT GOINF TO COMPLETE IT SINCE IT USES Cannon.js and not Rapier)

App in which we explore physics by using physics library in Three.js. We are using Cannon.

Continuation in next app/lesson

## Namera / Intent

Learning how to use physics with three.js

## Šta treba objasniti u detalje

- if you want realistic physics with tension, friction, bouncing, constraints, pivots, etc. It is better to use library tah anything else

- Theory
  - we create a physics world
  - we create Three.js world
  - when we add an object to the threejs world, we also add one in the physics world
  - on each frame we let the physics world update itself and we update the three.js

- the hard part is to organize the code
- Libraries (There are many of them and we need to decide if we want a 2D library or a 2D library; some 3d interactions might be reduced to 2dphysics (pool game, oinball))
  - 3D (tell me which one is the most popular right now and best; if ones popular than these are not on the list you suggest them to me)
    - Ammo.js (Suggested in one workshop as a most used library but what I saw it is also not much maintained)
    - Cannon.js (in this app we are using this one because as one workshop author mentioned it is easier to implement and understand, I also see from their github that it wasn't updated for 11 years)
    - Oimo.js
  - 2D (tell me which one is the most popular right now and best; if ones popular than these are not on the list you suggest them to me)
    - Matter.js
    - P2.js
    - Planck.js
    - Box2D.js
- by googling I found out about rapier. So I'm going to look it up in future projects, but for this current app we will be using Cannon.js
  ```bash
  pnpm --filter @td/physics-intro add cannon
  pnpm --filter @td/physics-intro add @types/cannon -D
  ```

## Šta samo ukratko pomenuti

- also you can create your own pshysics with some mathematics and solutions like raycaster (for example you can move ball initiated by raycaster and then calculate where is te wall mesh and then move ball from the wall like it bounced, but this is a lot of work)
- There are solutions trying to combine Three.js with physics library like Physijs which we won't use (But should we use it, is it popular right now or good?)


## is rapier api too much different than cannon?

Yes, meaningfully different — Rapier isn't a drop-in replacement for Cannon/cannon-es. The conceptual model (rigid bodies, colliders, world stepping, gravity) is the same across all physics engines, but the API shape and philosophy differ in a few key ways:

**Body/collider separation**
Cannon merges shape and body into one object — a `CANNON.Body` has `.addShape(shape)` and mass/position live directly on it. Rapier splits this into two distinct steps: you create a `RigidBody` via a `RigidBodyDesc`, then attach one or more `Collider`s to it via `ColliderDesc`. This is closer to how Bullet/PhysX work, and it's arguably cleaner, but it means more boilerplate for simple objects.

**Builder/descriptor pattern**
Rapier leans heavily on chained descriptor objects:
```js
RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0).setLinearDamping(0.1)
```
Cannon is more direct property assignment:
```js
new CANNON.Body({ mass: 1, position: new CANNON.Vec3(0, 5, 0) })
```

**Reading state back**
Cannon exposes `.position` and `.quaternion` as live Vec3/Quaternion objects you can read/mutate directly (and they're already compatible-ish with Three.js's Vector3/Quaternion in spirit). Rapier's `body.translation()` and `body.rotation()` return plain `{x,y,z}` / `{x,y,z,w}` objects each call — not the same live-reference object, no built-in Three.js interop, so you always do `mesh.position.set(pos.x, pos.y, pos.z)`.

**Async init**
Cannon/cannon-es is pure JS, so `new CANNON.World()` works synchronously immediately. Rapier is WASM-backed, so you must `await RAPIER.init()` before touching anything — an async step Cannon doesn't need.

**Stepping**
Both use `world.step(dt)` (Cannon) / `world.step()` (Rapier, fixed internal timestep by default) — this part is conceptually similar.

**Performance/features**
Rapier is faster (WASM, more robust solver) and has more built-in features (better joints, character controllers, CCD, deterministic mode). Cannon-es is simpler and lighter if you don't need that.

**Practical takeaway:** if you're porting an existing Cannon-based project, expect to rewrite the physics setup code, not just swap import names — collider creation, body creation, and reading transforms back all need adjusting. But the mental model transfers fine, so the rewrite is mechanical rather than a redesign. If you're starting fresh, I'd just start directly in Rapier's API rather than learning Cannon first.