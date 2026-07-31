import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { getRequiredElement } from './util';

const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

async function init() {
	const scene = new THREE.Scene();

	// 1 - Geometries Materials Meshes

	// EXPLAIN: Float32Array, what single digit parameter means
	// and are there any other parameters
	const verticesPositionArray = new Float32Array(9);
	// I think you can also defini it like this
	/* const otherVerticesPositionArray = new Float32Array([
		// first vertex
		0, 0, 0,
		// second vertex
		0, 1, 0,
		// third vertex
		1, 0, 0,
	]); */

	// Vertex one
	verticesPositionArray[0] = 0;
	verticesPositionArray[1] = 0;
	verticesPositionArray[2] = 0;

	// Vertex two
	verticesPositionArray[3] = 0;
	verticesPositionArray[4] = 2;
	verticesPositionArray[5] = 0;

	// Vertex three
	verticesPositionArray[6] = 0;
	verticesPositionArray[7] = 0;
	verticesPositionArray[8] = 2;

	// EXPLAIN:
	const bufferGeometry = new THREE.BufferGeometry();

	// EXPLAIN:
	bufferGeometry.setAttribute(
		'position',
		// EXPLAIN: I assume 3 is the number of vertices
		new THREE.BufferAttribute(verticesPositionArray, 3),
	);

	const material = new THREE.MeshBasicMaterial({
		color: 0x4c9892,
		// color: 'purple',
		// wireframe: true,
	});

	// EXPLAIN:
	const mesh = new THREE.Mesh(bufferGeometry, material);

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

	// 4 - Orbit Controls
	const orbitControls = new OrbitControls(camera, canvas);

	orbitControls.enableDamping = true;
	// orbitControls.enabled = false;
	// orbitControls.update()

	// ------------------------------------------------
	// 5 - Renderer
	const renderer = new THREE.WebGPURenderer({ canvas });
	await renderer.init();

	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	// 6 - axes helper
	const axesHelper = new THREE.AxesHelper(5);
	axesHelper.setColors('red', 'green', 'blue');
	scene.add(axesHelper);

	// ----------------------------------------------------
	renderer.setSize(sizes.width, sizes.height);
	renderer.setClearColor(0x000000, 1);
	renderer.render(scene, camera);

	// --------------------------------------------------------------
	window.addEventListener('resize', () => {
		sizes.width = window.innerWidth;
		sizes.height = window.innerHeight;

		camera.aspect = sizes.width / sizes.height;

		camera.updateProjectionMatrix();

		renderer.setSize(sizes.width, sizes.height);

		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	});
	// --------------------------------------------------------------

	window.addEventListener('dblclick', () => {
		const fullScreenElement =
			// @ts-expect-error can't find it on document but it is there
			document.fullscreenElement || document.webkitExitFullscreenExit;

		if (!fullScreenElement) {
			if (canvas.requestFullscreen) {
				canvas.requestFullscreen();
				// @ts-expect-error can't find it on document but it is there
			} else if (canvas.webkitRequestFullScreen) {
				// @ts-expect-error can't fid it on document but it is there
				canvas.webkitRequestFullScreen();
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
				// @ts-expect-error can't find it on document but it is there
			} else if (document.webkitExitFullscreen) {
				// @ts-expect-error can't find it on document but it is there
				document.webkitExitFullscreen();
			}
		}
	});

	// --------------------------------------------------------------
	const timer = new THREE.Timer();

	window.requestAnimationFrame(tick);
	// ----------------------------------------------------

	function tick(timestamp: number) {
		timer.update(timestamp);

		// const elapsedTime = timer.getElapsed();

		orbitControls.update();

		// camera.lookAt(new THREE.Vector3());

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	}
}

await init();
