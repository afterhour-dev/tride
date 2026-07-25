```ts
import * as THREE from 'three/webgpu';

const canvas = document.querySelector<HTMLCanvasElement>('canvas#tride');
if (!canvas) throw new Error('Canvas element is missing!');

const sizes = { width: 800, height: 600 };

async function init() {
	const scene = new THREE.Scene();

	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0x4c9892 });
	const mesh = new THREE.Mesh(boxGeometry, material);
	scene.add(mesh);

	const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
	camera.position.z = 3;
	camera.position.x = 0.5;
	scene.add(camera);

	const renderer = new THREE.WebGPURenderer({ canvas });
	await renderer.init(); // <-- the important async step

	const axesHelper = new THREE.AxesHelper(5);
	axesHelper.setColors('red', 'green', 'blue');
	scene.add(axesHelper);

	renderer.setSize(sizes.width, sizes.height);
	renderer.render(scene, camera);
}

init();
```