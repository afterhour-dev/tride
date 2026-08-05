// import './style.css';
// import from "three/webgpu"
import * as THREE from 'three/webgpu';

// Canvas Element
const canvasEl: HTMLCanvasElement | null =
	document.querySelector('canvas#tride');

if (!canvasEl) throw new Error('Canvas element is missing!');

// 0 - Canvas
// because of typescript error doing it like this
const canvas = canvasEl;

const sizes = {
	width: 800,
	height: 600,
};

async function init() {
	// 1 - Scene
	const scene = new THREE.Scene();

	// 2 - Geometry, Material  ->    Mesh
	// const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({
		color: 0x4c9892,
		// color: 'purple',
		// wireframe: true,
	});

	const mesh = new THREE.Mesh(boxGeometry, material);
	scene.add(mesh);

	// 3 - Camera
	const camera = new THREE.PerspectiveCamera(
		// in projects that are outhere on the web, this number is
		// offten more to range of 35
		75,
		sizes.width / sizes.height,
	);
	camera.position.z = 3;
	camera.position.x = 0.5;
	scene.add(camera);

	// (important for webggpu) 4 - Renderer
	const renderer = new THREE.WebGPURenderer({ canvas });
	// (also important)
	await renderer.init(); // <-- the important async step

	// 5 - axes helper
	const axesHelper = new THREE.AxesHelper(5);
	axesHelper.setColors('red', 'green', 'blue');
	scene.add(axesHelper);

	// ----------------------------------------------
	renderer.setSize(sizes.width, sizes.height);
	renderer.setClearColor(0x000000, 1);
	renderer.render(scene, camera);
}

await init();
