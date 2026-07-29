import './style.css';
import * as THREE from 'three/webgpu';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const sizes = {
	width: 800,
	height: 600,
};

// ------------------------------------------------------------
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener('mousemove', (ev) => {
	// EXPLAIN: in tick function we will use
	// these values together with trigonometry
	// to ensure circular movement of the camera as we move
	// cursor left or right, which I assume we will use
	// cursor x value to acomplish that, and y values
	// will only be useful to move camera up and down by y.
	// Expand on this usage of x, which means explain it better
	// if I'm right, and provide some greater insight of how we can
	// vizualize and learn trigonometry better and easier

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

		camera.position.y = cursor.y * 0.9;

		// EXPLAIN: what we did in the next commented out line
		// we just use Math.PI in cosinus function and we use
		// cursor.x as representation of what number, meaning
		// what we call the number that is multiplying Math.PI
		// camera.position.x = Math.cos(Math.PI * cursor.x);
		// camera.position.z = Math.sin(Math.PI * cursor.x);

		// EXPLAIN: number 2 and number 4 in next exprssions; and
		// why and how we are using them, and is there a good helper to
		// visualize this kind of trigonometry animation if
		// I can call it like that
		camera.position.x = Math.sin(Math.PI * cursor.x * 2) * 2.5;
		camera.position.z = Math.cos(Math.PI * cursor.x * 2) * 2.5;

		// EXPLAIN: camera will go around center of the scene
		// Am I right because of that?
		// I assume because of the x value that can be
		// -0.5 on the far left and 0.5 on the far right and

		// EXPLAIN: in order that lense of the camera is pointed
		// at the mesh or pointed at center of the scene we
		// use lookAt
		camera.lookAt(mesh.position);
		// camera.lookAt(new THREE.Vector3(0, 0, 0));

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	}
}

await init();
