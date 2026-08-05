import './style.css';
import * as THREE from 'three/webgpu';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const sizes = {
	width: 800,
	height: 600,
};

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
	// EXPLAIN: all parameters, and what values are mostly used
	// EXPLAIN: Doesit inherit from Camera class
	const camera = new THREE.PerspectiveCamera(
		45,
		sizes.width / sizes.height,
		0.1,
		100,
	);

	camera.position.z = 3;
	camera.position.y = 0.5;
	camera.position.x = 0.1;

	// console.log(camera.position.length());

	scene.add(camera);

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

		const elapsedTime = timer.getElapsed();

		// EXPLAIN: we know that camera is looking at
		// mesh, but where is the center of its rotation
		// I assume it is in the center of the scene. If
		// that's true, tell me why
		// EXPLAIN: in cos or sin functions, in the example, what
		// we call 0.2 number, and what we call number 3
		// and what impact has changing values of these numbers
		// and what are best practices
		camera.position.x = Math.cos(Math.PI * elapsedTime * 0.2) * 3;
		camera.position.z = -Math.sin(Math.PI * elapsedTime * 0.2) * 3;

		camera.lookAt(mesh.position);
		// camera.lookAt(new THREE.Vector3(1, 0, 1));

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	}
}

await init();
