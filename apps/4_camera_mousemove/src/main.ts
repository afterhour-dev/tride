import './style.css';
import * as THREE from 'three/webgpu';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const sizes = {
	width: 800,
	height: 600,
};

// ---- taking values intended for moving camera with mouse ----
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener('mousemove', (ev) => {
	// console.log(ev.clientX, ev.clientY);
	// EXPLAIN: Do I understand this correctly:
	// by doing this we ensure that when
	// cursor is on the left top on the canvas
	// x and y are 0
	// and when cursor is on bottom right of the canvas
	// x and y are 1
	// and other values when we move acros canvas are
	// betwen 0 and 1
	// console.log(ev.clientX / sizes.width);
	// console.log(ev.clientY / sizes.height);

	// EXPLAIN: Do I understand this correctly
	// but what we do if we want 0,0 in the center of canvas
	// to treat entire canvas as Cartesian coordinate system
	// we substract 0.5 from the values or substract value from 0.5
	// to have ranges betwen -0.5 and 0.5

	// we don't need this like that
	// we don't need cartesian coordinate system
	// we need more like left to be negative
	// rigt to be positive
	// bottom to be negative, up to be positive no matter what
	// so we will fix this tomorrow

	console.log(ev.clientX / sizes.width - 0.5);
	console.log(0.5 - ev.clientY / sizes.height);

	cursor.x = ev.clientX / sizes.width - 0.5;
	cursor.y = 0.5 - ev.clientY / sizes.height;
});

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
	// EXPLAIN: all parameters, and what values are mostly used
	// EXPLAIN: Doesit inherit from Camera class
	const camera = new THREE.PerspectiveCamera(
		75,
		sizes.width / sizes.height,
		0.1,
		100,
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
	const timer = new THREE.Timer();

	window.requestAnimationFrame(tick);
	// ----------------------------------------------------

	function tick(timestamp: number) {
		timer.update(timestamp);

		// const elapsedTime = timer.getElapsed();

		// EXPLAIN: why and how we are using these values
		camera.position.x = cursor.x;
		camera.position.z = cursor.y;

		camera.lookAt(mesh.position);

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	}
}

await init();
