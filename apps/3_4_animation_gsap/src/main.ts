import './style.css';
import * as THREE from 'three/webgpu';
import gsap from 'gsap';

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
		wireframe: true,
	});

	const mesh = new THREE.Mesh(boxGeometry, material);

	mesh.position.x = -0.5;
	mesh.position.z = 0.5;

	scene.add(mesh);

	// --------------------------------------------------------

	// 3 - Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		sizes.width / sizes.height,
	);
	camera.position.z = 3;
	camera.position.y = 0.5;
	camera.position.x = 0.1;

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
	// ----------------------------------------------------
	// --------------- animation with gsap ----------------
	// EXPALIN: usage of gsap, and what are best practices

	// EXPLAIN: is gsap responsible for animation frame stuff

	// EXPLAIN: are we using gsap correct way here

	gsap.to(mesh.position, {
		duration: 4,
		y: 1.5,
		ease: 'bounce.in',
	});
	gsap.to(mesh.rotation, {
		z: Math.PI * 2, // 360
		duration: 15,
		ease: 'elastic.in',
		repeat: 2,
		yoyo: true, // reverse the animation on every other interaction
	});
	gsap.fromTo(
		mesh.scale,
		{ y: 0.5, delay: 2 },
		{
			y: 1.5,
			repeat: -1, // infinite
			yoyo: true,
			duration: 6,
		},
	);
	// ----------------------------------------------------
	// ----------------------------------------------------

	const timer = new THREE.Timer();

	window.requestAnimationFrame(tick);

	// ----------------------------------------------------

	function tick(timestamp: number) {
		timer.update(timestamp);

		// const elapsedTime = timer.getElapsed();

		// EXPLAIN: why we commented out look at
		// I assume we don't want our camera to follow our
		// mesh
		// camera.lookAt(mesh.position);

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	}
}

await init();
