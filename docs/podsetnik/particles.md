## sizeAttenuation i WebGPU particles

Ovo nije tvoja greška u kodu — to je poznat, trenutno otvoren problem. Kad WebGPURenderer koristi materijale, on ih interno konvertuje u **node materijale** (PointsNodeMaterial / SpriteNodeMaterial), a stari fiksni shader kod koji je radio `sizeAttenuation` za `PointsMaterial`/`SpriteMaterial` još uvek nije u potpunosti prenet u taj sistem. Postoji otvoren GitHub issue (mrdoob/three.js #29269) baš na tu temu, i čak postoji predlog (#31630) da se `sizeAttenuation` potpuno zameni novim `sizeUnits` API-jem koji bi radio identično na oba rendererа (WebGL i WebGPU).

Dakle:

- Nisi propustio neku očiglednu opciju — trenutno *moraš* da prođeš kroz TSL da bi ručno implementirao attenuation na WebGPU-u. Nešto kao:

```js
import { uniform, cameraPosition, positionWorld, length, div } from 'three/tsl';

const baseSize = uniform(20);
const dist = length(positionWorld.sub(cameraPosition));
material.sizeNode = div(baseSize, dist); // grubo, treba tweakovati faktor
```

- Sprites nisu "napušten" pristup — i dalje su validni i za WebGPU, ali imaju isti problem (attenuation nije ugrađen u SpriteNodeMaterial).
- Stari `PointsMaterial`/`SpriteMaterial` i dalje rade sa WebGPURenderer-om (auto-konvertuju se), ali baš zbog ove praznine, fine kontrole poput ove trenutno idu isključivo preko TSL node-ova.

Što se tiče tvoje odluke — mislim da je razumno da **ne preskačeš particles potpuno**, već da:
1. Prvo uradiš osnovne particle vežbe sa `PointsMaterial` bez `sizeAttenuation` (fiksna veličina, prihvati to kao privremeno ograničenje) — i dalje učiš geometriju/buffer atribute/animaciju, što je najveći deo tutorijala.
2. Paralelno ili odmah posle, uđeš u TSL osnove (uniform, node kompozicija, `Fn()`), jer ćeš to ionako morati za bilo šta ozbiljnije na WebGPU-u (materijali, custom shaderi, GPU compute).
3. Onda se vratiš i doradiš iste particle vežbe sa `sizeNode` kad TSL sedne.

To ti štedi vreme jer ne moraš da čekaš "savršeno" znanje TSL-a pre nego što nastaviš tutorijal, ali priznaješ da je fine-tuning particles trenutno TSL posao, ne WebGL-legacy posao.

***
***
***
***

# More

Found it — this is a genuine WebGPU limitation, not something wrong in your code.

**Why it happens:** WebGPU's `point-list` primitive topology only supports a fixed 1-pixel point size at the hardware level — there's no equivalent of WebGL's `gl_PointSize`. So when three.js's `WebGPURenderer` draws a `THREE.Points` object, `size` and `sizeAttenuation` on `PointsMaterial` (or `PointsNodeMaterial`) are simply ignored on the WebGPU backend — every point renders as one pixel regardless of distance. This is confirmed directly in the three.js docs for `PointsNodeMaterial`: since WebGPU only supports point primitives with a pixel size of 1, it's not possible to define a size when rendering with Points.

**The fix:** three.js works around this by letting you render your "points" as instanced billboarded quads (sprites) instead of true GPU points. When you do that, size and size attenuation are fully honored: by rendering point primitives with Sprites, size is honored, via PointsNodeMaterial's sizeNode.

Concretely, that means swapping `THREE.Points` for `THREE.Sprite` with `PointsNodeMaterial`, driven by an instanced position attribute:

```ts
import { instancedBufferAttribute } from 'three/tsl';

const positionAttribute = particlesGeometry.getAttribute('position');

const particlesMaterial = new THREE.PointsNodeMaterial({
	positionNode: instancedBufferAttribute(positionAttribute),
});
particlesMaterial.sizeNode = THREE.uniform(0.02); // or your own TSL size node

const particles = new THREE.Sprite(particlesMaterial);
particles.count = positionAttribute.count; // treated as instanced
scene.add(particles);
```

This uses instancing under the hood (each particle is a billboarded quad), so it naturally respects perspective distance the way `sizeAttenuation` used to.

A simpler alternative some people use instead of chasing this API: just build the particles as an `InstancedMesh` of tiny planes/spheres with a soft radial-gradient sprite texture — same visual result, and you have full manual control over per-particle scale (e.g. `scale = baseSize / distanceToCamera`), no reliance on the material's built-in attenuation at all.

One more note: this part of the WebGPU renderer/TSL API has been actively changing (there's an open proposal to replace `sizeAttenuation` with a `sizeUnits` property entirely), so if you pin a specific three.js version, it's worth checking that version's `PointsNodeMaterial` docs for the exact current API before committing to the sprite-instancing pattern above.