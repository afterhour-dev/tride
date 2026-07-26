# Vite starter with WebGPU

Koristiću ovo kao starter za naredne aplikacije. Ovde se po prvi put dotičem WebGPU-a.

## Namera / Intent

App je napravljen da bude starter za buduće aplikacije koje će koristiti WebGPU kao nešto što predpostavljam da će developeri usvojiti kao osnovnu tehnologiju, ako već nisu.

## Šta treba objasniti u detalje

- razlika između upotrebe WebGPU i ranijeg WebGL u nasoj aplikaciji

- objasniti i sledeće navode:
	1. Initialization is async. WebGPURenderer needs to negotiate a GPU adapter/device before it can render — this happens asynchronously under the hood. You have two options:
	2. Call await renderer.init() once, then render normally with renderer.render(scene, camera).
	3. Or skip init() and just call await renderer.renderAsync(scene, camera) each frame — it'll lazily init on first call. 

- objasniti zašto se pri korišćenju WebGPU, sledeće mora podesiti, a nije moralo pri korišćenju WebGL
	```ts
	renderer.setClearColor(0x000000, 1);
	```

- u slucaju vite-a da li mi je potreban `vite-plugin-top-level-await`

- čuo sam da ShaderMaterial/RawShaderMaterial i onBeforeCompile() hacks nisu supported under WebGPURenderer, ovo verovatno ima veze sa shaderima i objasni kada se koriste i zašto se koriste, i zašto nisu podržani više

## Šta samo ukratko pomenuti

- pomeni zašto sam uradio ovaj assignment u ovom slučaju:
	```ts
	const canvasEl: HTMLCanvasElement | null =
	document.querySelector('canvas#tride');

	if (!canvasEl) throw new Error('Canvas element is missing!');

	const canvas = canvasEl;
	```