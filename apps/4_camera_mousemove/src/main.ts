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
	// EXPLAIN: Do I understand what we enclosed in next
	// console.log calls correctly:
	// by doing this we ensure that when
	// cursor is on the left top on the canvas
	// x and y are 0
	// and when cursor is on bottom right of the canvas
	// x and y are 1
	// and other values when we move across canvas are
	// betwen 0 and 1
	// and this is only whan we drag cursor across canvas
	// if we step out values are above 1, but
	// that is not important since we are looking
	// just canvas
	console.log('X ', ev.clientX / sizes.width);
	console.log('Y', ev.clientY / sizes.height);

	// EXPLAIN: Do I understand what we enclosed in next  console.log
	//  calls correctly: what we do if we want 0,0
	// in the center of canvas to mimic entire canvas as
	//  Cartesian coordinate system
	// we subtract 0.5 from ev.clientX / sizes.width
	// and we subtract ev.clientY / sizes.height from 0.5
	// to have ranges betwen -0.5 and 0.5 both by vertical
	// or horizontal of the canvas

	console.log('------ cartesian -------');
	console.log('X', ev.clientX / sizes.width - 0.5);
	console.log('Y', 0.5 - ev.clientY / sizes.height);
	console.log('-------------------------');

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
	const camera = new THREE.PerspectiveCamera(
		75,
		sizes.width / sizes.height,
		0.1,
		100,
	);

	camera.position.z = 3;
	camera.position.y = 0.5;
	camera.position.x = 1;

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
		// and what we acomplished
		camera.position.x = cursor.x;
		camera.position.y = cursor.y;

		// EXPLAIN: we may comment out this
		// if we don't want camera to look at our mesh
		// camera.lookAt(mesh.position);

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	}
}

await init();
