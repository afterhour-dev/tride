
# Moving from GLSL to TSL

TSL (or Three.js Shading Language) was designed to be extremely familiar to anybody who has worked with shaders before. If you can write shaders in GLSL, you'll probably find the jump to TSL to be pretty minimal.

Most things are the same, barring slightly different ways of writing the shader itself.

Since TSL is essentially declaring a shader using JavaScript, the syntax may look a little strange at times. TSL has to work around the constraints of the language. The underlying shader that TSL constructs will still run on the GPU.

You can use this page as a reference alongside the exercises. There's nothing critical to memorise here, just a quick overview of how to move from GLSL to TSL.

## A quick example

Here's an example of blending between 2 colours using the horizontal UV coordinate. Left is zero, right is one.

We're just looking at the colour calculation here, so I've left out the renderer, camera and mesh setup. The GLSL version assumes the vertex shader passes the UVs into `vUv`. For the TSL version, we're using `MeshBasicNodeMaterial` with Three.js's `WebGPURenderer`.

### GLSL

```glsl
varying vec2 vUv;

// Linear RGB values, shared by both versions.
const vec3 LEFT_COLOUR = vec3(0.05, 0.2, 0.6);
const vec3 RIGHT_COLOUR = vec3(0.8, 0.3, 0.1);

void main() {
  vec3 colour = mix(
    LEFT_COLOUR,
    RIGHT_COLOUR,
    vUv.x
  );

  gl_FragColor = vec4(colour, 1.0);
}
```

### TSL

```js
import { MeshBasicNodeMaterial } from 'three/webgpu';
import { mix, uv, vec3 } from 'three/tsl';

// Linear RGB values, shared by both versions.
const LEFT_COLOUR = vec3(0.05, 0.2, 0.6);
const RIGHT_COLOUR = vec3(0.8, 0.3, 0.1);

const colour = mix(
  LEFT_COLOUR,
  RIGHT_COLOUR,
  uv().x
);

const material = new MeshBasicNodeMaterial();
material.colorNode = colour;
```

You can see from these 2 examples that, in a lot of ways, they're very similar. On the left, you have the standard GLSL code that you'd write throughout the course. On the right, nearly identical TSL code except for a few things:

- We must import the shader operations from somewhere, typically `three/tsl`.
- There are no type declarations on the variables, since this is JavaScript code. We still use things like `vec3()` to construct shader values of the appropriate type.
- We use `uv()` to get the interpolated UVs, rather than declaring `vUv` ourselves.
- At the end, we assign the colour to a `MeshBasicNodeMaterial`. That's just showing how we connect the shader code to a material in Three.js. In the exercises, this part is usually already supplied for you.

One small detail: these examples calculate linear RGB colours. A complete GLSL material also needs the appropriate output colour-space conversion to match the node material on screen. Three.js handles that for the node material, so we don't need to add another gamma conversion to the TSL code.

You'll also see the exercises supply a `TSL` object rather than a list of imports. `TSL.mix(...)` is the same function as the imported `mix(...)` above. You can just work on the requested section without adding the imports or creating another material.

## Arithmetic

This is probably the most noticeable difference. JavaScript doesn't let us overload operators like `+` and `*` for shader nodes, so we have to write those operations as method calls instead. If you're working with ordinary JavaScript numbers, you can still use ordinary arithmetic.

|Operation|GLSL|TSL|
|---|---|---|
|Add|`a + b`|`a.add(b)`|
|Subtract|`a - b`|`a.sub(b)`|
|Multiply|`a * b`|`a.mul(b)`|
|Divide|`a / b`|`a.div(b)`|
|Negate|`-a`|`a.negate()`|
|Group operations|`(a + b) * c`|`a.add(b).mul(c)`|
|Multiply before adding|`a + b * c`|`a.add(b.mul(c))`|

Here, `a`, `b` and `c` are shader values rather than plain JavaScript numbers. You can chain the operations together, but the order matters. `a.add(b).mul(c)` adds first, then multiplies. If you want the multiplication to happen first, you'd write `a.add(b.mul(c))`.

## Adding some animation

Here's a slightly more involved example. We'll repeat a sine wave across the UVs and animate it, then use the result to blend between 2 colours. Both versions use the same frequency, speed and colours, so you can compare the calculations directly.

### GLSL

```glsl
varying vec2 vUv;

// Updated by the application, in seconds.
uniform float uTime;

// Radians across the horizontal UV range.
const float frequency = 24.0;

// Radians per second.
const float speed = 1.5;

const vec3 DARK_COLOUR = vec3(0.02, 0.08, 0.2);
const vec3 LIGHT_COLOUR = vec3(0.1, 0.7, 0.6);

void main() {
  float phase = vUv.x * frequency - uTime * speed;

  // Convert the signed wave into a 0–1 blend.
  float blend = sin(phase) * 0.5 + 0.5;

  vec3 colour = mix(
    DARK_COLOUR,
    LIGHT_COLOUR,
    blend
  );

  gl_FragColor = vec4(colour, 1.0);
}
```

### TSL

```js
import { MeshBasicNodeMaterial } from 'three/webgpu';
import { mix, sin, time, uv, vec3 } from 'three/tsl';

// Radians across the horizontal UV range.
const frequency = 24.0;

// Radians per second.
const speed = 1.5;

const DARK_COLOUR = vec3(0.02, 0.08, 0.2);
const LIGHT_COLOUR = vec3(0.1, 0.7, 0.6);

// Three.js updates time in seconds for us.
const phase = uv().x.mul(frequency)
  .sub(time.mul(speed));

// Convert the signed wave into a 0–1 blend.
const blend = sin(phase).mul(0.5).add(0.5);

const colour = mix(
  DARK_COLOUR,
  LIGHT_COLOUR,
  blend
);

const material = new MeshBasicNodeMaterial();
material.colorNode = colour;
```

You might wonder why we're using `const phase` for something that changes over time. In the JavaScript code, `phase` refers to the shader expression we've constructed, not its current result. The GPU still evaluates that expression using the current time and each pixel's UVs.

If you wanted more repetitions, you could change the frequency to `48.0`. To run the pattern vertically, you'd change `uv().x` to `uv().y`. It's the same idea as changing `vUv.x` to `vUv.y` in GLSL.

## Common operations

Here's a quick comparison of some common operations. For these smaller snippets, assume we've imported the TSL functions from `three/tsl`, or are accessing them through the exercise's `TSL` object. Values like `a`, `normal` and `direction` are shader nodes on the TSL side.

|What you want|GLSL|TSL|
|---|---|---|
|Scalar shader value|`float a = 0.5;`|`const a = float(0.5);`|
|Construct a vector|`vec3(1.0, 0.5, 0.0)`|`vec3(1.0, 0.5, 0.0)`|
|Read components|`colour.rgb`|`colour.rgb`|
|Reorder components|`p.yx`|`p.yx`|
|Sine / cosine|`sin(a)` / `cos(a)`|`sin(a)` / `cos(a)`|
|Clamp|`clamp(a, 0.0, 1.0)`|`clamp(a, 0.0, 1.0)`|
|Repeat a value|`fract(a)`|`fract(a)`|
|Absolute value|`abs(a)`|`abs(a)`|
|Raise to a power|`pow(a, 2.0)`|`pow(a, 2.0)`|
|Blend|`mix(a, b, t)`|`mix(a, b, t)`|
|Hard threshold|`step(0.5, a)`|`step(0.5, a)`|
|Smooth threshold|`smoothstep(0.2, 0.8, a)`|`smoothstep(0.2, 0.8, a)`|
|Normalise|`normalize(direction)`|`normalize(direction)`|
|Dot / cross product|`dot(a, b)` / `cross(a, b)`|`dot(a, b)` / `cross(a, b)`|
|Vector length|`length(direction)`|`length(direction)`|
|Reflect|`reflect(direction, normal)`|`reflect(direction, normal)`|

As you can see, most of these are identical. We need the method calls for arithmetic, but functions like `mix`, `smoothstep` and `normalize` can look exactly like their GLSL equivalents.

## Textures and uniforms

Sampling a texture is very similar as well. The main difference is how we supply the texture: GLSL uses a sampler uniform, while TSL takes a Three.js texture object that we've already loaded. The UV coordinates work the same way.

### GLSL

```glsl
uniform sampler2D colourMap;
uniform float repeats;

// Inside main(), using the interpolated UVs.
vec2 sampleUv = vUv * repeats;
vec3 colour = texture2D(colourMap, sampleUv).rgb;
```

### TSL

```js
// colourMap is an already-loaded THREE.Texture.
const repeats = uniform(4.0);

const sampleUv = uv().mul(repeats);
const colour = texture(colourMap, sampleUv).rgb;

// Application code, for example in a slider handler.
repeats.value = 8.0;
```

With GLSL, we'd update the uniform through the material's uniforms object. With TSL, we update `.value` on the uniform node. Either way, we can change the parameter without rebuilding the shader.

As usual, if you want the texture to tile, its wrapping needs to be set to repeat. Colour textures also need the appropriate colour-space setting; normal maps and other data textures shouldn't be treated as colour images.

## Functions

Functions look a little different. We wrap the function in `Fn`, and its arguments arrive in an array, which is why you see `([value])` below. Apart from that, we're writing the same calculation. Calling this function builds a shader expression; it doesn't calculate the result on the CPU.

### GLSL

```glsl
float remapSigned(float value) {
  return value * 0.5 + 0.5;
}

// Inside main().
float blend = remapSigned(sin(vUv.x));
```

### TSL

```js
const remapSigned = Fn(([value]) => {
  return value.mul(0.5).add(0.5);
});

const blend = remapSigned(sin(uv().x));
```

## Variables and conditions

Sometimes we want a variable that we can modify while the shader runs. In TSL, we can create one with `.toVar()` inside `Fn`, then change it using `.assign()` or methods like `.addAssign()`.

Conditions have a similar distinction. An ordinary JavaScript `if` runs when we're constructing the shader. If we want the condition to be evaluated in the shader itself, for example to check the UV of each pixel, we use TSL's `If` instead.

### GLSL

```glsl
vec3 splitColour(vec2 p) {
  vec3 colour = vec3(0.0, 0.0, 1.0);

  if (p.x > 0.5) {
    colour = vec3(1.0, 0.0, 0.0);
  }

  return colour;
}
```

### TSL

```js
const splitColour = Fn(([p]) => {
  const colour = vec3(0.0, 0.0, 1.0).toVar();

  If(p.x.greaterThan(0.5), () => {
    colour.assign(vec3(1.0, 0.0, 0.0));
  });

  return colour;
});
```

Again, `const colour` is a JavaScript reference to something in the shader. It doesn't prevent us from changing the shader variable with `.assign()`. Simply writing `colour = ...` in JavaScript wouldn't do the same thing.

The comparison also looks different: `.greaterThan()` replaces `>`. You'll use `.lessThan()` and `.equal()` in the same way for shader comparisons.

If you just want to choose between 2 values, `select(condition, a, b)` is the equivalent of `condition ? a : b`. For a smooth blend rather than a choice, you'd still use `mix`.

## Loops

For loops in the shader, TSL provides `Loop`, which we use inside `Fn`. Here's a small example that adds together 4 samples of a sine wave. The calculation isn't particularly important here; it's just to show how the loop is written.

### GLSL

```glsl
float sumWaves(float x) {
  float total = 0.0;

  for (int i = 0; i < 4; i++) {
    total += sin(x + float(i));
  }

  return total;
}
```

### TSL

```js
const sumWaves = Fn(([x]) => {
  const total = float(0.0).toVar();

  Loop(4, ({ i }) => {
    total.addAssign(sin(x.add(float(i))));
  });

  return total;
});
```

You can also use an ordinary JavaScript loop to construct a fixed set of shader expressions. Just keep in mind that this loop runs while you're building the shader, rather than on the GPU for each pixel.

## A quick recap

- The shader maths carries over: UVs, vectors, textures and functions work the same way conceptually.
- Use `.add()`, `.mul()` and the other node methods for arithmetic on shader values.
- Use `uniform()` for values the application changes, and `.toVar()` for values the shader changes.
- Use `Fn`, `If` and `Loop` when writing shader functions and control flow.

That's most of what you'll need to get started. You can keep this page open alongside the exercises and refer back to the comparisons whenever the TSL syntax looks unfamiliar.

## Why TSL?

So why use TSL at all, rather than just write GLSL?

A large part of it is hiding the differences between the rendering backends. Three.js can turn the same TSL expressions into GLSL for WebGL or WGSL for WebGPU. You can also use TSL to write compute shaders, although compute is a different kind of GPU workload, not another shader language. That doesn't mean every feature works on every backend, but it does mean you don't have to maintain 2 versions of a lot of your shader code.

Since we're writing JavaScript, much of the surrounding code is immediately familiar. We can use imports, organise reusable functions into modules, and connect parameters to the rest of the application without putting shader source into strings.

For me, another useful part is being able to override specific pieces of a material. Maybe you just want to change how the normals are calculated, or supply your own colour calculation, while keeping the existing lighting. Node materials give us places to do that, such as [`normalNode`](https://threejs.org/docs/pages/NodeMaterial.html#normalNode) and [`colorNode`](https://threejs.org/docs/pages/NodeMaterial.html#colorNode). We don't have to replace the entire shader or search through generated GLSL to patch a particular line. `colorNode` supplies the material's base colour; it's not necessarily the final lit pixel colour. There are separate [output hooks](https://threejs.org/docs/pages/NodeMaterial.html#outputNode) when we want to replace the result more directly.

There are trade-offs, though:

- **It's often more verbose.** A short mathematical expression can turn into quite a few nested method calls. You can see that in the arithmetic examples above.
- **The types aren't as straightforward.** The generated shader still has types, and TypeScript tooling can help, but plain JavaScript doesn't give us GLSL's explicit type declarations and shader-specific checks. Some mistakes only become apparent when the shader is built or compiled.
- **It's tied to Three.js.** The underlying maths transfers to other engines, but the TSL code and material hooks generally don't transfer directly.
- **There's still work to do at runtime.** In the Three.js version used for this course, there isn't a standard offline build step that turns a TSL material into a ready-to-load shader and removes the need to construct its graph. The JavaScript still runs to build that graph, then Three.js generates the shader and the browser compiles it. That adds startup work compared with supplying shader source directly. It doesn't mean the graph is rebuilt every frame; unchanged shaders can be reused.
- **Debugging can be less direct.** You're writing TSL, but a shader compiler error may refer to the generated GLSL or WGSL. Sometimes you'll need to look at both to understand what's gone wrong.

One detail worth separating out: Three.js does provide [`compileAsync()`](https://threejs.org/docs/pages/Renderer.html#compileAsync) to prepare a scene's materials before they're first rendered. That can help avoid a hitch when something first appears, but it's still preparation in the running application, not offline compilation that lets us skip building the TSL graph. Supplying GLSL or WGSL source directly also doesn't remove the browser's GPU compilation step.

So I wouldn't describe TSL as automatically better than GLSL. If you're customising Three.js materials or targeting its newer rendering system, it can make a lot of the surrounding work easier. If you're writing a lot of dense shader maths, GLSL may still be easier to read. The useful part is that most of what you've learned carries over either way.

For more detail, see the [TSL documentation](https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language).