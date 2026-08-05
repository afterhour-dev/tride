import './style.css';
import * as THREE from 'three/webgpu';

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
	// I wanted view to be more like 3d
	// since before z axe was going normal to our camera lense
	// made axe helper invisible and made our object to apea 2D
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

	// ----------------------------------------------
	renderer.setSize(sizes.width, sizes.height);
	renderer.setClearColor(0x000000, 1);
	renderer.render(scene, camera);

	// ------ Animations - basic , primitive way  ------------------
	// EXPLAIN: I named it primitive because we only use
	// Date.now() to get the time and then we use it to
	// transform our object
	let time = Date.now();

	tick();
	// EXPLAIN: should I use tick() or window.requestAnimationFrame(tick) here
	// and why?
	// window.requestAnimationFrame(tick);

	// ----------------------------------------------------------

	function tick() {
		// EXPLAIN: adaptation of the framerate (
		// making animation feel the same for all users)
		const currentTime = Date.now();
		// EXPLAIN: delta time
		const deltaTime = currentTime - time;
		time = currentTime;

		mesh.position.x += 0.001;
		// mesh.rotation.y = time * 0.0002;
		// using deltaTime
		mesh.rotation.y += deltaTime * 0.0002;

		// EXPLAIN: why using lookAt here
		// yes, this will allow for object t be followed by
		// camera view but I need better explanation
		camera.lookAt(mesh.position);

		// EXPLAIN: this clearly makes animation possible but I need
		// better explanation
		renderer.render(scene, camera);

		// EXPLAIN: why we use window.requestAnimationFrame
		// and not just simple rqursion

		window.requestAnimationFrame(tick);
	}
}

await init();
