import './style.css';
import * as THREE from 'three/webgpu';
// import gsap from 'gsap';
// EXPLAIN: next line
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { getRequiredElement } from './util';

const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const sizes = {
	width: 800,
	height: 600,
};

// ------------------------------------------------------------
// EXPLAIN: Ovo nam vise ne treba jer cemo koristi OrbitControls
/* 
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener('mousemove', (ev) => {
	cursor.x = ev.clientX / sizes.width - 0.5;
	cursor.y = 0.5 - ev.clientY / sizes.height;
}); */

// -------------------------------------------------------------

async function init() {
	const scene = new THREE.Scene();

	const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
	const material = new THREE.MeshBasicMaterial({
		color: 0x4c9892,
		// color: 'purple',
		// wireframe: true,
	});

	const mesh = new THREE.Mesh(boxGeometry, material);

	mesh.position.x = -0.5;
	mesh.position.z = 0.5;

	scene.add(mesh);

	// --------------------------------------------------------

	// 3 - Perspective Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		sizes.width / sizes.height,
		0.1,
		100,
	);

	camera.position.z = 3;
	// camera.position.y = 0.5;
	camera.position.x = 1;

	scene.add(camera);

	// Orbit Controls
	// EXPLAIN: what we did here, explain parameters
	const orbitControls = new OrbitControls(camera, canvas);
	// EXPLAIN: why we don't need to add OrbitControl instance to the scene
	// explicitly

	// EXPLAIN: should we call orbitControl.update() here
	// or not (if we don't change anything on it); we did call it in tick function but I'm not sure should
	// we do it here or not?

	// EXPLAIN: but we need to call update after we change target
	// value for example; Also explain what is target?
	// orbitControls.target.y = 1.5;
	// orbitControls.update();

	// EXPLAIN: what is damping. Also do we need to call update
	// after setting damping to true or is update in tick function
	// enough?
	orbitControls.enableDamping = true;
	// orbitControls.update()

	// EXPLAIN: are there any other useful propertis on orbitControls
	// that are offten use

	// ------------------------------------------------
	// 4 - Renderer
	const renderer = new THREE.WebGPURenderer({ canvas });
	await renderer.init();

	// 5 - axes helper
	const axesHelper = new THREE.AxesHelper(5);
	axesHelper.setColors('red', 'green', 'blue');
	scene.add(axesHelper);

	// ----------------------------------------------------
	renderer.setSize(sizes.width, sizes.height);
	renderer.setClearColor(0x000000, 1);
	renderer.render(scene, camera);

	// ----------------------------------------------------
	const timer = new THREE.Timer();

	window.requestAnimationFrame(tick);
	// ----------------------------------------------------

	function tick(timestamp: number) {
		timer.update(timestamp);

		// const elapsedTime = timer.getElapsed();

		// EXPLAIN:ovo mi vise ne treba jer koristim OrbitControls
		// camera.position.x = Math.sin(Math.PI * cursor.x * 2) * 2.5;
		// camera.position.z = Math.cos(Math.PI * cursor.x * 2) * 2.5;
		// camera.position.y = cursor.y * 0.9;

		// EXPLAIN: moramo da updajtujemo orbitControls
		orbitControls.update();

		// camera.lookAt(mesh.position);
		// camera.lookAt(new THREE.Vector3());

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	}
}

await init();
