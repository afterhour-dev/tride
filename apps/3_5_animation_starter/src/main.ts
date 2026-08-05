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

	// ------ Animations - Timer way   ------------------

	const timer = new THREE.Timer();

	window.requestAnimationFrame(tick);

	// ----------------------------------------------------------

	function tick(timestamp: number) {
		timer.update(timestamp);

		const elapsedTime = timer.getElapsed();

		// mesh.rotation.y = elapsedTime;
		// mesh.rotation.y = (elapsedTime * Math.PI) / 180;

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
