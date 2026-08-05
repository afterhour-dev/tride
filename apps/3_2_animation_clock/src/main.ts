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

	// ------ Animations - Clock way   ------------------
	// EXPLAIN: Is usage of Clock deprecated?
	// I see that in the documentation it is not used anymore.
	// and in typescript is marked as deprecated.
	// I want your opinion why?
	const clock = new THREE.Clock();

	// EXPLAIN: On line bellow should I use tick() or
	//  window.requestAnimationFrame(tick) and why?
	// What is better in case of first invocation of tick function?
	tick();
	// window.requestAnimationFrame(tick);

	// ----------------------------------------------------------

	function tick() {
		// EXPLAIN: difference between elapsedTime and getElapsedTime
		// const elapsedTime = clock.elapsedTime
		const elapsedTime = clock.getElapsedTime();

		// mesh.rotation.y = elapsedTime;
		// mesh.rotation.y = (elapsedTime * Math.PI) / 180;
		// EXPLAIN: what kinfd of math we used here and do you
		// have to offer any helpers we can use to easly learn these
		// functions and vizualize them
		mesh.rotation.y = elapsedTime * Math.PI * 0.2;
		camera.position.x = Math.cos(elapsedTime);
		mesh.position.y = Math.sin(elapsedTime);
		// -----------------------------

		camera.lookAt(mesh.position);

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	}
}

await init();
